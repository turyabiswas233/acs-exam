import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.APP_URL;
function ExamPage() {
  const { id } = useParams();

  const { user, isAuthenticated } = useAuth();
  const [data, setdata] = useState({});
  const fetchQuestion = async () => {
    try {
      axios
        .get(API_URL + `api/live-exam/${id}`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.status === true) {
            setdata(res.data?.data);
            console.log(res.data?.data);

          } else {
            alert("No exam found");
            setdata(null);
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
    <div className="bg-white w-full min-h-svh rounded-md p-5">
      <h2 className="relative text-4xl text-center w-fit font-bold text-black">
        Live Exam{" "}
        <span className="w-3 h-3 top-1/2 -right-8 -translate-y-1/2 mx-2 absolute rounded-full bg-red-500 custom-bounce"></span>
        <span className="w-3 h-3 top-1/2 -right-12 -translate-y-1/2 mx-2 absolute rounded-full bg-red-500 custom-bounce"></span>
        <span className="w-3 h-3 top-1/2 -right-16 -translate-y-1/2 mx-2 absolute rounded-full bg-red-500 custom-bounce"></span>
      </h2>
    </div>
  );
}

export default ExamPage;
