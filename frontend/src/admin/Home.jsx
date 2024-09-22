import React from "react";
import { NavLink  } from "react-router-dom";
import {fetchAdminInfo} from '../hooks/adminHook'
function AdminHome() {
  const token = localStorage.getItem('authToken');
  const { data, error } = fetchAdminInfo(token||'');
   
  return (
    <div className="container text-white p-10 w-full mx-auto grid justify-center items-center flex-col text-center">
      <h2 className="stat-title text-5xl my-10">Admin Page</h2>
      <div className="mt-20 space-y-6">
        <p className="text-3xl text-blue-300">
          Welcome to ACSExam Admin Panel
        </p>
        <p
          className="text-lg aria-hidden:hidden"
          aria-hidden={data?.permission}
        >
          You have to{" "}
          <NavLink
            className={"link-primary text-2xl"}
            to="/swift-admin/account"
          >
            login
          </NavLink>{" "}
          to control over Swiftcrab admin.
        </p>
      </div>
    </div>
  );
}

export default AdminHome;
