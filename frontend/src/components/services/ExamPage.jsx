import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 
import { auth } from "../../Config/firebase-config"; 
import TakeExam from "./components/TakeExam";
import ExamFinish from "./components/ExamFinish";
import ExamReview from "./components/ExamReview";

const API_URL = import.meta.env.APP_URL;
const CONST_TAKE_EXAM = "take_exam_screen";
const CONST_EXAM_FINISH = "exam_finish_screen";
const CONST_EXAM_REVIEW = "exam_review_screen";
const CONST_EXAM_PAGE_LOADING = "exam_page_loading";

function ExamPage() {
  const { id } = useParams();

  const { user, isAuthenticated } = useAuth();
  const [ data, setdata] = useState({});
  // const [ mcqAnswers, setMcqAnswers] = useState([]);

  const [ currentScreen, setCurrentScreen ] = useState(CONST_EXAM_PAGE_LOADING);

  const checkPastExam = async () => {
    // console.log(user);
    const response = (
      await axios.get(
        API_URL + `api/live-exam/checkpastexam/${user?.uid}/${id}`
      )
    );
    if ( response.data ){
      if ( response.data.allowExam ){
        setCurrentScreen(CONST_TAKE_EXAM);
      }else{
        setCurrentScreen(CONST_EXAM_REVIEW);
      }
    }
    // console.log("Prev sub", response.data);
  };

  useEffect(() => {
    checkPastExam();
  }, []);



   

  return (<>
    { currentScreen === CONST_TAKE_EXAM && <TakeExam id={id}
        onFinishDemand = { ()=>{
          setCurrentScreen(CONST_EXAM_FINISH);
        }}
    />}

    { currentScreen === CONST_EXAM_FINISH && <ExamFinish 
      onReviewDemand={()=>{
        setCurrentScreen(CONST_EXAM_REVIEW);
      }} />
    }

    { currentScreen === CONST_EXAM_REVIEW && <ExamReview id={ id } /> }

    { 
      currentScreen === CONST_EXAM_PAGE_LOADING
      && <div className="text-white bg-gray-900 rounded-sm w-full p-6">
          <p>Keep patience</p>
          <progress className="progress w-56"></progress>
      </div>
    }
  </>);
}

export default ExamPage;
function durationToSecond(time) {
  return Number(time?.hh || 0) * 3600 + Number(time?.mm || 0) * 60;
}
// questions (data) majhe majhe load hoyna api theke
