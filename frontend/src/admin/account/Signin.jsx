import React, { useContext, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Input from "../Input";
import { AuthContext } from "../../context/AuthContext";
import { auth } from "../../Config/firebase-config";
import {
  updateProfile,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  MdAccessibility,
  MdEmail,
  MdFace,
  MdPhone,
  MdSettings,
  MdVerified,
} from "react-icons/md";
import { fetchAdminInfo } from "../../hooks/adminHook";

function Signin() {
  const [adminInfo, setAdminInfo] = useState({
    email: "",
  });
  const [pass, setPass] = useState("");
  const [loginStat, setStat] = useState(null);
  const [user] = useContext(AuthContext);
  const { data, error } = fetchAdminInfo(user?.uid || "");

  useEffect(() => {
    const loop = setTimeout(() => {
      setStat(null);
      clearTimeout(loop);
    }, 4000);
    return () => clearTimeout(loop);
  }, [loginStat]);

  function handleInfo(e) {
    setStat(null);
    setAdminInfo((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  }

  function getSecretKey(e) {
    e.preventDefault();

    signInWithEmailAndPassword(auth, adminInfo.email, pass)
      .then(async (res) => {
        if (!data)
          setStat({
            success: false,
            message: "No valid user found as Teacher/Admin",
          });
      })
      .catch((err) => {
        console.log({ ...err });
        if (err.code === "auth/invalid-credential")
          setStat({ success: false, message: "Wrong email or password" });
        else if (err.code === "auth/too-many-requests")
          setStat({ success: false, message: "Too many attempts. Try later." });
        else setStat({ success: false, message: "Failed to login" });
      });
  }

  return (
    <div className="w-full grid place-items-center p-3">
      {!user ? (
        <form
          className="bg-white rounded-2xl shadow-lg text-black space-y-2 p-10 w-full mx-2 max-w-sm my-10"
          onSubmit={getSecretKey}
        >
          <h2 className="text-center font-bold text-3xl lg:text-4xl mb-10">
            Sign In
          </h2>

          <Input
            id={"email"}
            name={"email"}
            title={"Email address"}
            type={"email"}
            required={true}
            setValue={handleInfo}
            value={adminInfo.email}
            placeholder={"Email Address"}
          />

          <Input
            id={"pass"}
            name={"password"}
            title={"Password"}
            type={"password"}
            required={true}
            setValue={(e) => setPass(e.target.value)}
            value={pass}
            placeholder={"Password"}
          />
          {false && (
            <Input
              id={"s_key"}
              name={"ssKey"}
              title={"Secret Key"}
              type={"text"}
              required={true}
              setValue={handleInfo}
              value={adminInfo.ssKey}
              placeholder={"Secret Key"}
              help={true}
              helpTitle={`Your secret key is totally different from your password.\nYou may get it from your office..`}
            />
          )}

          <button
            className="w-full btn border-none bg-blue-600 hover:bg-blue-700 text-white dm-sans-medium"
            type="submit"
            required={true}
          >
            Sign In
          </button>
          <div>
            {loginStat != null &&
              (loginStat?.success ? (
                <div className="bg-green-100 text-green-600 dm-sans-medium ring-1 ring-green-600 rounded-md px-3 py-2">
                  {loginStat?.message}
                </div>
              ) : (
                <div className="bg-rose-100 text-rose-600 dm-sans-medium ring-1 ring-rose-600 rounded-md px-3 py-2">
                  {loginStat?.message}
                </div>
              ))}
          </div>
          <p className="text-right text-sm text-gray-700/60 tracking-tight">
            Not an admin user?{" "}
            <a
              className="text-blue-600 font-medium hover:underline dm-sans-bold"
              href="/login"
            >
              Login
            </a>{" "}
            to student
          </p>
        </form>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg text-black space-y-3 mt-8 p-10 grid text-sm md:text-base mx-auto">
          <div>
            <button
              type="button"
              className="text-red-50 bg-red-500 rounded-md px-5 py-1 float-right"
              onClick={() => {
                window.localStorage.clear();
                window.location.reload();
              }}
            >
              Refresh
            </button>
          </div>
          <div className="grid sm:inline-flex items-center gap-2 text-slate-400 hover:bg-slate-100 p-2 rounded-md">
            <MdFace className="text-blue-500" />
            {data?.displayName ? (
              data?.displayName
            ) : (
              <div className="grid gap-2">
                <Input
                  id={"addName"}
                  name={"f_name"}
                  value={adminInfo.f_name}
                  setValue={handleInfo}
                  placeholder={"Enter full name"}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={async () => {
                    if (adminInfo.f_name.length > 2) {
                      try {
                        updateProfile(user, {
                          displayName: adminInfo.f_name,
                        }).then(() => {
                          console.log("login success");
                        });
                      } catch (error) {
                        console.log(error);
                      }
                    }
                  }}
                >
                  Update
                </button>
              </div>
            )}
          </div>
          <div className="grid sm:inline-flex items-center gap-2 text-slate-400 hover:bg-slate-100 p-2 rounded-md">
            <div className="flex">
              <MdEmail className="text-blue-500" />
              <MdVerified className="text-green-500" />
            </div>
            {data?.email}
            {!user?.emailVerified ? (
              <button
                className="text-sm btn border-0 bg-green-500 hover:bg-green-700 text-white"
                type="button"
                onClick={() => {
                  const url = window.location.origin;
                  console.log(user);
                  // return;
                  sendEmailVerification(user, {
                    url: `${url}/swift-admin/account`,
                  })
                    .then(() => {
                      alert("An email has been sent to " + user?.email);
                    })
                    .catch((err) => console.log("error"));
                }}
              >
                Verify
              </button>
            ) : null}
          </div>
          <div className="grid sm:inline-flex items-center gap-2 text-slate-400 hover:bg-slate-100 p-2 rounded-md">
            <MdPhone className="text-blue-500" />
            {data?.phone}
          </div>
          <div className="grid sm:inline-flex items-center gap-2 text-slate-400 hover:bg-slate-100 p-2 rounded-md">
            <MdSettings className="text-blue-500" />
            {data?.role === "sudo-admin"
              ? "Admin"
              : data?.role === "teacher"
              ? "Teacher"
              : "not-set"}
          </div>
          <div className="grid sm:inline-flex items-center gap-2 text-slate-400 p-2 rounded-md">
            <MdAccessibility className="text-blue-500" />
            Permission: {data?.permission ? "Granted" : "Denied"}
            {!data?.permission && (
              <p className="text-red-500 text-xs">
                *Admin will soon grant you permission.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Signin;
