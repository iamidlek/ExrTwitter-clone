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
        setUserObj(user);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? (
        <AppRouter
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
          setUserObj={setUserObj}
        />
      ) : (
        "Initializing..."
      )}
      <footer>&copy; {new Date().getFullYear()} twitter</footer>
    </>
  );
}

export default App;
