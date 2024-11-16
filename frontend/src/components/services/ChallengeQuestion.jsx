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
            setdata(res.data?.list || []);
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
    if (user) fetchQuestion();
  }, [user]);

  if (!user)
    return (
      <div className="bg-white rounded-md w-full mx-auto p-5">
        <h3 className="text-2xl text-center">Please login to view the Page</h3>
      </div>
    );

  return (
    <div className="bg-white rounded-md w-full mx-auto p-5">
      {!user && (
        <h3 className="text-2xl text-center">Please login to view the exams</h3>
      )}
      {isAuthenticated == 1 && data?.length > 0 ? (
        <div>
          <h1 className="text-4xl font-bold text-center text-sblack underline">
            Exam List
          </h1>
          <p className="text-slate-800">
            You are viewing all the exam including past and upcoming exams
          </p>

          <div className=" gap-2 flex flex-col md:flex-row flex-wrap">
            {data?.map((exam) => (
              <ExamCard key={exam._id} exam={exam} />
            ))}
          </div>
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
  return (
    <div className="bg-swhite ring-1 ring-blue-500 shadow-md rounded-md p-4 my-3 space-y-3 shadow-slate-500/30 min-w-max">
      <h1 className="text-xl font-bold text-blue-500">
        {exam?.examname}{" "}
        <span className="text-red-500 font-bold text-sm px-3 animate-pulse">
          {new Date().getTime() > starttime.getTime() &&
            new Date().getTime() < endtime.getTime() &&
            "*Live now"}
        </span>
      </h1>
      <p className="text-black font-bold">
        Start Time:{" "}
        {starttime.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <p className="text-black font-bold">
        End Time:{" "}
        {endtime.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <p className="text-yellow-800 font-bold">
        Duration: {exam.duration.hh} hours {exam.duration.mm} minutes
      </p>
      <button
        className="my-3"
        hidden={new Date().getTime() < starttime.getTime()}
      >
        <NavLink
          to={`/services/exam/${exam._id}`}
          className="bg-blue-800 text-white px-3 py-1 rounded-md hover:bg-blue-500 transition-colors"
        >
          Explore exam
        </NavLink>
      </button>
    </div>
  );
};
export default Question;
