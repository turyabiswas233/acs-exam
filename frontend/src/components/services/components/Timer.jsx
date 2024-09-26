import React, { useState, useEffect } from "react";

const Timer = ({ start, limit, setFinish }) => {
  const [seconds, setSeconds] = useState(limit);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }
    if (seconds <= 0) {
      handleStop();
      setFinish(true);
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds, start]);

  useEffect(() => {
    if (start) setIsRunning(true);
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
