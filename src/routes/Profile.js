import { signOut, getAuth } from "firebase/auth";
import { useHistory } from "react-router-dom";

const Profile = ({ setUserObj }) => {
  const history = useHistory();
  const onLogOutClick = () => {
    signOut(getAuth());
    setUserObj(null);
    history.push("/");
  };
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};
export default Profile;
