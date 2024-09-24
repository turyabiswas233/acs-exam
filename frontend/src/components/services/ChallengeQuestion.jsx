import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";

const API_URL = import.meta.env.APP_URL;

function Question() {
  const { user, isAuthenticated } = useAuth();
  const [data, setdata] = useState([]);
  const fetchQuestion = async () => {
    try {
      axios
        .get(API_URL + "api/live-exam", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.status === true) {
            setdata(res.data?.list);
          } else {
            alert("No exam found");
            setdata([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      alert("Failed");
      console.log(err);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  return (
    <div className="bg-white rounded-md w-full mx-auto p-5">
      {!user && (
        <h1 className="text-2xl text-center">Please login to view the exams</h1>
      )}

      {isAuthenticated == 1 && data?.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {data?.map((exam) => (
            <ExamCard key={exam._id} exam={exam} />
          ))}
        </div>
      ) : (
        <h1 className="text-2xl text-center">No exams found</h1>
      )}
    </div>
  );
}
const ExamCard = ({ exam }) => {
  const starttime = new Date(exam?.starttime);
  const endtime = new Date(exam?.endtime);
  console.log(exam.duration);
  return (
    <div className="bg-amber-200 shadow-lg rounded-md p-4 my-3 space-y-3 shadow-slate-900/30">
      <h1 className="text-xl font-bold text-white">{exam?.title}</h1>
      <p className="text-blue-500 font-bold">
        Start Time: {starttime.toLocaleString()}
      </p>
      <p className="text-blue-500 font-bold">
        End Time: {endtime.toLocaleString()}
      </p>
      <p className="text-blue-500 font-bold">
        Duration: {exam.duration.hh} hours {exam.duration.mm} minutes
      </p>
      <button className="my-3">
        <NavLink
          to={`/services/exam/${exam._id}`}
          className="bg-slate-700 text-white px-3 py-1 rounded-md hover:bg-slate-900 transition-colors"
        >
          Start Exam
        </NavLink>
      </button>
    </div>
  );
};
export default Question;
