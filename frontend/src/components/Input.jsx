import React from "react";
import { FaCheck } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

function Input({
  title,
  name,
  id,
  confirm,
  value,
  setValue,
  required = Boolean(false),
  type,
  placeholder,
  help = Boolean(false),
  minlen = Number(0),
  helpTitle,
  resize = Boolean(false),
}) {
  return (
    <div className="grid grid-cols-1 w-full my-2 relative">
      <label htmlFor={id} className="font-bold capitalize flex">
        {title}
        {required && <sup className="text-red-500 text-xs">*</sup>}
        {help && (
          <sup title={helpTitle || "Help me"}>
            <span className="w-5 h-5 grid place-items-center scale-75 bg-slate-800 text-white ring-1 ring-white rounded-full">
              ?
            </span>
          </sup>
        )}
      </label>
      {id === "cpass" && confirm && value?.length > 0 && (
        <span className="absolute text-green-500 right-2 top-9">
          <FaCheck />
        </span>
      )}
      {id === "cpass" && !confirm && value?.length > 0 && (
        <span className="absolute text-rose-500 right-2 top-9">
          <FaX />
        </span>
      )}
      {resize ? (
        <textarea
          className="w-full p-2 bg-white border border-blue-500/70 text-black rounded-md outline-none focus-within:outline-none resize-y"
          name={name}
          type={type || "text"}
          required={required}
          value={value}
          onChange={setValue}
          rows={3}
          autoComplete={(name == "ssKey" && "off").toString()}
          placeholder={placeholder || "Text a message..."}
        />
      ) : (
        <input
          className="w-full p-2 bg-white border border-blue-500/70 text-black rounded-md outline-none focus-within:outline-none"
          name={name}
          type={type || "text"}
          required={required}
          value={value}
          minLength={minlen}
          onChange={setValue}
          autoComplete={(name == "ssKey" && "off").toString()}
          placeholder={placeholder || "Text a message..."}
        />
      )}
    </div>
  );
}

export default Input;
