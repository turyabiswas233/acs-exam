import React from "react";
import { NavLink } from "react-router-dom";
import { fetchAdminInfo } from "../hooks/adminHook";
function AdminHome() {
  const token = localStorage.getItem("authToken");
  const { data, error } = fetchAdminInfo(token || "");

  return (
    <div className="container p-10 w-full mx-auto grid justify-center items-center flex-col text-center">
      <h2 className="text-5xl my-10">Admin Page</h2>
      <div className="mt-20 space-y-6">
        <p className="text-3xl text-blue-300">
          Welcome to Educrafters Admin Panel
        </p>
        <p
          className="text-lg aria-hidden:hidden"
          aria-hidden={data?.permission}
        >
          You have to{" "}
          <NavLink
            className={"link-primary text-blue-500 text-2xl"}
            to="/swift-admin/account"
          >
            Login
          </NavLink>{" "}
          to control over Educrafters admin.
        </p>
        <hr />
        <p className="text-lg">
          You can visit Educrafters public portal from{" "}
          <NavLink className={"link-primary text-blue-500 text-2xl"} to="/">
            Here
          </NavLink>{" "}
        </p>
      </div>
    </div>
  );
}

export default AdminHome;
