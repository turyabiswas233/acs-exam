import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaArrowDown, FaArrowRight } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
const linklist = [
  {
    title: "Exam Site",
    children: [
      // {
      //   link: "/services/exam/practice",
      //   title: "Practice",
      // },
      {
        link: "/services/exam/challenge",
        title: "Live Exam",
      },
      {
        link: "/services/leaderboard",
        title: "Leaderboard",
      },
    ],
  },
];
function Services() {
  // const { user } = useAuth();
  const user = JSON.parse(localStorage.getItem("PUBLIC_USER")) || null
  return (
    <div className="p-2">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="bg-white text-black p-3 rounded-lg w-full lg:max-w-sm flex flex-col">
          <h2 className="text-center p-4 text-xl">Our Services</h2>
          <div className="flex flex-col space-y-2 text-sm">
            {/* navlist below */}
            <NavList />
          </div>
        </div>
        {/* page children outlet */}
        <div className="flex-1">
          {user ? (
            <Outlet />
          ) : (
            <div className="bg-white rounded-md w-full mx-auto p-5">
              <h3 className="text-2xl text-center">
                Please login to view the Page
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const NavList = () => {
  const [toggleId, setTID] = useState(0);
  const handleToggle = (value) => {
    // if (value === toggleId) setTID(-1);
    setTID(value);
  };
  return (
    <>
      {linklist.map((ele, linkid) => {
        if (ele?.children?.length === 0)
          return (
            <NavLink
              to={ele.link}
              className="px-4 py-2 w-full bg-transparent rounded-md hover:bg-slate-900/10 transition-colors h-fit"
              key={`navid${ele.title}`}
            >
              {ele.title}
            </NavLink>
          );
        else
          return (
            <div
              key={`navid${ele.title}`}
              className="flex flex-col space-y-2 group"
            >
              <button
                className="px-4 py-2 w-full bg-transparent text-nowrap inline-flex items-center gap-2 rounded-md group-hover:bg-blue-500 text-sblack transition-colors ease-out duration-300 h-fit"
                type="button"
                onClick={() => handleToggle(linkid)}
              >
                {ele.title}
                {toggleId !== linkid ? <FaArrowRight /> : <FaArrowDown />}
              </button>
              {toggleId === linkid &&
                ele.children.map((child, ckey) => (
                  <NavLink
                    key={`child_nav${ckey}`}
                    className="pl-10 py-2 w-full bg-transparent rounded-md hover:bg-slate-900/10 transition-colors h-fit"
                    to={child.link}
                  >
                    {child?.title}
                  </NavLink>
                ))}
            </div>
          );
      })}
    </>
  );
};

export default Services;
