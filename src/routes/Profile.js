import { signOut, getAuth, updateProfile } from "firebase/auth";
import { useHistory } from "react-router-dom";
// import { dbService,authService } from "fbase";
// import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useState } from "react";

const Profile = ({ setUserObj, userObj }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onLogOutClick = () => {
    signOut(getAuth());
    setUserObj(null);
    history.push("/");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(userObj, { displayName: newDisplayName });
    }
  };

  // const getMyNweets = async () => {
  //   const q = query(
  //     collection(dbService, "nweets"),
  //     where("creatorId", "==", userObj.uid)
  //     // orderBy("createdAt", "desc")
  //     // 같은 필드만 가능.. 복합 색인 추가하면 이용가능
  //   );
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     console.log(doc.id, " => ", doc.data());
  //   });
  // };

  // useEffect(() => {
  //   getMyNweets();
  // }, []);
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};
export default Profile;
