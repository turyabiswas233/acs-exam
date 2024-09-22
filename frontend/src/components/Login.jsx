import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../Config/firebase-config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in both email and password fields.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // console.log("User signed in:", userCredential);
      setError("");
      // Redirect or perform further actions after successful login
    } catch (error) {
      console.error("Error signing in:", error);
      setError(
        "Failed to log in. Please check your email and password and try again."
      );
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in result:", result);
      setError("");
      // Redirect or perform further actions after successful Google login
    } catch (error) {
      console.error("Error during Google sign in:", error);
      setError("Failed to log in with Google. Please try again.");
    }
  };
  /*
@turyabiswas233: I HAVE REMOVED THE PART FROM THE WEBSITE FOR MORE EFFICIENT RESULT
*/
  return (
    <div>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box bg-gray-800 text-white max-w-sm">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg ">Login</h3>
          <div className="mt-4 space-y-2">
            <span>Email</span>
            <br />
            <input
              type="email"
              placeholder="Enter your Email"
              className={`w-full px-3 py-1 border rounded-md outline-none ${
                error ? "border-red-500" : ""
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mt-4 space-y-2">
            <span>Password</span>
            <br />
            <input
              type="password"
              placeholder="Enter your Password"
              className={`w-full px-3 py-1 border rounded-md outline-none ${
                error ? "border-red-500" : ""
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="w-full text-right place-self-end text-sm text-blue-200 ">
              <button
                className="underline"
                type="button"
                onClick={() => {
                  nav("/forgetpassword");
                }}
              >
                forget password?
              </button>
            </p>
          </div>

          {error && <p className="text-red-500 mt-2">{error}</p>}

          <div className="flex flex-col items-center mt-4 space-y-2">
            <button
              className="bg-blue-500 text-white rounded-md px-3 py-1 hover:bg-blue-900 duration-200"
              onClick={handleLogin}
            >
              Login
            </button>
            <button
              className="bg-red-500 text-white rounded-md px-3 py-1 hover:bg-red-900 duration-200"
              onClick={loginWithGoogle}
            >
              Login with Google
            </button>
            <p>
              Not registered?{" "}
              <Link
                to="/signup"
                className="underline text-blue-500 cursor-pointer"
              >
                Signup
              </Link>
            </p>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default Login;
