import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaArrowDown, FaArrowRight } from "react-icons/fa";
const linklist = [
  /*
  {
    title: "Eligibility Checker",
    children: [
      {
        link: "/services/eligibility/public",
        title: "Public University",
      },
      {
        link: "/services/eligibility/private",
        title: "Private University",
      },
      {
        link: "/services/eligibility/admitcart",
        title: "Admit",
      },
      {
        link: "/services/eligibility/result",
        title: "Result",
      },
    ],
  },
*/
  {
    title: "Exam Site",
    children: [
      {
        link: "/#",
        title: "Study",
      },
      {
        link: "/services/exam/practice",
        title: "Practice",
      },
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
  return (
    <div className="p-2">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="bg-white p-3 lg:h-dvh rounded-lg w-full lg:max-w-sm flex flex-col">
          <h2 className="text-center p-4 text-black text-xl">Our Services</h2>
          <div className="flex flex-col space-y-2 text-sm">
            {/* navlist below */}
            <NavList />
          </div>
        </div>
        {/* page children outlet */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const NavList = () => {
  const [toggleId, setTID] = useState(-1);
  const handleToggle = (value) => {
    if (value === toggleId) setTID(-1);
    else setTID(value);
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
