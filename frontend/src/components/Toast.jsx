import React, { useEffect, useState } from "react";
import { MdClose, MdDone } from "react-icons/md";

const Toast = ({ success, message }) => {
  const [hideMe, setHide] = useState(true);

  useEffect(() => {
    setHide(false);
    let timer = setTimeout(() => {
      setHide(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [success]);
  if (!hideMe)
    return (
      <div
        className={`bg-green-100 ring-1 ring-green-500 text-slate-900 text-lg font-bold px-4 py-2 rounded-md flex text-center items-center justify-center w-full relative top-0 mr-auto mb-4 left-0 gap-4 transition first-letter:uppercase ${
          hideMe ? "opacity-0 -translate-y-5" : "opacity-100 translate-y-0"
        }`}
      >
        <span
          className={`w-5 h-5 flex justify-center items-center text-white rounded-full ${
            success ? "bg-green-600" : "bg-rose-600"
          }`}
        >
          {success ? <MdDone /> : <MdClose />}
        </span>{" "}
        {message}
      </div>
    );
};

export default Toast;
