import React from "react";
import logo from "/swiftcrab.svg";

function Footer() {
  return (
    <div>
      <footer className="footer p-10 text-base-content bg-gray-50 ">
        <aside className="mb-6">
          {" "}
          {/* Add margin-bottom for spacing */}
          <img
            src={logo}
            className="mb-4"
            alt="Swiftcrab Logo"
            width={100}
            height={100}
          />{" "}
        </aside>

        <nav className="mb-6">
          {" "}
          {/* Add margin-bottom for spacing */}
          <h6 className="footer-title mb-2 font-semibold">Company</h6>{" "}
          {/* Add margin-bottom for spacing */}
          <a className="link link-hover mb-2 block">About us</a>
        </nav>
        <nav>
          <h6 className="footer-title mb-2 font-semibold">Legal</h6>{" "}
          {/* Add margin-bottom for spacing */}
          <a
            className="link link-hover mb-2 block"
            href="/terms_and_conditions"
          >
            Terms & Conditions
          </a>
          <a className="link link-hover mb-2 block" href="/privacy_policy">
            Privacy policy
          </a>
          <a className="link link-hover mb-2 block">Cookie policy</a>
        </nav>
      </footer>
    </div>
  );
}

export default Footer;
