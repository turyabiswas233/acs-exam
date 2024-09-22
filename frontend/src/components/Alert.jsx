import React from "react";
import { IoAlertCircle } from "react-icons/io5";

function Alert({ message = "alert" }) {
  return (
    <div className="alert alert-warning min-w-fit w-48 absolute z-20 top-5 right-3 animate-pulse text-black px-4 py-2 flex justify-start items-center gap-2 rounded-md first-letter:uppercase">
      <IoAlertCircle color="#ff3355" enableBackground={"true"} size={"1.5em"} />

      {message}
    </div>
  );
}

export default Alert;
