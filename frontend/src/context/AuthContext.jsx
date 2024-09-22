import { useState, useEffect, createContext } from "react";
import { auth } from "../Config/firebase-config";
const AuthContext = createContext(null);
const useAuth = () => {
  const [user, setUser] = useState(null);

  const [isAuthenticated, setAuthentication] = useState(-1);
  /*
  isAuthenticated: [-1,0,1] : {
    -1: noUser
    0: not authenticated
    1: authenticated
  }
  */

  useEffect(() => {
    auth.onAuthStateChanged((userD) => {
      setUser(userD);
      if (userD) {
        setAuthentication(userD.emailVerified ? 1 : 0);
        localStorage.setItem("authToken", userD.uid);
      } else setAuthentication(-1);
    });
  }, []);

  return {
    user,
    isAuthenticated,
    setAuthentication,
  };
};
const AuthProvider = ({ children }) => {
  const { user, isAuthenticated, setAuthentication } = useAuth();
  return (
    <AuthContext.Provider value={[user, isAuthenticated, setAuthentication]}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
export { AuthContext, useAuth };
