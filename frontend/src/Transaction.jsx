import React, { useState } from "react";
import { LuLoader } from "react-icons/lu";

function Transaction() {
  const [groupId, setId] = useState("");
  const [load, setLoad] = useState(false);
  const [error, seterr] = useState("");

  return (
    <div className="py-20 break-word max-w-3xl mx-auto">
      <h2 className="text-center font-bold text-4xl text-gray-50">
        Login with ACS credential
      </h2>
      <form
        className="grid gap-4 p-2 border border-gray-200 rounded-md my-10 w-full"
        onSubmit={async (e) => {
          e.preventDefault();
          // setLoad(true);
          seterr("");
        }}
      >
        <p className="text-red-400 p-2">
          *Please provide your email or phone. If you provide phone, then
          provide{" "}
          <span className="bg-blue-100/20 text-green-500 px-2 rounded-sm">
            +88
          </span>{" "}
          before phone number.
        </p>
        <section className="w-full bg-white relative rounded-md">
          <input
            className="input-md bg-white text-black rounded-md text-sm w-full"
            type="text"
            value={groupId}
            required
            placeholder="Email or phone number"
            onChange={(e) => setId(e.target.value)}
          />
          <span className="absolute top-0 right-0 bg-transparent h-full flex items-center mr-3">
            {groupId.includes("+880")
              ? "PHONE"
              : groupId.includes("@")
              ? "EMAIL"
              : ""}
          </span>
        </section>
        {error && <p className="alert-error alert">{error}</p>}
        <button
          className="btn w-full border border-blue-500 bg-blue-500 hover:bg-blue-400 text-white"
          type="submit"
        >
          check {load && <LuLoader className="animate-spin step-primary" />}
        </button>
      </form>
      {/* image uploader test */}
    </div>
  );
}

export default Transaction;

/**
 * @type {URL} https://shop.aparsclassroom.com/query/transaction
 * @type {email} altouhidbillah@gmail.com
 * @type {phone} +8801982339141
 */

/*

roll,name, examID+totalmark, branch

*/
