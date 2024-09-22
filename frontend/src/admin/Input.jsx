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
  helpTitle,
  resize = Boolean(false),
}) {
  if (type === "select") {
    return (
      <div className="grid grid-cols-1 w-full my-2 relative">
        <label htmlFor={id} className="font-bold capitalize flex">
          {title}
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

        <select
          id={id}
          className="w-full p-2 bg-white border border-blue-500/70 text-black rounded-md outline-none focus-within:outline-none"
          name={name}
          type={type || "text"}
          required={required}
          value={value}
          onChange={setValue}
        >
          <option value="" disabled>
            Choose a role
          </option>
          <option value="sudo-admin">Admin</option>
          <option value="teacher">Teacher</option>
        </select>
        {value && (
          <p className="text-xs text-green-600 font-semibold finput p-2">
            *Even if you choose a role, you have to wait for the ROOT user(s) to
            give you access.
          </p>
        )}
      </div>
    );
  } else
    return (
      <div className="grid grid-cols-1 w-full my-2 relative">
        <label htmlFor={id} className="font-bold capitalize flex">
          {title}
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
            id={id}
            className="w-full p-2 bg-gray-50 border border-blue-500/70 text-black rounded-md outline-none focus-within:outline-none resize-y"
            name={name}
            type={type || "text"}
            required={required}
            value={value}
            onChange={setValue}
            rows={5}
            autoComplete={(name == "ssKey" && "off").toString()}
            placeholder={placeholder || "Text a message..."}
          />
        ) : (
          <input
            id={id}
            className="w-full p-2 bg-gray-200 border border-blue-500/70 text-black rounded-md outline-none focus-within:outline-none"
            name={name}
            type={type || "text"}
            required={required}
            value={value}
            min={id === "hour" || id === "minute" ? 0 : null}
            max={id === "hour" ? 23 : id === "minute" ? 59 : null}
            onChange={setValue}
            autoComplete={(name == "ssKey" && "off").toString()}
            placeholder={placeholder || "Text a message..."}
          />
        )}
        {type == "tel" && value.length > 0 && !value?.includes("+88") && (
          <p className="text-xs p-2 bg-red-400/20 text-red-600 my-1 rounded-md">
            *Please add{" "}
            <code className="text-gray-100 rounded-full bg-sblack px-1 text-xs">
              +88
            </code>{" "}
            as prefix of phone number
          </p>
        )}
      </div>
    );
}

export default Input;
