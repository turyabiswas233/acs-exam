import React, { useState, useEffect } from "react";

const Timer = ({ start, limit, setFinish, examID }) => {
  const [seconds, setSeconds] = useState(limit);
  const [isRunning, setIsRunning] = useState(false);

  const KEY_EXAM_TIME_LEFT = `EXAM_TIME_LEFT_${examID}`;

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
        localStorage.setItem(KEY_EXAM_TIME_LEFT, seconds-1); // setting value
      }, 1000);
    }
    if (seconds <= 0) {
      setFinish();
      handleStop();
      setSeconds(0);
      localStorage.removeItem(KEY_EXAM_TIME_LEFT);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds, start]);

  useEffect(() => {
    if (start) setIsRunning(true);
    // try to retrive saved value of time
    const seconds = localStorage.getItem(KEY_EXAM_TIME_LEFT);

    if ( seconds ){
      setSeconds(parseInt(seconds));
    }
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
    <div className="fixed top-45 right-6 z-20">
      <div className="bg-swhite text-sred font-semibold underline underline-offset-2 px-4 py-2 rounded-md my-1 flex justify-center text-xl">
        {/* Time remaining: */}
        {formattedTime()} 
      </div>
      
    </div>
  );
};

export default Timer;
