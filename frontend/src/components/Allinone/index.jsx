import React, { useState, useEffect } from "react";
import tempImg from "../images/banner.jpg";
function AllInOne() {
  const courses = [
    {
      id: 1,
      title: "Course 1",
      startDate: new Date("2024-06-17T10:00:00"),
      image: tempImg,
    },
    {
      id: 2,
      title: "Course 2",
      startDate: new Date("2024-06-13T07:00:00"),
      image: tempImg,
    },
    {
      id: 3,
      title: "Course 3",
      startDate: new Date("2024-06-13T10:30:00"),
      image: tempImg,
    },
    {
      id: 4,
      title: "Course 3",
      startDate: new Date("2024-06-15T18:00:00"),
      image: tempImg,
    },
  ];
  const [upcomingCourse, setUpcomingCourse] = useState(null);

  useEffect(() => {
    const now = new Date();
    const sortedCourses = courses.sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime()
    );
    const upcoming = sortedCourses.find((course) => course.startDate > now);
    setUpcomingCourse(upcoming);
  }, []);
  return (
    <div className="px-2 py-10 min-h-screen bg-stone-100">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-indigo-600">
        All in One
      </h1>
      <div className="container mx-auto px-4">
        {/* Countdown for upcoming course */}
        {upcomingCourse && (
          <div className="rounded-lg bg-base-200 shadow-lg shadow-stone-400/80 my-8 p-4">
            <div className="card-body flex justify-between items-center px-5">
              <h2 className="card-title">Upcoming Course</h2>
              <div className="flex flex-col md:flex-row md:justify-center items-center gap-5 md:gap-10">
                <Countdown date={upcomingCourse?.startDate} />
                <div className="max-w-md rounded-lg bg-blue-400 text-black shadow-md">
                  <img
                    src={upcomingCourse?.image}
                    className="w-auto rounded-t-lg"
                    alt=""
                    width={500}
                    height={500}
                  />
                  <div className="card-body">
                    <h5 className="card-title text-3xl">
                      {upcomingCourse.title}
                    </h5>
                    <p className="text-xl">
                      Start Date:{" "}
                      {upcomingCourse.startDate.toLocaleDateString()}
                    </p>
                    <p className="text-xl">
                      Start Time:{" "}
                      {upcomingCourse.startDate.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Courses */}
        <>
          <h2 className="text-base-100 font-bold underline underline-offset-4 decoration-blue-500 text-3xl text-center mt-20 mb-8">
            All Course
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {courses
              ?.sort(
                (a, b) => a?.startDate?.getTime() - b?.startDate?.getTime()
              )
              ?.map((course) => (
                <div
                  key={course.id}
                  className="card-compact bg-white shadow-xl rounded-2xl overflow-x-hidden group hover:shadow-blue-300/50"
                >
                  <img width={500} height={500} src={course.image} alt="" />
                  <div className="p-4 bg-base-100 group-hover:bg-blue-500  group-hover:text-black transition-colors duration-300">
                    <h5 className="card-title">{course.title}</h5>
                    <p>Start Date: {course.startDate.toLocaleDateString()}</p>
                    <p>Start Time: {course.startDate.toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
          </div>
        </>
      </div>
    </div>
  );
}
const Countdown = ({ date }) => {
  const [curDate, setDate] = useState(new Date());
  const [dur, setDur] = useState({
    dd: 0,
    hh: 0,
    mm: 0,
    ss: 0,
  });
  useEffect(() => {
    const loop = setInterval(() => {
      let ndate = new Date();
      setDate(ndate);
    }, 1000);
    return () => clearInterval(loop);
  }, []);
  useEffect(() => {
    let duration = (date?.getTime() - curDate?.getTime()) / 1000;
    if (duration > 0) {
      let dd = Math.floor(duration / 86400);
      let hh = Math.floor(duration % 86400) / 3600;
      let mm = Math.floor((duration % 3600) / 60);
      let ss = Math.floor(duration % 60);
      setDur({ dd, hh, mm, ss });
    } else setDur({ dd: 0, hh: 0, mm: 0, ss: 0 });
  }, [curDate]);
  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max mx-auto w-full scale-90 md:scale-100 ">
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown flex justify-center font-mono text-3xl lg:text-5xl">
          <span style={{ "--value": dur.dd }}></span>
        </span>
        Days
      </div>
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown flex justify-center font-mono text-3xl lg:text-5xl">
          <span style={{ "--value": dur.hh }}></span>
        </span>
        Hours
      </div>
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown flex justify-center font-mono text-3xl lg:text-5xl">
          <span style={{ "--value": dur.mm }}></span>
        </span>
        Min
      </div>
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown flex justify-center font-mono text-3xl lg:text-5xl">
          <span style={{ "--value": dur.ss }}></span>
        </span>
        Sec
      </div>
    </div>
  );
};
export default AllInOne;
