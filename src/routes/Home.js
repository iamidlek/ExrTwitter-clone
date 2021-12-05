import { useEffect, useState } from "react";
import { dbService } from "fbase";
import {
  collection,
  addDoc,
  serverTimestamp,
  orderBy,
  getDocs,
  query,
} from "firebase/firestore";

const Home = () => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      // nweets컬렉션 추가
      const docRef = await addDoc(collection(dbService, "nweets"), {
        nweet,
        createdAt: serverTimestamp(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    setNweet("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  const getNweets = async () => {
    // 여러 doc 가져오기
    const q = query(collection(dbService, "nweets"));
    // 스냅샷에는 많은 정보가 들어있다
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() => nweet, createdAt;
      const nweetObj = {
        ...doc.data(),
        id: doc.id,
      };
      setNweets((prev) => [nweetObj, ...prev]);
    });
  };
  useEffect(() => {
    getNweets();
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
        <input type="submit" value="Cweet" />
      </form>
      <div>
        {nweets.map((nweet) => (
          <div key={nweet.id}>
            <h4>{nweet.nweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;
