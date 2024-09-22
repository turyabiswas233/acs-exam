import React from "react";
import Navbar from "./components/Navbar";

function Error() {
  return (
    <>
      <Navbar />
      <div className="p-10 text-center">
        <p>The page you are looking for might not found or not have access.</p>
        <p>
          Go to{" "}
          <a className="text-blue-500 text-lg" href="/">
            Home
          </a>{" "}
          page
        </p>
      </div>
    </>
  );
}

export default Error;
