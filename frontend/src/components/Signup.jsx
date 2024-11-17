import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import axios from "axios";
import Input from "./Input";
import { auth } from "../Config/firebase-config";
// import { useAuth } from "../context/AuthContext";

function Signup() {
  const [fname, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPass, setConPass] = useState("");
  const [hsc, setHsc] = useState({
    board: "",
    roll: "",
    reg: "",
  });
  const [ssc, setssc] = useState({
    board: "",
    roll: "",
    reg: "",
  });
  const board = [
    "barishal",
    "chattogram",
    "cumilla",
    "dhaka",
    "dinajpur",
    "jashore",
    "madrasa",
    "rajshahi",
    "sylhet",
    "mymensingh",
    "technical",
  ];
  const [error, setError] = useState("");

  const [loading, setload] = useState(false);
  const navigate = useNavigate();
  //const { user, setAuthentication } = useAuth();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("PUBLIC_USER")) || null
  );

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both email and password fields.");
      return;
    }

    try {
      setload(true);
      setError("");
      await createUserWithEmailAndPassword(auth, email, password);

      updateProfile(auth.currentUser, {
        displayName: fname,
      }).then(async () => {
        setload(false);
        const url = import.meta.env.APP_URL || "";
        await axios
          .post(`${url}api/auth`, {
            uid: auth?.currentUser?.uid,
            email: auth?.currentUser?.email,
            displayName: auth?.currentUser?.displayName,
            phone: phone,
            hsc: hsc,
            ssc: ssc,
          })
          .then(() => {
            setError("success");
          })
          .catch((err) => {
            auth?.currentUser?.delete();
            setAuthentication(-1);
            setError("Failed to create the account with " + email);
            console.log("====================================");
            console.log(err);
            console.log("====================================");
          });
      });
    } catch (error) {
      console.error("Error signing up:", error);
      auth?.currentUser?.delete();
      setload(false);
      setError("Failed to sign up. Please try again.");
      if (error.message?.includes("weak-password"))
        setError("Weak password. Make it stronger");
      if (error?.message?.includes("email-already-in-use"))
        setError(
          "Already have an account with this email. Please try again with different email."
        );
    }
  };

  useEffect(() => {
    if (error == "success") {
      navigate("/");
    }
  }, [error]);
  useEffect(() => {
    // if (user && !user?.emailVerified) navigate("/settings");
    if (user) navigate("/");
  }, []);
  const [eduCheck, setEduCheck] = useState({
    ssc: false,
    hsc: false,
  });
  return (
    <div className="p-10">
      <div className="bg-white rounded-2xl shadow-lg text-black space-y-2 p-10 w-full max-w-lg my-10 mx-auto">
        <h2 className="text-center font-bold text-3xl lg:text-4xl mb-10">
          Create New Account
        </h2>
        <form onSubmit={handleSignup}>
          <Input
            type={"text"}
            id={"fname"}
            name={"fname"}
            title={"Name"}
            placeholder={"Full Name [English]"}
            required={true}
            value={fname}
            setValue={(e) => setName(e.target.value)}
          />

          <Input
            type="tel"
            id="phone"
            name={"phone"}
            title={"Phone"}
            placeholder="017xxxxxxxx"
            required={true}
            minLength={11}
            value={phone}
            setValue={(e) => setPhone(e.target.value)}
          />
          <div className="education pl-1  py-3">
            <p className="font-bold">Education Status: </p>
            <HSCForm
              brd={board}
              setHsc={setHsc}
              eduCheck={eduCheck}
              setEduCheck={setEduCheck}
            />
            <SSCForm
              brd={board}
              setSsc={setssc}
              eduCheck={eduCheck}
              setEduCheck={setEduCheck}
            />
          </div>
          <Input
            type="email"
            id="email"
            name={"email"}
            title={"Email"}
            value={email}
            setValue={(e) => setEmail(e.target.value)}
            placeholder={"Enter your email"}
            required={true}
          />

          <Input
            type="password"
            id="password"
            placeholder="Password[minimun 6 digit]"
            required
            title={"Password"}
            value={password}
            setValue={(e) => setPassword(e.target.value)}
          />

          <Input
            type="password"
            id="conPass"
            placeholder="Confirm your Password"
            required
            title={"Confirm Password"}
            value={conPass}
            setValue={(e) => setConPass(e.target.value)}
          />
          {conPass.length !== 0 ? (
            conPass !== password ? (
              <p className="text-red-400 text-sm pb-3">
                {" "}
                *Password is not matched
              </p>
            ) : (
              <p className="text-green-400 text-sm pb-3"> Password matched</p>
            )
          ) : null}
          {error && <p className="text-red-500 mt-8">*{error}</p>}

          <div className="flex justify-center">
            <button
              className="w-full btn border-none bg-blue-600 hover:bg-blue-700 text-white dm-sans-medium"
              type="submit"
            >
              {loading ? "loading..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="text-right text-sm text-gray-700/60 tracking-tight">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline dm-sans-bold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
const HSCForm = ({ brd, setHsc, setEduCheck, eduCheck }) => {
  return (
    <>
      <div className="checker space-x-4 flex items-center ">
        <input
          type="checkbox"
          name="hsc"
          id="hsc_chk"
          hidden
          defaultChecked={false}
          onChange={(e) => {
            setEduCheck((pre) => ({ ...pre, hsc: e.target.checked }));
          }}
        />
        <div className={`chkbox ${eduCheck?.hsc && "a"}`}></div>
        <label htmlFor="hsc_chk">HSC</label>
      </div>
      {eduCheck?.hsc && (
        <div className="pl-5">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Board</label>
            <select
              className="w-full px-3 py-2 capitalize text-white"
              name="board"
              onChange={(e) =>
                setHsc((pre) => ({ ...pre, board: e.target.value }))
              }
            >
              <optgroup defaultValue={"Choose a Board"}>
                <option
                  className="disabled"
                  value="choose a Board"
                  selected
                  disabled={true}
                >
                  Choose a Board
                </option>
                {brd?.map((b) => (
                  <option key={`h_${b}`} value={b}>
                    {b}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <Input
            type="number"
            id="hroll"
            name={"hroll"}
            title={"Roll"}
            placeholder="HSC Roll"
            setValue={(e) =>
              setHsc((pre) => ({ ...pre, roll: e.target.value.toString() }))
            }
          />

          <Input
            type="number"
            id="hreg"
            name={"hreg"}
            title={"Registration"}
            placeholder="HSC Registration"
            setValue={(e) =>
              setHsc((pre) => ({ ...pre, reg: e.target.value.toString() }))
            }
          />
        </div>
      )}
    </>
  );
};
const SSCForm = ({ brd, setSsc, setEduCheck, eduCheck }) => {
  return (
    <>
      <div className="checker space-x-4 flex items-center ">
        <input
          type="checkbox"
          name="ssc"
          id="ssc_chk"
          hidden
          defaultChecked={false}
          onChange={(e) => {
            setEduCheck((pre) => ({ ...pre, ssc: e.target.checked }));
          }}
        />
        <div className={`chkbox ${eduCheck?.ssc && "a"}`}></div>
        <label htmlFor="ssc_chk">HSC</label>
      </div>

      {eduCheck?.ssc && (
        <div className="pl-5">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Board</label>
            <select
              className="w-full px-3 py-2 capitalize text-white"
              name="board"
              onChange={(e) =>
                setSsc((pre) => ({ ...pre, board: e.target.value }))
              }
            >
              <optgroup defaultValue={"Choose a Board"}>
                <option
                  className="disabled"
                  value="choose a Board"
                  selected
                  disabled={true}
                >
                  Choose a Board
                </option>
                {brd?.map((b) => (
                  <option key={`s_${b}`} value={b}>
                    {b}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          <Input
            type="number"
            id="sroll"
            name={"sroll"}
            title={"Roll"}
            placeholder="SSC Roll"
            setValue={(e) =>
              setSsc((pre) => ({ ...pre, roll: e.target.value.toString() }))
            }
          />

          <Input
            type="number"
            id="sreg"
            name={"sreg"}
            title={"Registration"}
            placeholder="SSC Registration"
            setValue={(e) =>
              setSsc((pre) => ({ ...pre, reg: e.target.value.toString() }))
            }
          />
        </div>
      )}
    </>
  );
};
export default Signup;
