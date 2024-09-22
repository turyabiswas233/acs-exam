import React from "react";
import Navbar from "./Navbar";

function ErrorAdmin() {
  return (
    <div className="p-0 bg-white h-screen overflow-hidden">
      <Navbar />
      <div className="bg-white w-3/4 h-auto py-48 text-rose-600 text-3xl mx-auto my-20 text-center rounded-lg shadow-xl shadow-slate-400">
        The page you are looking for may under construction.
      </div>
    </div>
  );
}

export default ErrorAdmin;
