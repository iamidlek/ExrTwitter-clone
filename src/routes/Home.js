import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  serverTimestamp,
  orderBy,
  onSnapshot,
  query,
} from "firebase/firestore";
import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState("");
  const imgFileInput = useRef();
  const onSubmit = async (event) => {
    event.preventDefault();

    let attachmentUrl = "";
    if (attachment !== "") {
      // 유저 아이디로 폴더 구분 / 파일 이름(npm i uuid)
      // 파일에 대한 ref를 가지게 된다
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      // data_url : 포멧명
      const response = await uploadString(fileRef, attachment, "data_url");
      // response 에서 해당 파일의 주소 정보를 찾을 수 있다
      // console.log(response);
      //storage에 있는 파일 URL로 다운로드 받기
      attachmentUrl = await getDownloadURL(response.ref);
      console.log(attachmentUrl);
    }
    // nweets컬렉션 추가
    const nweetPosting = {
      nweet,
      createdAt: serverTimestamp(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await addDoc(collection(dbService, "nweets"), nweetPosting);
    setNweet("");
    setAttachment("");
    imgFileInput.current.value = null;
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => {
    setAttachment(null);
    imgFileInput.current.value = null;
  };
  useEffect(() => {
    onSnapshot(
      query(collection(dbService, "nweets"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const nweetArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNweets(nweetArray);
      }
    );
  }, []);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input
          ref={imgFileInput}
          type="file"
          accept="image/*"
          onChange={onFileChange}
        />
        <input type="submit" value="Cweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" alt="preview" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
