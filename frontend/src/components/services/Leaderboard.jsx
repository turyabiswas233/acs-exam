import React, { useEffect, useState } from "react";
import axios from "axios";
// import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.APP_URL;

function Leaderboard() {
  // const { user, loading, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  // { user } = useAuth()
  const user = JSON.parse(localStorage.getItem("PUBLIC_USER")) || null
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const fetchLeaderboard = async () => {
    // if (isAuthenticated)
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
    if (!loading && user) {
      fetchLeaderboard();
    }
  }, [loading, user]);
  if (!user)
    return (
      <div className="bg-white rounded-md w-full mx-auto p-5">
        <h3 className="text-2xl text-center">Please login to view the Page</h3>
      </div>
    );
  return (
    <div className="w-full h-svh bg-white rounded-md p-5">
      <h2 className="my-5 text-center font-bold text-black text-5xl">
        Leaderboard
      </h2>

      {user && data.length > 0 ? (
        <table className="leader rounded-md overflow-hidden h-fit">
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
