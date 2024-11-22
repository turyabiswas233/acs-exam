import React, { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.APP_URL;
import { LuLoader } from "react-icons/lu";

function Leaderboard() {
  const [exList, setExList] = useState([]);
  const [list, setList] = useState([]);
  const user = JSON.parse(localStorage.getItem("adminuser") || {});
  const [limit, setLimit] = useState(10);
  const [filter, setShort] = useState(null);
  const [page, setPage] = useState(1);

  const [load, setLoad] = useState(false);

  const fetchLeaderboard = async () => {
    if (filter)
      try {
        setLoad(true);
        const { data } = await axios.get(
          API_URL +
            `sadmin/leaderboard?limit=${limit}&examId=${filter}&page=${page}`,
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
      const { data } = await axios.get(API_URL + `sadmin/leaderboard/exams`, {
        headers: {
          Authorization: `Bearer ${user?.uid}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log(data);
      if (data.status) {
        setExList(data?.list);
        if (data?.list.length > 0) setShort(data?.list[0]?._id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }
  };
  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (filter) reloadLeaderboard();
  }, [page, limit, filter]);

  const reloadLeaderboard = () => {
    fetchLeaderboard();
  };
  return (
    <div className="w-full h-svh rounded-md p-5">
      <h2 className="my-5 text-center font-bold text-black text-5xl">
        Leaderboard
      </h2>
      <div className="flex gap-3 items-center text-white p-1">
        <section className="w-auto text-black">
          <label className="text-xs" htmlFor="fenc">
            Filter by Exam Name and class
          </label>
          <select
            className="w-auto text-sm rounded-md p-2 ring-1 bg-white text-black"
            name="fenc"
            id="fenc"
            onChange={(e) => {
              setShort(e.target.value);
            }}
          >
            {exList.map((f) => (
              <option value={f?._id} key={f?._id}>
                {f?.examname} - {f?.examclass}
              </option>
            ))}
          </select>
        </section>
        <section className="grid text-slate-800 w-fit">
          <label className="text-xs" htmlFor="limit">
            Limit per page
          </label>
          <select
            name="limit"
            id="limit"
            className="w-auto text-sm rounded-md p-1 ring-1 bg-white"
            value={limit}
            onChange={(e) => {
              setLimit(e.target.value);
            }}
          >
            {[10, 25, 50, 100].map((f) => (
              <option value={f} key={`f-${f}`}>
                {f}
              </option>
            ))}
          </select>
        </section>
        <button
          className="bg-blue-500 text-swhite rounded-full text-sm px-5 py-2 my-auto"
          type="button"
          onClick={reloadLeaderboard}
        >
          Reload
        </button>
      </div>
      <p>Found: {list?.length}</p>
      {load ? (
        <div className="w-full h-52 flex justify-center items-center">
          {"Please wait. "}
          <LuLoader className="text-blue-700 animate-spin" size={30} />{" "}
        </div>
      ) : list.length > 0 ? (
        <div className="my-2 max-h-[50vh] overflow-y-auto">
          <table className="table rounded-md h-fit min-w-fit">
            <thead className="rounded-sm bg-slate-800 text-slate-200">
              <tr className="grid grid-cols-5 text-center">
                <th>Student</th>
                <th>Exam type</th>
                <th>Correct</th>
                <th>In-correct</th>
                <th>Skipped</th>
              </tr>
            </thead>
            <tbody>
              {list?.map((ele, id) => {
                const exam = ele?.exam;
                const us = ele?.user;
                const submitInfo = ele?.submitInfo;
                let correct = 0;
                let inCorrect = 0;
                let total = 0;
                const markList = exam?.questionsList?.map((e) => ({
                  submitted: submitInfo?.find((f) => f.questionId === e?._id)
                    ?.optionsIds,
                  answer: e?.options,
                }));
                if (markList?.length !== 0)
                  markList?.forEach((e) => {
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
                    className="grid grid-cols-5 rounded-sm hover:bg-slate-200 bg-slate-100 text-slate-800 text-center"
                    onClick={() => {
                      navigate(`/services/exam/${exam?._id}`);
                    }}
                    title="Click to view the exam result"
                  >
                    <td className="text-center">{us?.displayName} </td>
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
        </div>
      ) : (
        <div className="text-3xl text-center text-black font-semibold">
          No data to show
        </div>
      )}
      <div className="flex space-x-2 justify-center my-10 items-center">
        <button
          className="bg-slate-200 px-3 py-2"
          onClick={() => {
            if (page > 1) setPage((pre) => pre - 1);
          }}
        >
          ⬅️
        </button>
        <p>Page: {page}</p>
        <button
          className="bg-slate-200 px-3 py-2"
          onClick={() => {
            if (list?.length == limit) setPage((pre) => pre + 1);
          }}
        >
          ➡️
        </button>
      </div>
    </div>
  );
}

export default Leaderboard;
