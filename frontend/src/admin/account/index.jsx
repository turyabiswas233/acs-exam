import React, { useContext, useEffect, useState } from "react";
import Signin from "./Signin";
import Signup from "./Signup";
import { AuthContext } from "../../context/AuthContext";
import { FaCheckCircle } from "react-icons/fa";
const ACCOUNT_CONFIG = {
  SIGNIN: "signin",
  SIGNUP: "signup",
};
const SwitchAccount = ({ value, setvalue }) => {
  return (
    <div className="box-content flex justify-center ring-2 ring-blue-600 my-10 w-fit mx-auto rounded-md shadow-lg px-3 py-1">
      <button
        className="flex gap-2 items-center text-black btn btn-ghost"
        onClick={() => setvalue(ACCOUNT_CONFIG.SIGNIN)}
      >
        <FaCheckCircle
          color={
            value === ACCOUNT_CONFIG.SIGNIN ? "rgb(37,99,235)" : "transparent"
          }
        />{" "}
        Sign in
      </button>
      <button
        className="flex gap-2 items-center text-black btn btn-ghost"
        onClick={() => setvalue(ACCOUNT_CONFIG.SIGNUP)}
      >
        <FaCheckCircle
          color={
            value === ACCOUNT_CONFIG.SIGNUP ? "rgb(37,99,235)" : "transparent"
          }
        />
        Sign up
      </button>
    </div>
  );
};
function AccountPage() {
  const [toggle, setPage] = useState(ACCOUNT_CONFIG.SIGNIN);
  const [user] = useContext(AuthContext);
  useEffect(() => {
    // if (user && toggle !== ACCOUNT_CONFIG.SIGNIN)
    //   setPage(ACCOUNT_CONFIG.SIGNIN);
  }, [user, toggle]);

  return (
    <div className="min-h-screen w-full px-3 py-5 bg-white card my-2">
      <h2 className="text-3xl text-center">Admin Account</h2>
      {!user && <SwitchAccount setvalue={setPage} value={toggle} />}
      <div className="pagination">
        {ACCOUNT_CONFIG.SIGNIN === toggle && <Signin />}
        {ACCOUNT_CONFIG.SIGNUP === toggle && <Signup />}
      </div>
    </div>
  );
}

export default AccountPage;
