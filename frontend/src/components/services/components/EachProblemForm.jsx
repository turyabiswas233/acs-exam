import React, { useState, memo } from "react";
import { handleImageUpload } from "../../../hooks/report";
import { MdDelete } from "react-icons/md";
import { LuLoader2 } from "react-icons/lu";

// EachProblemForm
const EachProblemForm = ({ addProblemList, questionNo }) => {
  const [load, setLoad] = useState(false);
  const [files, setFiles] = useState([]);
  const [reportMsg, setReport] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleImageChange = async (e) => {
    try {
      setLoad(true);
      const uploadPromises = [];
      const files = e.target.files;
      if (files.length == 0) {
        setLoad(false);
        return;
      }

      setFiles([]);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (i > 3) {
          alert("Maximum image limit 3\nSo, first 3 images are selected.");
          break;
        } else uploadPromises.push(file);
      }

      const data = await Promise.all(
        uploadPromises.map(async (promise, i) => {
          const newFile = await handleImageUpload(promise);
          if (newFile) {
            return newFile;
          } else throw new Error("An error occurred while uploading image.");
        })
      );

      if (data.length > 0) {
        setFiles(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
      console.log(files, questionNo);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full box-border border border-slate-200 p-5 rounded-md mb-5">
      <p className="font-bold">Problem no. {questionNo}</p>

      {/* report msg box */}
      <textarea
        className="resize-none text-sm w-full outline-none border border-slate-400 p-2 bg-white/10 text-swhite rounded-md"
        name="reportMsg"
        id="reportMsg"
        rows="5"
        value={reportMsg}
        placeholder="Write your problem for this question"
        onChange={(e) => setReport(e.target.value)}
      />

      {files.length > 0 ? (
        <div className="my-2 rounded-md flex flex-wrap gap-3 w-fit">
          {files.map((f, fi) => {
            return (
              <div
                className="relative w-fit rounded-lg "
                key={`files_r_${questionNo}-${fi}`}
              >
                <img
                  className="object-cover rounded-md aspect-square shadow-md mx-auto"
                  src={URL.createObjectURL(f)}
                  width={75}
                  height={75}
                  draggable={false}
                />
                {!confirmed && (
                  <button
                    className="p-1 bg-white rounded-sm absolute top-2 right-2"
                    type="button"
                    onClick={(e) => {
                      setFiles((pre) => pre.filter((old, oid) => oid !== fi));
                    }}
                  >
                    <MdDelete color="red" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* image upload UI */}
      <section className="w-full grid">
        <label
          className="bg-blue-500 text-swhite hover:bg-blue-600/80 cursor-pointer rounded-md py-3 px-2 text-center text-sm aria-disabled:opacity-40 aria-disabled:pointer-events-none aria-hidden:hidden transition-colors"
          htmlFor={`fileUP_${questionNo}`}
          key={`filePicker_${questionNo}`}
          aria-hidden={confirmed}
          aria-disabled={load}
        >
          {load ? "wait..." : "Add image +"}
        </label>

        <input
          hidden
          type="file"
          name={`fileUP_${questionNo}`}
          id={`fileUP_${questionNo}`}
          multiple={true}
          accept={"image/*"}
          onChange={handleImageChange}
        />
      </section>

      <button
        className="btn btn-primary text-white disabled:text-white bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 aria-hidden:hidden"
        type="submit"
        aria-hidden={confirmed}
        disabled={files.length === 0 || load}
        onClick={() => {
          addProblemList({
            type: "ADD_ITEM",
            newData: {
              images: files,
              questionNo: questionNo,
              reportMsg: reportMsg,
            },
          });
          setConfirmed(true);
        }}
      >
        {load ? (
          <LuLoader2 className="animate-spin" color="white" />
        ) : (
          "confirm"
        )}
      </button>
    </div>
  );
};
export default memo(EachProblemForm);
