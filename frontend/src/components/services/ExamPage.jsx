import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ExamQuestion from "./components/ExamQuestion";
import Timer from "./components/Timer";

const API_URL = import.meta.env.APP_URL;

function ExamPage() {
  const { id } = useParams();

  const { user, isAuthenticated } = useAuth();
  const [ data, setdata ] = useState({});
  const [ mcqAnswers, setMcqAnswers ] = useState([])

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
          // setdata(null)
        });
    } catch (error) {
      alert("Failed");
      console.log(err);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const dataloaded = Object.keys(data).length > 0;

  const questions = dataloaded ? (
    data.questionsList.map((question, i) => {
      return (
        <ExamQuestion
            key={i + 1}
            examID={id}
            question={ question }
            questionNumber={i + 1}
            onUpdate = { (optionsIds)=>{
                console.log(i+1) // question.id is undefined 
                setMcqAnswers( [...mcqAnswers, { questionId: i, options: optionsIds }] );
              }   
            }
        />
      );
    })
  ) : (
    <h1 className="error">Questions coould not be loaded</h1>
  );

  // const questions = [];

  const finishExam = () => {
    // redirect to after exam screen. For now, i am redirecting to home
    if ( data.questype == "mcq" ){
        mcqAnswers.forEach( (ans) => {
            const questionId = ans.questionId;
            const optionsIds = ans.options;

            // api call using id (examid), questionId, optionsId
            console.log(ans);
        })

        // clear mcq answers from local storage
        // data.questionsList.forEach( (q) =>{
        //   const KEY_MCQ_ANSWERS = `KEY_MCQ_ANSWERS_${id}_${q.id}`;
        //   localStorage.removeItem(KEY_MCQ_ANSWERS);
        // })
    };
    alert("Exam finished");
    // window.location = "/";
  };

  return (
    <div className="flex flex-col items-center bg-white w-full min-h-svh rounded-md p-5">
      <div className="flex justify-between w-full">
        <h2 className="relative text-blue-600 text-4xl text-center w-fit font-bold">
          Live Exam {" "}
          <span className="w-3 h-3 top-1/2 -right-8 -translate-y-1/2 mx-2 absolute rounded-full bg-red-500 custom-bounce"></span>
          <span className="w-3 h-3 top-1/2 -right-12 -translate-y-1/2 mx-2 absolute rounded-full bg-red-500 custom-bounce"></span>
          <span className="w-3 h-3 top-1/2 -right-16 -translate-y-1/2 mx-2 absolute rounded-full bg-red-500 custom-bounce"></span>
        </h2>
        {data?.duration && (
          <Timer
            start={true}
            limit={durationToSecond(data?.duration)}
            setFinish={() => {
              finishExam();
            }}
            examID={id}
          />
        )}
      </div>
      <h1 className="mb-4 mt-7 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        {data?.examname || "Demo Exam"}
      </h1>
      {questions}

      <button
        onClick = { finishExam }
        className="btn-md btn btn-primary px-16 mt-5"
      >
        {" "} Finish Exam {" "}
      </button>
    </div>
  );
}

export default ExamPage;
function durationToSecond(time) {
  return Number(time?.hh || 0) * 3600 + Number(time?.mm || 0) * 60;
}
// questions (data) majhe majhe load hoyna api theke
