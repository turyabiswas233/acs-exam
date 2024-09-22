import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "/swiftcrab.svg";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navItems = (
    <>
      <li>
        <Link to="/">Home</Link>
      </li>
      {/* <li>
        <Link to="/publicuniversityinfo">Public University</Link>
      </li>
      <li>
        <Link to="/privateUniversityinfo">Private University</Link>
      </li> */}
      <li>
        <Link to="/services">Our Service</Link>
      </li>
      {/* <li>
        <Link to="/apply">Apply</Link>
      </li>

      <li>
        <Link to="/all_in_one">All in One</Link>
      </li> */}
    </>
  );
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <div
        className={`sticky top-0 left-0 right-0 z-50 shadow-md shadow-blue-500/10 bg-base-200 transition-all ease-in-out duration-300 `}
      >
        <div className="navbar px-5 md:px-10">
          <div className="navbar-start">
            <Link
              to="/"
              className="btn btn-ghost normal-case text-base sm:text-xl flex items-center "
            >
              <img src={logo} alt="Logo" className="w-18 h-8 mr-2" /> Swiftcrab
            </Link>
          </div>

          <div className={`navbar-center hidden xl:block `}>
            <ul className="menu menu-horizontal px-1 text-sm">{navItems}</ul>
          </div>

          <div className="navbar-end flex items-center space-x-4">
            {user != null ? (
              <NavLink to={"/settings"}>
                <button className="btn btn-primary  font-medium hover:bg-blue-700/50 hover:text-blue-300 ring-1 ring-blue-500 transition">
                  Profile
                </button>
              </NavLink>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() =>
                  // document.getElementById("my_modal_3").showModal()
                  navigate("/login")
                }
              >
                Login
              </button>
            )}
            {/* {user ? null : <Login />} */}

            {/* Mobile Dropdown Menu */}
            <div className={`xl:hidden   `}>
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                >
                  {navItems}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
