import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
const API_URL = import.meta.env.APP_URL;
function Leaderboard() {
  const [list, setList] = useState([]);
  const { user } = useAuth();
  const [limit, setLimit] = useState(100);
  const [short, setShort] = useState(-1);
  const fetchLeaderboard = async () => {
    try {
      axios
        .get(API_URL + `sadmin/leaderboard?limit=${limit}&shortType=${short}`, {
          headers: {
            Authorization: `Bearer ${user?.uid}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.status) {
            setList(res.data?.list);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchLeaderboard();
  }, [user, limit, short]);
  return (
    <div className="w-full h-svh bg-white rounded-md p-5">
      <h2 className="my-5 text-center font-bold text-black text-5xl">
        Leaderboard
      </h2>
      {list.length > 0 ? (
        <table className="table rounded-md overflow-hidden shadow-xl">
          <thead className="rounded-sm bg-slate-800 text-slate-200">
            <tr>
              {/* <th>Student Name</th> */}
              <th>Exam Name</th>
              <th>Exam type</th>
              {/* <th>Subject</th>
              <th>Chapter</th>
              <th>Correct</th>
              <th>In-correct</th> */}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {list?.map((ele, id) => {
              return (
                <tr
                  key={`leader_${id}`}
                  className="rounded-sm hover:bg-slate-200 bg-slate-100 text-slate-800"
                >
                  {/* <td>{ele?.username}</td> */}
                  <td>{ele?.examname}</td>
                  <td>{ele?.examtype}</td>
                  {/* <td>{ele?.subject}</td> */}
                  {/* <td>{ele?.chapter}</td> */}
                  {/* <td>{ele?.correct}</td>
                  <td>{ele?.inCorrect}</td> */}
                  <td>
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
