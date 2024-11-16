import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import axiox from "axios";
import { auth } from "../Config/firebase-config";
import Toast from "./Toast";
import Input from "./Input";
import axios from "axios";
import { FaGoogle } from "react-icons/fa6";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [toast, showToast] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password fields.");
      return;
    }

    try {
      signInWithEmailAndPassword(auth, email, password);
      // console.log("User signed in:", userCredential.user);
      setError("");
      // Redirect or perform further actions after successful login
    } catch (error) {
      console.error("Error signing in:", error);
      if (error?.message?.includes("network"))
        setError("Failed to log in. No network");
      else
        setError(
          "Failed to log in. Please check your email and password and try again."
        );
    }
  };

  useEffect(() => {
    const loop = setTimeout(() => {
      showToast(false);
    }, 3000);
    return () => clearTimeout(loop);
  }, [toast]);
  // never touch this login code
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      let result = await signInWithPopup(auth, provider);

      const url = import.meta.env.APP_URL;
      if (result) {
        const { data } = await axios.get(`${url}api/user`, {
          method: "GET",
          params: {
            uid: auth?.currentUser?.uid,
          },
        });
        if (data?.message == "old_user") {
          console.log("Old user found");
        } else if (data.message == "new_user") {
          console.log("Creating a new user account...");

          await axiox.post(`${url}api/auth/signup`, {
            uid: result?.user?.uid,
            email: result?.user?.email,
            displayName: result?.user?.displayName,
            phone: result?.user?.phoneNumber
              ? result?.user?.phoneNumber
              : "no number",
          });
          setError("success");
        }
      }

      console.log("Google sign-in result:", result?.user?.email);
    } catch (error) {
      auth?.signOut();
      console.error("Error during Google sign in:", error);
      console.log(error);
      // setError("Failed to log in with Google. Please try again.");
      setError("Failed to create an account. Please try after a few minutes.");
    }
  };
  const { user } = useAuth();
  useEffect(() => {
    let loop = setTimeout(() => {
      if (user?.email) {
        navigate("/settings");
      }
    }, 1000);
    return () => clearTimeout(loop);
  }, [user]);
  return (
    <div className="w-full h-dvh bg-sblack flex justify-center items-center relative">
      {user !== null && error === "success" && (
        <Toast success={true} message={"Login successful"} count={toast} />
      )}

      {user != null ? (
        <div className="modal-box grid bg-blue-900/20 text-blue-200 place-items-center ring-1 ring-blue-400">
          <h2 className="w-full rounded-lg text-lg">
            <span>
              Email: {user?.email} <br />
            </span>
            <span>Name: {user?.displayName}</span> <br />
            <span>Phone: {user?.phoneNumber || "Not provided"}</span>
          </h2>
          {/* <Link to={"/"}>
            <button className="mt-2 px-4 py-2 text-blue-500 text-lg bg-white rounded-md shadow-inner hover:shadow-blue-500 transition">
              Go to Home {">>"}
            </button>
          </Link> */}
        </div>
      ) : (
        <form
          className="bg-white rounded-2xl shadow-lg text-black space-y-2 p-10 w-full mx-2 max-w-sm my-10 shadow-slate-600/30"
          onSubmit={handleLogin}
        >
          <h3 className="text-center font-bold text-3xl lg:text-4xl mb-10">
            Login
          </h3>
          {/* <Input
            id={"email"}
            name={"email"}
            title={"Email address"}
            type={"email"}
            required={true}
            setValue={(e) => setEmail(e.target.value)}
            value={email}
            placeholder={"Email Address"}
          />

          <Input
            id={"pass"}
            name={"pass"}
            title={"Password"}
            type={"password"}
            required={true}
            setValue={(e) => setPassword(e.target.value)}
            value={password}
            placeholder={"Your password"}
          /> */}

          {error && <p className="text-red-500 mt-2">{error}</p>}

          <div className="flex flex-col mt-4 space-y-2 w-full break-words">
            {/* <button
              className="w-full btn border-none bg-blue-600 hover:bg-blue-700 text-white dm-sans-medium"
              type="submit"
              required={true}
            >
              Sign In
            </button> */}
            <p className="text-blue-700 text-lg text-left mt-5 mb-4">
              If you are new to login, you may need to provide additional info
              after you login
            </p>
            <button
              className="w-full btn bg-slate-100 hover:bg-slate-700 text-black dm-sans-medium hover:text-slate-50 border border-slate-700"
              type="button"
              onClick={loginWithGoogle}
            >
              <FaGoogle />
              Login with Google
            </button>

            <p className="text-right text-sm text-gray-700/60 tracking-tight pt-5 hidden">
              Not have an account?{" "}
              <Link
                className="text-blue-600 font-normal hover:underline dm-sans-bold"
                to="/signup"
              >
                signup
              </Link>{" "}
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

export default Login;
