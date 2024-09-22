import React, { useContext, useEffect, useReducer, useState } from "react";
import { LuLoader2 } from "react-icons/lu";
import { uploadReport } from "../../../hooks/report";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../Config/firebase-config";
import { AuthContext } from "../../../context/AuthContext";
import EachProblemForm from "./EachProblemForm";

// CONST lists
const ExamCategory = ["Engineering", "Versity"];

function reducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM":
      const updatedArray = [...state];
      if (
        updatedArray.findIndex(
          (e) => e?.questionNo === action.newData?.questionNo
        ) > -1
      ) {
        alert("You have already selected the question no in problem list.");
      } else {
        updatedArray.push(action.newData);
      }
      return updatedArray;
    default:
      return state;
  }
}

//main component
function ReportService() {
  const [user, isAuthenticated] = useContext(AuthContext);
  const [load, setLoad] = useState(false);
  const [courseCategory, setCC] = useState("");
  const [totalMark, setTotalMark] = useState(0);
  const [maxListNumber, setMaxListNumber] = useState([]);
  const [selectedQuestion, setSelectQuestion] = useState([]);
  const [problemList, dispatcher] = useReducer(reducer, []);
  const [confirm, setConfirm] = useState(false);

  const [studentInfo, setSudentInfo] = useState({
    fullname: "",
    examId: "",
    roll: "",
    branch: "",
  });
  const [allow, setAllow] = useState(false);

  useEffect(() => {
    const arr = [];
    switch (courseCategory) {
      case ExamCategory[0]:
        for (let i = 1; i <= 40; i++) arr.push(i);
        setMaxListNumber(arr);
        break;
      case ExamCategory[1]:
        for (let i = 1; i <= 16; i++) arr.push(i);
        setMaxListNumber(arr);
        break;
      default:
        setMaxListNumber([]);
        break;
    }
  }, [courseCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isAuthenticated !== 1 || !user) {
      setLoad(false);
      switch (isAuthenticated) {
        case -1:
          alert("To use this service, please login.");
          return;
        case 0:
          alert("May be your email is not verified. Go to profile and verify.");
          return;

        default:
          alert("To use this service, please login.");
          return;
      }
    }

    try {
      setLoad(true);
      const promiseList = await Promise.all(
        problemList.map(async (ele) => {
          const imagesList = await uploadImages(ele?.images);
          return {
            images: imagesList,
            questionNo: ele?.questionNo,
            reportMsg: ele?.reportMsg,
            requestCount: 1,
          };
        })
      );

      // console.log(imagesList);

      uploadReport({
        userId: user?.uid,
        studentInfo: studentInfo,
        category: courseCategory,
        obtainMark: totalMark || 0,
        problemList: promiseList,
        createdAt: Date.now(),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 201) {
            alert("Report successfully Sent");
            window.location.reload();
          } else alert("Failed to report");
        })
        .catch((err) => {
          console.log("error found", err);

          alert("Failed to report");
        })
        .finally(() => {
          setLoad(false);
        });
    } catch (error) {
      alert("Error occured");
      console.log("submittion failed", error);
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="text-slate-200 rounded-md max-h-full">
      <h2 className="text-center text-2xl underline py-10">
        Question and Report
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-3 relative">
        <div>
          {/* student info */}
          {allow && (
            <div className="m-5 p-5 rounded-xl shadow-md shadow-gray-400/20 border border-gray-200 ">
              <h3 className="text-2xl font-medium mb-3">
                {studentInfo.fullname}
              </h3>
              <p className="text-sm">Roll Number: {studentInfo.roll}</p>
              <p className="text-sm">Exam ID: {studentInfo.examId}</p>
              <p className="text-sm">Branch: {studentInfo.branch}</p>
            </div>
          )}

          {user != null || isAuthenticated !== -1 ? (
            !allow ? (
              <StudentInfoForm
                studentInfo={studentInfo}
                setSudentInfo={setSudentInfo}
                setAllow={setAllow}
              />
            ) : (
              <div className="p-5 flex flex-col max-w-screen-xl">
                <section className="space-y-6 grid gap-5 w-full">
                  <div className="space-y-6 flex flex-col w-full">
                    <section className="grid">
                      <label className="font-semibold" htmlFor="courseCategory">
                        Exam Category
                      </label>
                      <select
                        className={`text-black bg-swhite border border-gray-200 rounded-full shadow-lg shadow-gray-400/30 outline-none px-3 py-2 text-sm ${
                          courseCategory == "" && "opacity-50"
                        }`}
                        required
                        name="courseCategory"
                        id="courseCategory"
                        value={courseCategory}
                        onChange={(e) => setCC(e.target.value)}
                      >
                        <option value="" disabled>
                          Choose a branch
                        </option>
                        {ExamCategory.map((ele) => (
                          <option key={ele} value={ele}>
                            {ele}
                          </option>
                        ))}
                      </select>
                    </section>
                    <section
                      className="grid aria-disabled:pointer-events-none"
                      aria-disabled={courseCategory == ""}
                    >
                      <label className="font-semibold" htmlFor="fullname">
                        Your Obtained Mark{" "}
                        {courseCategory == "" && (
                          <span className="text-xs text-red-500">
                            *Select Exam Category
                          </span>
                        )}
                      </label>
                      <input
                        className="text-black bg-swhite border border-gray-200 rounded-full drop-shadow-lg outline-none px-3 py-2 text-sm"
                        required
                        type="number"
                        min={0}
                        max={courseCategory === ExamCategory[0] ? 400 : 200}
                        step={0.25}
                        name="totalMark"
                        placeholder="Your Obtained Mark"
                        id="totalMark"
                        value={totalMark}
                        onChange={(e) => setTotalMark(e.target.value)}
                      />
                      {(courseCategory === ExamCategory[0] ? 400 : 40) <
                        totalMark && (
                        <p className="text-red-500 text-xs font-semibold pt-2 px-4">
                          *Your mark must be smaller than or equal to{" "}
                          {courseCategory === ExamCategory[0] ? 400 : 40}
                        </p>
                      )}
                    </section>
                  </div>
                </section>
                {/* question number picker */}
                <div
                  className="aria-hidden:hidden"
                  aria-hidden={maxListNumber.length === 0 || confirm}
                >
                  <h3 className="text-center font-medium my-3 underline underline-offset-2">
                    Select Question number you want to review
                  </h3>
                  <div className="break-words flex flex-wrap gap-1">
                    {selectedQuestion.map((sq) => (
                      <span
                        className="bg-gray-300 text-gray-700 font-semibold p-2 w-8 h-8 text-center rounded-md mx-2 text-xs"
                        hidden={selectedQuestion === 0}
                        key={`qn_${sq}`}
                        onClick={() =>
                          setSelectQuestion((p) =>
                            p.filter((pre) => pre !== sq)
                          )
                        }
                      >
                        {sq}
                      </span>
                    ))}
                  </div>
                  <hr className="my-5" />
                  <div
                    className={`text-center grid border border-slate-700 ${
                      courseCategory == ExamCategory[1]
                        ? "grid-cols-2 md:grid-cols-4"
                        : "grid-cols-4 md:grid-cols-8"
                    }`}
                    hidden={maxListNumber.length == 0}
                  >
                    {maxListNumber.map((ele) => (
                      <button
                        key={`qn_${ele}`}
                        className="px-2 m-2 rounded-sm hover:text-white hover:bg-blue-500 cursor-default select-none"
                        type="button"
                        onClick={() => {
                          if (
                            selectedQuestion.length == 0 ||
                            selectedQuestion.findIndex((p) => p === ele) === -1
                          )
                            setSelectQuestion((pre) =>
                              [...pre, ele].sort((a, b) => (a > b ? 1 : -1))
                            );
                        }}
                      >
                        {ele}
                      </button>
                    ))}
                  </div>
                  <button
                    className="w-full py-3 rounded-md bg-blue-500 mt-3 hover:bg-blue-600 transition-colors"
                    type="button"
                    onClick={() => {
                      if (selectedQuestion.length > 0) setConfirm(true);
                    }}
                  >
                    Confirm your problem list
                  </button>
                </div>
              </div>
            )
          ) : (
            <p className="text-center text-gray-500">
              User must login to see the data
            </p>
          )}
        </div>
        <div className="p-3 flex-1a aria-hidden:hidden" aria-hidden={!confirm}>
          <p className="text-center font-bold text-2xl mb-10">
            Your selected problem list
          </p>
          <div>
            {/* from this single form box, student can add multiple problems at a time */}
            {confirm &&
              selectedQuestion.map((question, index) => (
                <EachProblemForm
                  key={`eachProblem_${index}`}
                  addProblemList={dispatcher}
                  questionNo={question}
                />
              ))}
          </div>
          <form className="grid w-full" onSubmit={handleSubmit}>
            <button
              className="btn btn-primary text-white disabled:text-white bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 my-5"
              type="submit"
              disabled={
                totalMark === 0 ||
                load ||
                selectedQuestion.length !== problemList.length
              }
            >
              {load ? (
                <LuLoader2 className="animate-spin" color="white" />
              ) : (
                "Submit Report"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const uploadImages = async (files) => {
  try {
    const uploadPromises = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storageRef = ref(storage, `images/${file.name}`);
      uploadPromises.push(uploadBytes(storageRef, file));
    }

    const downloadURLs = await Promise.all(
      uploadPromises.map(async (promise) => {
        const snapshot = await promise;
        return getDownloadURL(snapshot.ref);
      })
    );
    return downloadURLs;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw new Error("Failed to upload all images. Try again");
  }
};

const StudentInfoForm = ({ studentInfo, setSudentInfo, setAllow }) => {
  function handleInfo(e) {
    setSudentInfo((pre) => ({
      ...studentInfo,
      [e.target.name]: e.target.value,
    }));
  }
  const [load, setLoad] = useState(false);

  return (
    <div className="m-5 rounded-md p-5">
      <form
        className="grid gap-10"
        onSubmit={(e) => {
          e.preventDefault();
          setLoad(true);
          let loop = setTimeout(() => {
            setLoad(false);
            setAllow(true);
            clearTimeout(loop);
          }, 200);
        }}
      >
        <div className="grid grid-cols-1 gap-5">
          <section className="grid">
            <label className="font-semibold " htmlFor="fullname">
              Full Name
            </label>
            <input
              className="text-black bg-swhite border border-gray-200 rounded-full drop-shadow-lg outline-none px-3 py-2 text-sm"
              required
              type="text"
              name="fullname"
              placeholder="Your Full Name"
              id="fullname"
              value={studentInfo.fullname}
              onChange={handleInfo}
            />
          </section>
          <section className="grid">
            <label className="font-semibold " htmlFor="examId">
              Exam ID
            </label>
            <input
              className="text-black bg-swhite border border-gray-200 rounded-full drop-shadow-lg outline-none px-3 py-2 text-sm"
              required
              type="text"
              name="examId"
              placeholder="ACS Exam ID"
              id="examId"
              value={studentInfo.examId}
              onChange={handleInfo}
            />
          </section>
          <section className="grid">
            <label className="font-semibold " htmlFor="roll">
              ACS Roll
            </label>
            <input
              className="text-black bg-swhite border border-gray-200 rounded-full drop-shadow-lg outline-none px-3 py-2 text-sm"
              required
              type="text"
              name="roll"
              placeholder="ACS Roll Number"
              id="roll"
              value={studentInfo.roll}
              onChange={handleInfo}
            />
          </section>
          <section className="grid">
            <label className="font-semibold " htmlFor="branch">
              Branch
            </label>
            <select
              className={`text-black bg-swhite border border-gray-200 rounded-full shadow-lg shadow-gray-400/30 outline-none px-3 py-2 text-sm ${
                studentInfo.branch == "" && "opacity-50"
              }`}
              required
              name="branch"
              id="branch"
              value={studentInfo.branch}
              onChange={handleInfo}
            >
              <option value="" disabled>
                Choose a branch
              </option>
              <option value="motijhil">Motijhil</option>
              <option value="sylhet">Sylhet</option>
              <option value="khulna">Khulna</option>
            </select>
          </section>
        </div>
        <button
          className="w-full rounded-md py-3 transition-colors ease-linear bg-blue-500 text-white   hover:bg-blue-600/80 disabled:text-gray-400"
          type="submit"
          disabled={load}
        >
          {load ? "loading..." : "Check"}
        </button>
      </form>
    </div>
  );
};

export default ReportService;
