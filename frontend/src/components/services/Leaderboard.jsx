import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.APP_URL;
function Leaderboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [data, setData] = useState([]);

  const fetchLeaderboard = async () => {
    if (isAuthenticated)
      axios
        .get(API_URL + "api/leaderboard", {
          params: {
            examtype: "MCQ",
          },
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.status) {
            setData(res.data.list);
          }
        });
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
              <th>Student Name</th>
              <th>Exam Name</th>
              <th>Exam type</th>
              <th>Subject</th>
              <th>Chapter</th>
              <th>Correct</th>
              <th>In-correct</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((ele, id) => {
              return (
                <tr
                  key={`leader_${id}`}
                  className="rounded-sm hover:bg-slate-200 bg-slate-100 text-slate-800"
                >
                  <td>{ele?.username}</td>
                  <td>{ele?.examname}</td>
                  <td className="text-center">{ele?.examtype}</td>
                  <td>{ele?.subject}</td>
                  <td>{ele?.chapter}</td>
                  <td className="text-center">{ele?.correct}</td>
                  <td className="text-center">{ele?.inCorrect}</td>
                  <td className="text-center">
                    {ele?.correct - ele?.inCorrect * 0.25}/{ele?.total}
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
