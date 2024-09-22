import React, { useContext } from "react";
import {
  MdLogin,
  MdAccountCircle,
  MdDashboard,
  MdDashboardCustomize,
} from "react-icons/md";

import logo from "/swiftcrab.svg";
import { auth } from "../Config/firebase-config";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { fetchAdminInfo } from "../hooks/adminHook";

function AdminNavbar() {
  const [user] = useContext(AuthContext);
  const { data, error } = fetchAdminInfo(user?.uid || "");
  const navigate = useNavigate();

  return (
    <nav
      className={`w-full h-fit text-black font-medium sticky top-0 left-0 z-[500] transform-gpu shadow-md shadow-slate-400/50 bg-white `}
    >
      <div className="navbar w-full max-w-4xl xl:max-w-6xl  mx-auto">
        <div className="navbar-start">
          <button className="btn bg-blue-600 text-white border-none scale-75 md:scale-90 xl:scale-100">
            <p className="inline-flex h-fit text-lg xl:text-xl items-center gap-1 justify-center">
              <img src={logo} className="object-cover px-2" width={50} alt="" />{" "}
              ACSExam
            </p>
          </button>
        </div>
        <div className="navbar-end text-blue-500 space-x-2 xl:max-w-6xl x-1">
          {user ? (
            <>
              <Link
                className="btn btn-ghost p-2 hover:bg-blue-600 hover:text-blue-50  aria-hidden:hidden"
                to={"/swift-admin/aa_dash"}
                aria-hidden={!data?.permission || data?.role !== "sudo-admin"}
              >
                <MdDashboardCustomize size={20} />{" "}
                <span className="hidden md:inline-block">Admin Dashboard</span>
              </Link>
              <Link
                className="btn btn-ghost p-2 hover:bg-blue-600 hover:text-blue-50  aria-hidden:hidden"
                to={"/swift-admin/a_dashboard"}
                aria-hidden={!data?.permission}
              >
                <MdDashboard size={20} />{" "}
                <span className="hidden md:inline-block">Dashboard</span>
              </Link>
              <Link
                className="flex items-center gap-1 btn btn-ghost p-2 hover:bg-blue-600 hover:text-blue-50"
                to={"/swift-admin/account"}
              >
                <MdAccountCircle size={20} />
                <span className="hidden md:inline-block">Profile</span>
              </Link>
              <button
                className="btn btn-ghost p-2 hover:bg-blue-600 hover:text-blue-50"
                onClick={() => {
                  localStorage.removeItem("authToken");
                  localStorage.removeItem("adminuser");
                  auth.signOut().then(() => {
                    navigate("/swift-admin/account");
                  });
                }}
              >
                <MdLogin size={20} />{" "}
                <span className="hidden md:inline-block">Logout</span>
              </button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
