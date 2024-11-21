import React, { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.APP_URL;
import { LuLoader } from "react-icons/lu";

function Leaderboard() {
  const [list, setList] = useState([]);
  const user = JSON.parse(localStorage.getItem("adminuser") || {});
  const [limit, setLimit] = useState(100);
  const [short, setShort] = useState(-1);
  const [load, setLoad] = useState(false);
  const fetchLeaderboard = async () => {
    try {
      setLoad(true);
      const { data } = await axios.get(
        API_URL + `sadmin/leaderboard?limit=${limit}&shortType=${short}`,
        {
          headers: {
            Authorization: `Bearer ${user?.uid}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log(data);
      if (data.status) {
        setList(data?.list);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }
  };
  const fetchExams = async () => {
    try {
      setLoad(true);
      const { data } = await axios.get(
        API_URL + `sadmin/leaderboard/exams`,
        {
          headers: {
            Authorization: `Bearer ${user?.uid}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log(data);
      if (data.status) {
        setExams(data?.list);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }
  };
  useEffect(() => {
    fetchExams();
  }, [ ]);
  useEffect(() => {
    fetchLeaderboard();
  }, [ limit, short]);
  return (
    <div className="w-full h-svh bg-white rounded-md p-5">
      <h2 className="my-5 text-center font-bold text-black text-5xl">
        Leaderboard
      </h2>
      <div className="flex gap-3 items-start text-white p-1">
        {/* short by: examname, examtype */}
        <select
          className="w-1/4 rounded-md p-3"
          onChange={(e) => {
            setShort(e.target.value);
          }}
        >
          <option value="-1">Sort by</option>
          <option value="examname">Exam Name</option>
          <option value="examtype">Exam Type</option>
        </select>
        <input
          type="number"
          className="w-1/4 rounded-md p-3"
          placeholder="Limit"
          value={limit}
          max={200}
          onChange={(e) => {
            setLimit(e.target.value);
          }}  
        />
      </div>
      {load ? (
        <div className="w-full h-52 flex justify-center items-center">
          {"Please wait. "}
          <LuLoader className="text-blue-700 animate-spin" size={30} />{" "}
        </div>
      ) : list.length > 0 ? (
        <table className="leader rounded-md h-fit">
          <thead className="rounded-sm bg-slate-800 text-slate-200">
            <tr>
              <th>Exam Name</th>
              <th>Exam type</th>
              <th>Correct</th>
              <th>In-correct</th>
              <th>Skipped</th>
            </tr>
          </thead>
          <tbody>
            {list?.map((ele, id) => {
              const exam = ele?.exam;
              const submitInfo = ele?.submitInfo;
              let correct = 0;
              let inCorrect = 0;
              let total = 0;
              const markList = exam?.questionsList?.map((e) => ({
                submitted: submitInfo?.find((f) => f.questionId === e?._id)
                  ?.optionsIds,
                answer: e?.options,
              }));

              markList.forEach((e) => {
                if (e.submitted) {
                  let flag = true;
                  let d = null;
                  e.submitted.forEach((f) => {
                    d = e.answer.find((g) => g.id === f);
                    if (d)
                      if (!d?.isCorrect) {
                        flag = false;
                      }
                    if (!d) {
                      flag = false;
                      return;
                    }
                  });
                  if (flag) correct++;
                  else inCorrect++;
                }
              });
              total = correct - inCorrect;
              return (
                <tr
                  key={`leader_${id}`}
                  className="rounded-sm hover:bg-slate-200 bg-slate-100 text-slate-800"
                  onClick={() => {
                    navigate(`/services/exam/${exam?._id}`);
                  }}
                  title="Click to view the exam result"
                >
                  <td className="text-center">{exam?.examname} </td>
                  <td className="text-center">{exam?.examtype}</td>

                  <td className="text-center">{correct || 0}</td>
                  <td className="text-center">{inCorrect || 0}</td>
                  <td className="text-center">
                    {exam?.questionsList?.length - markList?.length}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="text-3xl text-center text-black font-semibold">
          No data to show
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
