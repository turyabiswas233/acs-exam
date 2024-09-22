import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AuthProvider from "../context/AuthContext";
import AdminNavbar from "./Navbar";
import { fetchAdminInfo } from "../hooks/adminHook";
function AdminPage() {
  return (
    <AuthProvider>
      <AdminRoot />
    </AuthProvider>
  );
}
const AdminRoot = () => {
  const token = localStorage.getItem("authToken");
  const { data, error } = fetchAdminInfo(token || "");

  return (
    <div className="w-screen h-screen left-0 top-0 fixed overflow-y-auto overflow-x-hidden">
      <AdminNavbar />
      <Outlet />
    </div>
  );
};
export default AdminPage;
