import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import AuthProvider, { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Alert from "./components/Alert";
import Footer from "./components/Footer";
function App() {
  // const { user, isAuthenticated } = useAuth();

  return (
    <AuthProvider>
      <div className="max-h-screen bg-gray-900 text-gray-400  overflow-y-auto">
        <Navbar />
        <div className="relative min-h-[50vh] max-w-screen-2xl mx-auto">
          {/* {!user ? null : isAuthenticated == 0 ? (
           <Alert message="Please verify your email" />
          ) : null} */}
          <Outlet />
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
