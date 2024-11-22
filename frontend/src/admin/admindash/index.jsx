import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import { MdClose, MdMenu } from "react-icons/md";
import { fetchAdminInfo } from "../../hooks/adminHook";
const url = import.meta.env.APP_URL;

function AdminDash() {
  const adminLink = [
    {
      title: "Teachers",
      link: "aa_dash/teachers",
    },
    // {
    //   title: "Others",
    //   link: "aa_dash/others",
    // },
  ];
  const [show, setshow] = useState(false);
  const token = localStorage.getItem("authToken");
  const { data, error } = fetchAdminInfo(token || "");
  const location = useLocation();

  if (!data || error)
    return (
      <div className="bg-swhite p-20 m-2 rounded-lg">
        <p>
          go to{" "}
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
  else if (data?.role != "sudo-admin")
    return (
      <div className="m-20 text-center text-xl">
        You are not a ROOT ADMIN user
      </div>
    );
  else if (data && data?.role == "sudo-admin")
    return (
      <div className="h-full w-full bg-white text-black inter-medium overflow-y-auto flex flex-row relative ">
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

        <div className="m-5 grid w-full h-fit max-w-screen-2xl mx-auto p-3 md:p-5 transition-all">
          <h2 className=" text-center text-3xl xl:text-4xl my-5">
          Educrafters Dashboard ADMIN
          </h2>

          <div className="my-2">
            <Analysis />

            <Outlet context={{ data, error }} />
          </div>
        </div>
      </div>
    );
}
const SidePanel = ({ links, show, hideMenu }) => {
  return (
    <div
      className={`min-w-48 bg-slate-800 shadow-md text-slate-100 flex flex-col py-4 h-svh absolute lg:static z-10 top-0 left-0 ${
        !show
          ? "-translate-x-full "
          : "translate-x-0  shadow-lg w-dvw pt-20 lg:w-fit "
      }  transition-transform lg:translate-x-0`}
    >
      {links.map((ele, id) => (
        <NavLink
          className="bg-transparent hover:bg-white/10 px-5 py-3 transition-colors"
          key={ele.title + id}
          to={`/swift-admin/${ele.link}`}
          onClick={hideMenu}
        >
          {ele.title}
        </NavLink>
      ))}
    </div>
  );
};
const Analysis = () => {
  const [list, setList] = useState([]);
  useEffect(() => {
    async function getAnalysis() {
      try {
        const res = await axios.get(`${url}analysis/all`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(res.data);
        if (res.data.status === "success") {
          setList(res.data.data);
        } else setList([]);
      } catch (error) {
        console.log(error);
      }
    }

    getAnalysis();
  }, []);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {list.map((ele) => (
        <div className="capitalize" key={ele?.title}>
          <h3 className="font-semibold text-2xl">{ele?.title}</h3>
          <div className="bg-white border border-gray-400 rounded-md p-3 capitalize mt-3">
            <p>Total {ele?.type}</p>
            <p className="w-fit ml-auto text-4xl font-bold">{ele?.total}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default AdminDash;
