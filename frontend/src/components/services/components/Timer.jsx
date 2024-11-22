import React, { useState, useEffect } from "react";

const Timer = ({ start, limit, setFinish, examID, etime }) => {
  const [seconds, setSeconds] = useState(limit);
  const [isRunning, setIsRunning] = useState(false);
  const [curtime, setCurtime] = useState(new Date().getTime());

  const KEY_EXAM_STARTED_TIME = `KEY_EXAM_STARTED_TIME_${examID}`;

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        if (curtime > etime) {
          alert("Time is up! Submitting the exam.");
          clearInterval(interval);
          setFinish();
        }
        if (seconds >= 1) {
          setSeconds((prevSeconds) => prevSeconds - 1);
        } else {
          if (seconds === 0) {
            setFinish();
          }
          clearInterval(interval);
        }
        setCurtime(new Date().getTime());
      }, 1000);
      // localStorage.setItem(KEY_EXAM_STARTED_TIME, seconds-1); // setting value
    }
    //console.log(seconds)
    // if (seconds === 0) {
    //   setFinish();
    // handleStop();
    // setSeconds(0);
    // localStorage.removeItem(KEY_EXAM_TIME_LEFT);
    // }
    return () => clearInterval(interval);
  }, [isRunning, seconds, start]);

  useEffect(() => {
    if (start) setIsRunning(true);
    // try to retrive saved value of time
    const localStartTime = localStorage.getItem(KEY_EXAM_STARTED_TIME);

    if (localStartTime) {
      const started = parseInt(localStartTime);
      const now = new Date().getTime();
      const diff = parseInt((now - started) / 1000);
      if (diff <= seconds) {
        setSeconds(seconds - diff);
      } else {
        setSeconds(0);
      }
    } else {
      const started = new Date().getTime();
      localStorage.setItem(KEY_EXAM_STARTED_TIME, started);
    }

    // if ( seconds ){
    //   setSeconds(parseInt(seconds));
    // }
  }, [start]);

  const handleStop = () => setIsRunning(false);

  const formattedTime = () => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed top-45 right-6 shadow-xl rounded-lg z-20">
      <div className="bg-swhite text-sred font-semibold underline underline-offset-2 px-4 py-2 rounded-md my-1 flex justify-center text-xl">
        {/* Time remaining: */}
        {formattedTime()}
      </div>
    </div>
  );
};

export default Timer;
