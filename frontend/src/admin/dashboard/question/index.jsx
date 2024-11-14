import React, { useState, useRef, useEffect, useReducer } from "react";
import { Link, useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import Input from "../../Input";
import axios from "axios";
import MathEditor from "./MathEditor";

const API_URL = import.meta.env.APP_URL;

const ExamInfo = () => {
  const [examInfo, setExamInfo] = useState(null);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [starttime, setStartTime] = useState(new Date());
  const [duration, setDuration] = useState({ hh: 0, mm: 0 });
  const { examid } = useParams();
  const [newstime, setnewstime] = useState("");
  const [newetime, setnewetime] = useState("");
  const [questype, setQuesType] = useState("");
  const handleToggle = () => setToggleEdit((p) => !p);
  function fetchInfo() {
    axios
      .get(API_URL + "sadmin/exam/getsingleexam", {
        params: {
          _id: examid,
        },
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.status) {
          setExamInfo(res.data.info);
          setStartTime(new Date(res.data.info?.starttime));
          setDuration(res.data.info.duration);
          setnewstime(res.data.info.starttime);
          setQuesType(res.data.info.questype);
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
        if (err.response.data.message === "No Exam found")
          window.location.assign("/swift-admin/a_dashboard/exam/create");
      });
  }
  useEffect(() => {
    fetchInfo();
  }, [examid]);

  return (
    <div className="my-10">
      <div className="grid grid-cols-2">
        <div className="p-4 pb-10 mr-5 h-fit rounded-md ring-2 ring-slate-900 hover:bg-slate-700 hover:text-slate-100 transition-colors duration-100 hover:ring-yellow-300 hover:shadow-lg ease-out font-thin">
          <p className="font-bold text-xl mb-5">{examInfo?.examname}</p>
          <p>
            Start on: {starttime?.toLocaleDateString()},{" "}
            {starttime?.toLocaleTimeString()}
          </p>
          <p>
            Duration: {examInfo?.duration?.hh}H: {examInfo?.duration?.mm}M
          </p>
          <p>Type: {examInfo?.questype?.toUpperCase()}</p>
        </div>

        <div
          className={`fixed left-0 top-0 bg-black/40 backdrop-blur-md w-screen h-screen z-50 overflow-hidden grid place-content-center ${
            toggleEdit ? "opacity-100" : "opacity-0 pointer-events-none"
          } transition-all`}
        >
          <form
            className={`flex-1 p-5 bg-slate-900/80 shadow-md shadow-blue-500/50 text-white rounded-md group ${
              toggleEdit
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            } transition-all duration-700`}
            onSubmit={(e) => {
              e.preventDefault();
              axios
                .patch(API_URL + "sadmin/exam/updateTopic", {
                  starttime: newstime,
                  duration: duration,
                  questype: questype,
                  _id: examid,
                })
                .then((res) => {
                  if (res.data.status) {
                    alert(res.data.message);
                    setExamInfo(res.data.data);
                    // console.log(res.data.data);
                    setStartTime(new Date(res.data.data?.starttime));
                  }
                })
                .catch((err) => {
                  alert(err?.response?.data?.message);
                  console.log(err);
                })
                .finally(() => {
                  handleToggle();
                });
            }}
          >
            <h4 className="text-swhite font-bold">Update Info</h4>
            <section className="flex gap-2 rounded-md my-2 flex-col">
              <label
                htmlFor="startTime"
                className="text-xs rounded-lg text-slate-500"
              >
                Exam Start Time
              </label>
              <input
                className="bg-slate-200 rounded-md p-2 text-black outline-none border-none flex-1"
                type="datetime-local"
                name="startTime"
                id="startTime"
                value={newstime}
                onChange={(e) => setnewstime(e.target.value)}
              />
            </section>
            <section className="my-2">
              <div className="flex gap-2">
                <Input
                  title={"Hour"}
                  id={"hour"}
                  name={"hour"}
                  type={"number"}
                  placeholder={"00"}
                  value={duration.hh}
                  setValue={(e) =>
                    setDuration((p) => ({ ...p, hh: e.target.value }))
                  }
                />
                <Input
                  title={"Minute"}
                  id={"minute"}
                  name={"minute"}
                  type={"number"}
                  placeholder={"00"}
                  value={duration.mm}
                  setValue={(e) =>
                    setDuration((p) => ({ ...p, mm: e.target.value }))
                  }
                />
              </div>
            </section>
            <section className="flex flex-col gap-2">
              <label
                htmlFor="questype"
                className="text-xs rounded-lg text-slate-500"
              >
                Question Type
              </label>
              <select
                className="select bg-slate-300 text-black"
                value={questype}
                onChange={(e) => {
                  setQuesType(e.target.value);
                }}
              >
                <optgroup>
                  <option value="" disabled>
                    Choose a type
                  </option>
                  <option value="mcq">MCQ</option>
                  <option value="cq">CQ</option>
                </optgroup>
              </select>
            </section>
            <div className="grid grid-cols-2 gap-3">
              <button
                className="py-3 rounded-md transition-colors bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-50 text-white w-full mt-5"
                type="submit"
              >
                Save
              </button>
              <button
                className="py-3 rounded-md transition-colors bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-50 text-white w-full mt-5"
                type="button"
                onClick={handleToggle}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        <div className="grid">
          <button
            className="btn bg-gray-600 text-white"
            type="button"
            onClick={handleToggle}
          >
            Edit
          </button>
          <Link
            className="btn bg-blue-600 hover:bg-blue-500 text-white"
            to={`/swift-admin/a_dashboard/exam/view/${examid}`}
          >
            View Questions
          </Link>
        </div>
      </div>
      <hr />
    </div>
  );
};

function AdminQuestion() {
  const [questionInfo, setQuestion] = useState({
    qt: "",
    questype: "mcq",
    options: [
      {
        id: 0,
        text: "",
        isCorrect: false,
      },
      {
        id: 1,
        text: "",
        isCorrect: false,
      },
      {
        id: 2,
        text: "",
        isCorrect: false,
      },
      {
        id: 3,
        text: "",
        isCorrect: false,
      },
    ],
    solve: "",
  });
  const { examid } = useParams();

  function handleInfo(e, key) {
    setQuestion((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  }
  function handleOption(e, key) {
    const newOpt = [...questionInfo.options];
    newOpt[key] = {
      id: key + 1,
      text: e,
      isCorrect: questionInfo.options[key].isCorrect,
    };
    setQuestion((p) => ({ ...p, options: [...newOpt] }));
  }
  function handleCorrect(e, key) {
    const newOpt = [...questionInfo.options];
    newOpt[key] = {
      ...newOpt[key],
      isCorrect: e.target.checked,
    };
    setQuestion((p) => ({ ...p, options: [...newOpt] }));
  }

  const handlePushQuestion = (e) => {
    e.preventDefault();

    axios
      .post(
        `${API_URL}sadmin/exam/addquestion/${examid}`,
        {
          question: questionInfo.qt,
          options: questionInfo.options,
          questype: questionInfo.questype,
          solve: questionInfo.solve,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        alert(res.data.message);
        if (res.data.status) {
          window.location.reload();
        }
      })
      .catch((err) => alert(err.response.data.message));
  };

  return (
    <div className="poppins-regular overflow-x-hidden p-10 w-full">
      <ExamInfo />
      <h2 className="text-3xl text-center poppins-semibold">Create question</h2>

      <div className="main">
        <div className="rounded-lg my-5 shadow-md mx-auto max-w-screen-xl">
          <form className="card-body" onSubmit={handlePushQuestion}>
            {/* question type */}
            <div className="groupSubject flex flex-col p-4 space-y-3">
              <div className="chap space-y-1">
                <h3 className="stat-title text-black/50 font-bold ">
                  Question Type
                </h3>

                <select
                  className=" bg-slate-100 px-3 py-1 rounded-md w-full text-lg"
                  onChange={handleInfo}
                  name="questype"
                  value={questionInfo.questype}
                >
                  <option value="" disabled>
                    Choose Question type
                  </option>

                  <option className="uppercase" value={"mcq"}>
                    MCQ
                  </option>
                  <option className="uppercase" value={"cq"}>
                    CQ
                  </option>
                </select>
              </div>
            </div>
            {/* entire question form */}
            <div
              className="aria-hidden:hidden"
              aria-hidden={questionInfo.questype === ""}
            >
              {/* question field */}
              <section>
                <h2 className="text-left card-title poppins-medium text-3xl">
                  Question
                </h2>
                <MathEditor
                  value={questionInfo.qt}
                  handleChange={(e) => setQuestion((p) => ({ ...p, qt: e }))}
                />
              </section>
              {/* options list */}
              <div
                className="my-5 mx-auto aria-hidden:hidden"
                aria-hidden={questionInfo.questype !== "mcq"}
              >
                <h3 className="stat-title text-black/50 font-bold ">Options</h3>
                <div className="option grid gap-3  grid-cols-1 xl:grid-cols-2">
                  <section>
                    <p className="text-center font-medium">Option 1</p>
                    <div className="flex gap-3 items-center">
                      <MathEditor
                        value={questionInfo.options[0].text}
                        handleChange={(e) => {
                          handleOption(e, 0);
                        }}
                      />
                      <input
                        className="scale-150 bg-white ring-1 ring-green-300 accent-green-400"
                        title="select as correct"
                        type="checkbox"
                        onChange={(e) => handleCorrect(e, 0)}
                      />
                    </div>
                  </section>
                  <section>
                    <p className="text-center font-medium">Option 2</p>
                    <div className="flex gap-3 items-center">
                      <MathEditor
                        value={questionInfo.options[1].text}
                        handleChange={(e) => {
                          handleOption(e, 1);
                        }}
                      />
                      <input
                        className="scale-150 bg-white ring-1 ring-green-300 accent-green-400"
                        title="select as correct"
                        type="checkbox"
                        onChange={(e) => handleCorrect(e, 1)}
                      />
                    </div>
                  </section>
                  <section>
                    <p className="text-center font-medium">Option 3</p>
                    <div className="flex gap-3 items-center">
                      <MathEditor
                        value={questionInfo.options[2].text}
                        handleChange={(e) => {
                          handleOption(e, 2);
                        }}
                      />
                      <input
                        className="scale-150 bg-white ring-1 ring-green-300 accent-green-400"
                        title="select as correct"
                        type="checkbox"
                        onChange={(e) => handleCorrect(e, 2)}
                      />
                    </div>
                  </section>
                  <section>
                    <p className="text-center font-medium">Option 4</p>
                    <div className="flex gap-3 items-center">
                      <MathEditor
                        value={questionInfo.options[3].text}
                        handleChange={(e) => {
                          handleOption(e, 3);
                        }}
                      />
                      <input
                        className="scale-150 bg-white ring-1 ring-green-300 accent-green-400"
                        title="select as correct"
                        checked={questionInfo.options[3].isCorrect}
                        type="checkbox"
                        onChange={(e) => handleCorrect(e, 3)}
                      />
                    </div>
                  </section>
                </div>
              </div>

              {/* question field */}
              <section>
                <h2 className="text-left card-title poppins-medium text-3xl">
                  Solution
                </h2>
                <MathEditor
                  value={questionInfo.solve}
                  handleChange={(e) => setQuestion((p) => ({ ...p, solve: e }))}
                />
              </section>
              <button
                className="btn btn-primary w-full text-lg text-green-900 bg-green-500/70 hover:bg-green-600/70 border-0"
                type="submit"
              >
                Add Question
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default AdminQuestion;

const QuestionList = ({ questions }) => {
  return (
    <div className="grid gap-2">
      <h2 className="text-center text-4xl my-10 underline">Questions List</h2>
      {questions?.length > 0
        ? questions?.map((ele, id) => (
            <div className="ring rounded-md ring-slate-900 p-10" key={id}>
              <div className="flex items-center justify-between">
                <h2 className="p-3 text-lg font-semibold">
                  {id + 1}. {ele?.question}
                </h2>
                <button
                  type="button"
                  className="text-red-500 bg-black rounded-md p-2 hover:bg-red-400 hover:text-white transition-colors"
                  onClick={() => {
                    let check = confirm(
                      "Do you want to delete the question?"
                    ).valueOf();
                    if (check) {
                      axios
                        .delete(API_URL + "sadmin/exam/delquestion/" + ele?._id)
                        .then((res) => {
                          console.log(res.data);
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }
                  }}
                >
                  {" "}
                  <MdDelete />
                </button>
              </div>
              <ul>
                {ele?.options?.map((opt, od) => {
                  if (opt?.ans)
                    return (
                      <li
                        className="font-normal bg-slate-200 my-2 p-2 rounded-md border border-slate-400"
                        key={`opt_${od}`}
                      >
                        {od + 1}. {opt?.ans}
                      </li>
                    );
                })}
              </ul>
              {ele?.answer && <p>Answer: {ele?.answer?.value}</p>}
            </div>
          ))
        : "No Question Found"}
    </div>
  );
};
const fetchQuestions = () => {
  axios
    .get(API_URL + "sadmin/exam/getquestions", {
      params: {
        qid: examid,
      },
      withCredentials: true,
    })
    .then((res) => {
      if (res.status == 200) {
        console.log(res.data.list);
      }
    });
};
