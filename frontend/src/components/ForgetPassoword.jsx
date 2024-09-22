import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../Config/firebase-config";

function ForgetPassoword() {
  const [email, setmail] = useState("");
  return (
    <div className="modal-box my-10 mx-auto bg-white text-black">
      <h2 className="text-2xl">Forget Password!</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendPasswordResetEmail(auth, email).then((re) => {
            alert("Password reset mail has been sent to " + email);
          });
        }}
      >
        <input
          type="email"
          name="email"
          required
          className="modal-box bg-slate-900 text-white w-full p-3 rounded-md"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setmail(e.target.value)}
        />
        <button
          className="bg-slate-800 text-white px-5 py-2 rounded-md mt-5 hover:scale-105 transition"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default ForgetPassoword;
