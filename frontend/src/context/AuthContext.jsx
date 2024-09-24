import { useState, useEffect, createContext } from "react";
import { auth } from "../Config/firebase-config";
const AuthContext = createContext(null);
/**
* @return isAuthenticated: [-1,0,1] : 
{
 -1: noUser,
 0: not authenticated,
 1: authenticated,
}
 * @return user: firebase user object
 * @return setAuthentication: function to set authentication status
*/
const useAuth = () => {
  const [user, setUser] = useState(null);

  const [isAuthenticated, setAuthentication] = useState(-1);

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
