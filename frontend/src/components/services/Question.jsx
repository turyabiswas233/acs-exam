import QuestionCard from "./components/QuestionCard";

import { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import Timer from "./components/Timer";
import ScoreBoard from "./components/ScoreBoard";
import { useAuth } from "../../context/AuthContext";
const subList = [
  "BANGLA 1ST PAPER",
  "BANGLA 2ND PAPER",
  "PHYSICS 1ST PAPER",
  "PHYSICS 2ND PAPER",
  "CHEMISTRY 1ST PAPER",
  "CHEMISTRY 2ND PAPER",
  "HIGHER MATH 1ST PAPER",
  "HIGHER MATH 2ND PAPER",
  "BIOLOGY 1ST PAPER",
  "BIOLOGY 2ND PAPER",
  "ICT",
];
const chapters = [
  "Chapter 1",
  "Chapter 2",
  "Chapter 3",
  "Chapter 4",
  "Chapter 5",
  "Chapter 6",
  "Chapter 7",
  "Chapter 8",
  "Chapter 9",
  "Chapter 10",
  "Chapter 11",
  "Chapter 12",
  "Chapter 13",
  "Chapter 14",
];
const limits = [5, 10, 20, 25, 30, 60];
const types = ["বহুনির্বাচনি প্রশ্ন", "সৃজনশীল প্রশ্ন"];
export const levels = ["MCQ", "CQ"];

function Question() {
  const API_URL = import.meta.env.APP_URL;

  const { user, isAuthenticated } = useAuth();
  const [error, setError] = useState({ message: "" });
  const [selectedSub, setSelectSub] = useState("");
  const [selectChap, setSelectChap] = useState("");
  const [ansList, setAnsList] = useState([]);
  const [limit, setLimit] = useState(10);
  const [level, setLevel] = useState("");
  const [data, setdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [range, setrange] = useState(0);
  const [finish, setFinish] = useState(false);
  const [start, setStart] = useState(false);
  const [result, setResult] = useState({
    correct: 0,
    inCorrect: 0,
    total: 0,
  });

  function handleAnswer(ans, id, oid) {
    setAnsList((pre) => {
      const newAns = [...pre];
      if (data[id]?.Answer)
        newAns[id] = {
          ans: ans,
          oid: oid,
          isCorrect: ans?.trim() == data[id]?.Answer?.trim(),
        };
      else if (data[id]?.Answer_img)
        newAns[id] = {
          ans: ans,
          oid: oid,
          isCorrect: ans?.includes(data[id].Answer_img?.trim()),
        };
      else
        newAns[id] = {
          ans: ans,
          oid: oid,
          isCorrect: false,
        };

      return newAns;
    });
  }
  const rangeControl = (action) => {
    switch (action) {
      case "next":
        if (range < data?.length - 1) setrange((pre) => pre + 1);
        break;
      case "prev":
        if (range > 0) setrange((pre) => pre - 1);
        break;
      default:
        break;
    }
  };

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      axios
        .get(API_URL + "api/questions", {
          params: {
            subject: selectedSub,
            chapter: selectChap,
            limit: limit,
            level: level,
            category: category,
          },
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res);

          setdata(res.data?.data);

          if (res.data?.data?.length == 0)
            setError({ message: "No Question Found" });
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
          setStart(false);
          setFinish(false);
          console.log(err);
        });
    } catch (error) {
      alert("Failed");
      console.log(err);
      setLoading(false);
      setStart(false);
      setFinish(false);
      setError(error);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    const correct = ansList?.filter((ans) => ans?.isCorrect)?.length;
    const incorrect =
      ansList?.filter((ans) => !ans?.isCorrect)?.length -
      ansList?.filter((ans) => !ans)?.length;

    setResult({
      correct: correct,
      inCorrect: incorrect,
      total: data?.length,
    });
    alert("Exam Finished");
    setFinish(true);
  };

  useEffect(() => {
    if (finish) handleSubmit();
  }, [finish]);

  useEffect(() => {
    if (data?.length > 0) {
      setError("");
    }
    function blockReload(event) {
      if (data?.length > 0 && !finish) {
        event?.preventDefault();
      }
    }
    window.addEventListener("beforeunload", blockReload);
    return () => {
      window.removeEventListener("beforeunload", blockReload);
    };
  }, [data, finish]);

  if (user && isAuthenticated)
    return (
      <div
        className={`h-svh bg-swhite overflow-y-auto p-0 m-0 poppins-regular relative rounded-md bangla-font`}
      >
        <div className="questionsList py-10 px-2 space-y-6  mx-auto max-w-screen-xl">
          <h2 className="text-center text-5xl font-bold text-black">
            Practice Exam
          </h2>

          <div
            className="grid justify-start gap-3 grid-cols-2 flex-wrap aria-disabled:pointer-events-none lg:grid-cols-4 aria-hidden:hidden"
            aria-hidden={data?.length !== 0}
          >
            <select
              className="select"
              name="subject"
              id="subject"
              onChange={(e) => setSelectSub(e.target.value)}
              value={selectedSub}
            >
              <option value="">Select Subject</option>
              {subList.map((sub, sid) => (
                <option key={sid} value={sub}>
                  {sub}
                </option>
              ))}
            </select>

            <select
              className="select"
              name="chapter"
              id="chapter"
              onChange={(e) => setSelectChap(e.target.value)}
              value={selectChap}
            >
              <option value="">Select Chapter</option>
              {chapters.map((chap, cid) => (
                <option key={cid} value={chap}>
                  {chap}
                </option>
              ))}
            </select>
            <select
              className="select"
              name="type"
              id="type"
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="">Question Type</option>
              {types.map((chap, cid) => (
                <option key={cid} value={levels[cid]}>
                  {chap}
                </option>
              ))}
            </select>
            <select
              className="select"
              name="limit"
              id="limit"
              onChange={(e) => setLimit(e.target.value)}
              value={limit}
            >
              <option value="">Number of Questions</option>
              {limits.map((chap, cid) => (
                <option key={cid} value={chap}>
                  {chap}
                </option>
              ))}
            </select>
            <div className="p-3 flex gap-2">
              <section className="flex items-center gap-2 hover:bg-blue-500 hover:text-white p-2 w-fit rounded-md">
                <input
                  type="radio"
                  name="hsc"
                  id="hsc"
                  defaultChecked={false}
                  checked={category === "HSC"}
                  onChange={(e) => {
                    setCategory("HSC");
                  }}
                />
                <label htmlFor="hsc">HSC</label>
              </section>
              <section className="flex items-center gap-2 hover:bg-blue-500 hover:text-white p-2 rounded-md w-fit">
                <input
                  type="radio"
                  name="ssc"
                  id="ssc"
                  defaultChecked={false}
                  checked={category === "SSC"}
                  onChange={(e) => {
                    setCategory("SSC");
                  }}
                />
                <label htmlFor="ssc">SSC</label>
              </section>
            </div>
          </div>

          <div className={`examInfo flex items-start flex-wrap gap-3 `}>
            <h2 className="bg-swhite text-sblack px-2 py-px rounded-sm text-left">
              Subject: {selectedSub}
            </h2>
            <h2 className="bg-swhite text-sblack px-2 py-px rounded-sm text-left">
              Chapter: {selectChap}
            </h2>
            <h2 className="bg-swhite text-sblack px-2 py-px rounded-sm text-left">
              Total Question: {data?.length}
            </h2>
          </div>
          {selectedSub && selectChap && limit && level && !data?.length && (
            <button
              className="btn btn-accent"
              onClick={() => {
                setStart(true);
                fetchQuestion();
              }}
            >
              Start
            </button>
          )}
          {/* score board */}
          {finish && (
            <ScoreBoard
              correct={result.correct}
              inCorrect={result.inCorrect}
              skip={result.total - (result.correct + result.inCorrect)}
              total={data?.length}
            />
          )}
          {finish && (
            <button
              className="btn btn-neutral"
              onClick={() => {
                const confirm = prompt(
                  "Are you sure you want to take new exam? [yes/no]"
                );
                if (confirm?.toLocaleLowerCase() === "yes")
                  window.location.reload();
                else;
              }}
            >
              Take New Exam
            </button>
          )}
          {/* main question */}
          {start && !finish && data?.length > 0 && (
            <Timer
              start={start}
              limit={
                level === levels[0]
                  ? data?.length > 10
                    ? 60 * (data?.length - 5)
                    : 60 * 5
                  : 60 * 20 * (data?.length - 1)
              }
              setFinish={setFinish}
            />
          )}
          {loading ? (
            <div className="text-2xl text-center text-rose-600 font-bold bg-white shadow-md rounded-md">
              Loading...
            </div>
          ) : (
            data?.length > 0 &&
            !finish && (
              <div className="space-y-2">
                {level == levels[1] && (
                  <p className="alert alert-info">
                    এই পরীক্ষাটি শুধুমাত্র নিজেকে যাচাই করার জন্যে। তাই
                    উত্তরপত্র upload এর কোনো দরকার নেই।
                  </p>
                )}
                {data?.map((q, id) => {
                  if (id === range)
                    return (
                      <QuestionCard
                        key={id + "_ques"}
                        question={q.Question}
                        sId={id}
                        optionsList={q.Options?.split("----")}
                        qImg={q?.Question_img}
                        answer={q?.Answer}
                        board={q.Board}
                        handleAnswer={handleAnswer}
                        level={q?.Type}
                        stdAnswer={{
                          ans: ansList[id]?.ans,
                          oid: ansList[id]?.oid,
                        }}
                        solve={{ txt: q?.Solution, img: q?.Solution_Img }}
                        Answer_img={q?.Answer_img}
                        showSolve={finish}
                      />
                    );
                })}
                {data?.length === 0 && (
                  <div className="text-center text-2xl text-blue-400 font-bold">
                    No Questions Found
                  </div>
                )}
              </div>
            )
          )}
        </div>
        {/* page controller */}
        {data?.length > 0 && !finish && (
          <div className="flex justify-center items-center mb-5 bg-sblack rounded-md py-2">
            <button
              className="btn btn-error disabled:bg-gray-400 disabled:text-black disabled:cursor-not-allowed"
              onClick={() => rangeControl("prev")}
              disabled={range === 0}
            >
              Previous
            </button>
            <p className="flex p-2 h-fit">
              <span className="px-4 mx-1 text-blue-600 font-bold">
                {range + 1}
              </span>
            </p>
            <button
              className="btn btn-info disabled:bg-gray-400 aria-hidden:hidden"
              onClick={() => rangeControl("next")}
              aria-hidden={range + 1 === data?.length}
            >
              Next
            </button>
            <button
              className="btn btn-success disabled:bg-gray-400 aria-hidden:hidden"
              onClick={() => setFinish(true)}
              aria-hidden={range + 1 < data?.length || finish}
              type="submit"
            >
              Finish
            </button>
          </div>
        )}

        {finish && (
          <div className="space-y-2 p-2">
            {level == levels[0] && (
              <p className="alert alert-info">
                এই পরীক্ষাটি শুধুমাত্র নিজেকে যাচাই করার জন্যে। তাই submission
                নেওয়া হয় নি।
              </p>
            )}
            {data?.map((q, id) => {
              return (
                <QuestionCard
                  key={id + "_ques"}
                  question={q?.Question}
                  sId={id}
                  optionsList={q?.Options?.split("----")}
                  answer={q?.Answer}
                  board={q?.Board}
                  handleAnswer={handleAnswer}
                  level={q?.Type}
                  stdAnswer={{
                    ans: ansList[id]?.ans,
                    oid: ansList[id]?.oid,
                  }}
                  solve={{ txt: q?.Solution, img: q?.Solution_Img }}
                  Answer_img={q?.Answer_img}
                  showSolve={finish}
                />
              );
            })}
          </div>
        )}

        {error?.message && (
          <p className="alert alert-error mx-auto w-fit">{error?.message}</p>
        )}
      </div>
    );
}

export default Question;
