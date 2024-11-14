import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.APP_URL;
function Leaderboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [data, setData] = useState([]);
  const fetchLeaderboard = async () => {
    if (isAuthenticated)
      try {
        axios.get(API_URL + `api/live-exam/exam/${user?.uid}`).then((res) => {
          if (res.data.status) {
            setData(res.data?.data);
          }
        });
      } catch (error) {
        console.log(error);
      }
  };

  useEffect(() => {
    if (!loading) {
      fetchLeaderboard();
    }
  }, [loading, user]);

  return (
    <div className="w-full h-svh bg-white rounded-md p-5">
      <h2 className="my-5 text-center font-bold text-black text-5xl">
        Leaderboard
      </h2>

      {user && data.length > 0 ? (
        <table className="leader table rounded-md overflow-hidden h-fit">
          <thead className="rounded-sm bg-slate-800 text-slate-200">
            <tr>
              <th>Exam Name</th>
              <th>Exam type</th>
              <th>Correct</th>
              <th>In-correct</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((ele, id) => {
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
                  e.submitted.forEach((f) => {
                    if (e.answer.find((g) => g.id === f).isCorrect) {
                      correct += 1;
                    } else {
                      inCorrect += 1;
                    }
                  });
                }
              });
              total = correct - inCorrect;
              return (
                <tr
                  key={`leader_${id}`}
                  className="rounded-sm hover:bg-slate-200 bg-slate-100 text-slate-800"
                >
                  <td>{exam?.examname}</td>
                  <td className="text-center">{exam?.examtype}</td>

                  <td className="text-center">{correct || 0}</td>
                  <td className="text-center">{inCorrect || 0}</td>
                  <td className="text-center">{total || 0}</td>
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
