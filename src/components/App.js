import { useState, useEffect } from "react";
import AppRouter from "components/Router";
import { getAuth, updateProfile } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    getAuth().onAuthStateChanged(async (user) => {
      if (user) {
        if (user.displayName === null) {
          await updateProfile(user, {
            displayName: "Not setted",
          });
        }
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
        });
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    // firebase에서 갱신된 (onAuthStateChanged)현 로그인 정보
    const user = getAuth().currentUser;
    if (user) {
      setUserObj({
        displayName: user.displayName,
        uid: user.uid,
      });
    } else {
      setUserObj(null);
    }
  };
  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
          // setUserObj={setUserObj}
        />
      ) : (
        "Initializing..."
      )}
      <footer>&copy; {new Date().getFullYear()} twitter</footer>
    </>
  );
}

export default App;
