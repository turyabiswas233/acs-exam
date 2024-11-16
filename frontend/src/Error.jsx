import React from "react";
import Navbar from "./components/Navbar";

function Error() {
  return (
    <div className="text-white h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-full bg-black">
        <h1 className="text-6xl font-bold mb-4 text-rose-500">404</h1>
        <p className="text-2xl mb-8">Page Not Found</p>
        <a href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Go to Home
        </a>
      </div>
    </div>
  );
}

export default Error;
