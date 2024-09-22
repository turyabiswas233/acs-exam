import React, { useContext, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import { MdClose, MdMenu } from "react-icons/md";
import { AuthContext } from "../../context/AuthContext";
import { fetchAdminInfo } from "../../hooks/adminHook";
function Dashboard() {
  const adminLink = [
    {
      title: "Exam",
      child: [
        {
          title: "Create",
          link: "a_dashboard/exam/create",
        },
        {
          title: "List",
          link: "a_dashboard/exam/view",
        },
      ],
    },
    {
      title: "Students",
      link: "a_dashboard/students",
    },
    // {
    //    title: "Question",
    //    link: "a_dashboard/questions",
    // },
    // {
    //   title: "Reports",
    //   link: "a_dashboard/reportPage",
    // },
    {
      title: "Leaderboard",
      link: "a_dashboard/leaderboard",
    },
    // {
    //   title: "Student's Query",
    //   link: "a_dashboard/a_quest",
    // },
  ];
  const [show, setshow] = useState(false);
  const [user] = useContext(AuthContext);
  const token = localStorage.getItem("authToken");
  const { data } = fetchAdminInfo(token || "");
  if (!user)
    return (
      <div className="bg-swhite p-20 m-2 rounded-lg text-xl">
        {" "}
        <p>
          Go to{" "}
          <a
            className="text-blue-500 bg-blue-500/20 px-3 py-2 rounded-md hover:bg-blue-500 hover:text-swhite transition"
            href="/swift-admin/account"
          >
            login
          </a>{" "}
          page
        </p>
      </div>
    );
  else if (data?.role == "sudo-admin" || data?.role == "teacher")
    return (
      <div className="h-auto min-h-svh w-full bg-white text-black poppins-bold overflow-y-scroll flex flex-row relative ">
        <div>
          <button
            className="bg-blue-50 p-4 rounded-md  text-blue-600 z-50 absolute right-6 top-1 my-2 lg:hidden"
            onClick={() => {
              setshow((pre) => !pre);
            }}
          >
            {!show ? <MdMenu size={20} /> : <MdClose size={20} />}
          </button>
          <SidePanel
            links={adminLink}
            show={show}
            hideMenu={() => setshow(false)}
          />
        </div>

        <div className="m-5 grid w-full h-fit px-5">
          <h2 className=" text-center text-3xl xl:text-4xl mt-5 mb-10">
            ACSExam Dashboard TEACHER
          </h2>
          <Outlet />
        </div>
      </div>
    );
  else
    return (
      <div className="m-20 text-center text-xl">
        Ask ADMIN to approve your account as a TEACHER.
      </div>
    );
}
const SidePanel = ({ links, show, hideMenu }) => {
  return (
    <div
      className={`min-w-48 bg-slate-800 shadow-md text-slate-100 flex flex-col py-4 h-full absolute lg:static z-10 top-0 left-0 ${
        !show
          ? "-translate-x-full "
          : "translate-x-0  shadow-lg w-dvw pt-20 lg:w-fit "
      }  transition-transform lg:translate-x-0`}
    >
      {links.map((ele) => {
        if (ele?.link)
          return (
            <NavLink
              className="bg-transparent hover:bg-white/10 px-5 py-3 transition-colors"
              key={ele.title}
              to={`/swift-admin/${ele.link}`}
              onClick={hideMenu}
            >
              {ele.title}
            </NavLink>
          );
        else if (ele?.child) {
          return (
            <div className="px-5 grid" key={`dashList_${ele.title}`}>
              <p>{ele.title}</p>
              {ele?.child?.map((child, cid) => {
                return (
                  <NavLink
                    className="bg-transparent hover:bg-white/10 px-5 py-3 transition-colors"
                    key={"child_" + cid + "~" + child.title}
                    to={`/swift-admin/${child.link}`}
                    onClick={hideMenu}
                  >
                    {child.title}
                  </NavLink>
                );
              })}
            </div>
          );
        }
      })}
    </div>
  );
};
export default Dashboard;
