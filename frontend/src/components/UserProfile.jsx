import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../Config/firebase-config";
import axios from "axios";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { MdVerified } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";
import { LuLoader } from "react-icons/lu";

function UserProfile() {
  const [user, isAuthenticated] = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [fname, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newPass, setNPass] = useState("");
  const [oldPass, setOPass] = useState("");
  const [loading, setload] = useState(true);
  const [err, seterr] = useState("");

  const [toast, showToast] = useState("");
  const navigate = useNavigate();

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

  // effect on UI

  useEffect(() => {
    if (user) {
      setEmail(data?.email);
      setPhone(data?.phone);
      setName(data?.displayName);

      setload(false);
    }
  }, [user, data]);

  useEffect(() => {
    setTimeout(() => {
      setload(false);
    }, 5000);
  }, []);

  async function fetchUser() {
    let url = import.meta.env.APP_URL || "";

    try {
      setload(true);
      const response = await axios.get(`${url}api/user`, {
        method: "GET",
        params: {
          uid: auth?.currentUser?.uid,
        },
      });
      if (response.status !== 200) {
        throw new Error("Failed to fetch user");
      }
      const resultData = await response.data;

      setData(resultData?.user);
      // console.log(resultData);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setload(false);
    }
  }
  useEffect(() => {
    fetchUser();
  }, [user]);

  // ===================== update USER profile ==================
  async function updateProfileInfo(e) {
    e.preventDefault();
    const url = import.meta.env.APP_URL;
    if (!fname || !phone) {
      seterr("Please fill all the information");
      return;
    } else
      try {
        if(data?.displayName === fname && data?.phone === phone){
          alert("Nothing to update");

          return;
        }
        let newData;
        seterr("");
        setload(true);
        if (data?._id) {
          await axios
            .patch(`${url}api/user/update/profile/${data?._id}`, {
              displayName: fname,
              phone: `${phone}`,
            })
            .then(async (res) => {
              newData = res.data?.data;
              await updateProfile(auth.currentUser, {
                displayName: fname,
              }).then(() => {
                showToast("profile");
                setData(newData);
              });
            });

          // location.reload();
        } else showToast("pfailed");
      } catch (error) {
        showToast("pfailed");
      } finally {
        setload(false);
      }
  }

  useEffect(() => {
    let loop = setTimeout(() => {
      showToast("");
    }, 3000);
    return () => clearTimeout(loop);
  }, [toast]);

  if (user == null) {
    return (
      <h2 className="text-gray-200/60 text-center my-20">
        Please login to change your profile setting.
      </h2>
    );
  }

  return (
    <div className="py-20 text-base">
      {/* absolute BG */}

      <div className="w-11/12 lg:w-4/5 max-w-6xl mx-auto bg-white shadow-lg shadow-gray-700/50 rounded-xl lg:px-10 py-5">
        <header className="px-2 lg:px-10 my-7 flex flex-col md:flex-row justify-normal md:justify-between items-start gap-2">
          <div>
            <h1 className="text-3xl text-slate-800 font-bold flex gap-3">
              Account Settings{" "}
              {isAuthenticated == 1 ? (
                <MdVerified color="#2277cc" size={24} />
              ) : (
                <button
                  className="bg-green-400 px-4 py-2 text-base rounded-md hover:bg-green-500"
                  type="button"
                  onClick={() => {
                    const url = import.meta.env.APP_URL;
                    sendEmailVerification(user, {
                      url: `${url}settings`,
                    })
                      .then(() => {
                        showToast("sent");
                      })
                      .catch((err) => showToast("error"));
                  }}
                >
                  Verify now
                </button>
              )}
              {toast == "sent" && (
                <Toast
                  count={true}
                  message={"Verification mail sent to " + user?.email}
                  success={true}
                />
              )}
              {toast == "error" && (
                <Toast
                  count={true}
                  message={"Please try after a few minutes."}
                  success={false}
                />
              )}
            </h1>
            <p className="text-sm text-opacity-60 text-slate-900">
              Edit your profile informations.
            </p>
          </div>
          {user && (
            <button
              className="bg-rose-600 text-white px-4 py-2 text-center rounded-md "
              type="button"
              onClick={async () =>
                await auth.signOut().then(() => {
                  navigate("/");
                })
              }
            >
              Logout
            </button>
          )}
        </header>
        <div>
          <div className=" w-auto rounded-xl p-5 shadow-lg shadow-slate-100 m-5">
            <h2 className="text-green-600 underline text-xl underline-offset-4">
              Current status{" "}
              <span className="text-sm text-blue-400 ">
                {`[${
                  isAuthenticated == 1
                    ? "Authentic"
                    : isAuthenticated == 0
                    ? "Not verified"
                    : ""
                }]`}
              </span>
            </h2>
            {data != null ? (
              <div className="w-full">
                <div className="flex justify-between w-full">
                  <div>
                    <p className="hidden">
                      UID Status:{" "}
                      {data?.uid === user?.uid
                        ? "This account is correct"
                        : "Wrong account"}
                    </p>
                    <p>Name: {data?.displayName}</p>
                    <p>Email: {data?.email}</p>
                    <p>Phone: {data?.phone}</p>
                    <p>
                      Logged in with:{" "}
                      {auth.currentUser.providerData[0].providerId}
                    </p>
                  </div>
                  {false && auth.currentUser.providerData[0].photoURL ? (
                    <img
                      className="object-cover w-36 h-auto rounded-full"
                      src={auth.currentUser.providerData[0].photoURL}
                      alt=""
                      width={250}
                      height={250}
                    />
                  ) : null}
                </div>

                <div className="flex-col md:flex-row gap-2 md:justify-between hidden">
                  <HSCInfo
                    info={data?.hsc || { roll: "", board: "", reg: "" }}
                  />
                  <SSCInfo
                    info={data?.ssc || { roll: "", board: "", reg: "" }}
                  />
                </div>
              </div>
            ) : (
              "no user data"
            )}
          </div>
        </div>

        {loading ? (
          <div className=" w-20 h-20 rounded-full border-8 border-black/50 border-t-black mx-auto animate-spin "></div>
        ) : (
          <>
            {isAuthenticated === 0 && (
              <p className="text-rose-500 font-bold text-xs text-center mt-10">
                *Verify first to change informations.
              </p>
            )}
            <div
              className={`flex mx-5 flex-col lg:grid lg:grid-cols-2 gap-10 ${
                isAuthenticated == 0 &&
                "grayscale opacity-50 pointer-events-none cursor-not-allowed"
              }`}
            >
              <form
                className="mx-auto relative w-full bg-slate-100 px-5 py-10 rounded-2xl text-sblack ring-1 ring-sblack"
                onSubmit={updateProfileInfo}
              >
                <h1 className="text-lg font-semibold">Update Information</h1>

                <section className="p-5 rounded-lg space-y-3 bg-slate-200 my-4 ring-2 ring-slate-200/20 w-full grid gap-1">
                  <label htmlFor="Name">
                    Your Name{" "}
                    <span className="text-red-500 text-sm font-semibold">
                      *as certificate honours certificate
                    </span>
                  </label>
                  <input
                    className="p-2 w-full text-base bg-transparent ring-2 ring-blue-500 border-none outline-none rounded-md "
                    type="text"
                    value={fname}
                    placeholder="Enter your name"
                    name="Name"
                    id="Name"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </section>
                <section className="p-5 rounded-lg space-y-3 bg-slate-200 my-4 ring-2 ring-slate-200/20 w-full grid  gap-1">
                  <label htmlFor="email">Your Email</label>
                  <input
                    className="p-2 w-full text-base bg-transparent ring-2 ring-blue-500 border-none outline-none rounded-md  disabled:ring-gray-400 disabled:opacity-60 cursor-not-allowed  "
                    type="email"
                    value={email}
                    name="email"
                    disabled={true}
                    aria-disabled
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    id="email"
                  />
                </section>
                <section className="p-5 rounded-lg space-y-3 bg-slate-200 my-4 ring-2 ring-slate-200/20 w-full grid  gap-1 ">
                  <label htmlFor="phone">Registered Phone Number</label>

                  <input
                    className="p-2 w-full text-base bg-transparent ring-2 ring-blue-500 border-none outline-none rounded-md "
                    type="tel"
                    value={phone}
                    name="phone"
                    placeholder="01xxxxxxxxx"
                    minLength={11}
                    onInvalid={(e) => {
                      seterr("Please enter a   phone number");
                    }}
                    accept="number"
                    onKeyDown={(e) => {
                      if ((e.key >= 0 && e.key <= 9) || e.key == "Backspace")
                        return true;
                      e.preventDefault();
                      return false;
                    }}
                    id="phone"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </section>
                {err && <p className="text-xs text-rose-500">{err}</p>}
                {toast == "profile" && (
                  <Toast message={"Profile updated"} success={true} />
                )}
                {toast == "pfailed" && (
                  <Toast
                    message={"Profile not updated. Try again."}
                    success={false}
                  />
                )}
                <input
                  type="submit"
                  className="bg-blue-500 text-white mt-5 px-5 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition-colors"
                  value="Save"
                />
              </form>
              <form
                className={`hidden relative mx-auto w-full bg-slate-900 px-5 py-10 rounded-xl text-blue-100 ${
                  auth.currentUser.providerData[0].providerId ===
                    "google.com" &&
                  " aria-disabled:bg-opacity-70 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none"
                }`}
                aria-disabled={
                  auth.currentUser.providerData[0].providerId === "google.com"
                }
                onSubmit={(e) => e.preventDefault()}
              >
                {auth.currentUser.providerData[0].providerId ===
                  "google.com" && (
                  <p className="text-rose-600 bg-white px-2 text-sm">
                    ** You are logged in with google. No need to change password
                    **
                  </p>
                )}
                {toast == "password" && (
                  <Toast message={"Password changed"} success={true} />
                )}
                <h2 className="text-lg underline font-bold">Change Password</h2>

                <section className="p-5 rounded-lg space-y-3 bg-slate-800/60 my-4 ring-2 ring-slate-200/20 w-full grid  gap-1">
                  <label htmlFor="npass">Old Password</label>
                  <input
                    className="p-2 w-full text-base bg-transparent ring-2 ring-blue-500 border-none outline-none rounded-md "
                    type="password"
                    value={oldPass}
                    minLength={6}
                    autoComplete="current-password"
                    name="opass"
                    placeholder="Type old password"
                    id="opass"
                    onChange={(e) => setOPass(e.target.value)}
                  />
                </section>
                <section className="p-5 rounded-lg space-y-3 bg-slate-800/60 my-4 ring-2 ring-slate-200/20 bg-slate-800 text-white w-full grid  gap-1 relative">
                  <label htmlFor="npass">New Password</label>
                  <input
                    className="p-2 w-full text-base bg-transparent ring-2 ring-blue-500 border-none outline-none rounded-md "
                    type="password"
                    value={newPass}
                    minLength={6}
                    autoComplete="new-password"
                    name="npass"
                    id="npass"
                    placeholder="Type New password"
                    required
                    onChange={(e) => setNPass(e.target.value)}
                  />
                </section>
                <button
                  className="text-sm  mt-6 bg-white px-5 py-3 rounded-full text-blue-600 hover:bg-blue-800/50 hover:ring-2 ring-blue-600 transition capitalize  disabled:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                  onClick={() => {
                    auth.currentUser.reload().then(() => {
                      updatePassword(user, newPass)
                        .then((e) => {
                          showToast("password");
                          setNPass("");
                          setOPass("");
                        })
                        .catch(async (err) => {
                          console.log(err?.message);
                          alert(
                            "Please enter old password correctly to set new password"
                          );
                          const cred = EmailAuthProvider.credential(
                            auth.currentUser.email,
                            oldPass
                          );
                          await reauthenticateWithCredential(
                            auth.currentUser,
                            cred
                          ).then(() => {
                            updatePassword(user, newPass).then((e) => {
                              showToast("password");
                              setNPass("");
                              setOPass("");
                            });
                          });
                        });
                    });
                  }}
                  disabled={newPass.length < 6}
                  type="button"
                >
                  change password
                </button>
              </form>
              <div className="hidden">
                <SSCForm brd={board} data={data} />
                <HSCForm brd={board} data={data} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const HSCForm = ({ brd, data }) => {
  const [hsc, setHsc] = useState({
    board: "",
    roll: "",
    reg: "",
  });
  const [err, seterr] = useState("");
  const [toast, showToast] = useState("");

  // ===================== update USER HSC profile ==================
  async function updateHSCInfo(e) {
    e.preventDefault();
    const url = import.meta.env.APP_URL;
    if (!hsc.board || !hsc.roll || !hsc.reg) {
      seterr("Please fill all the informations");
      return;
    } else
      try {
        seterr("");
        if (data?._id) {
          await axios
            .patch(`${url}api/user/update/hsc/${data?._id}`, {
              hsc,
            })
            .then((res) => {
              showToast("success");
              console.log(res);
            });
        } else showToast("failed");
      } catch (error) {
        {
          seterr("Update Failed");
          showToast("failed");
        }
      }
  }
  useEffect(() => {
    let loop = setTimeout(() => {
      showToast("");
    }, 3000);
    return () => clearTimeout(loop);
  }, [toast]);
  return (
    <div className="bg-slate-900 rounded-xl px-5 py-10 relative">
      {toast == "success" && (
        <Toast message={"Update successful"} success={true} />
      )}
      {toast == "failed" && <Toast message={"Update failed"} success={false} />}
      <p className="text-lg underline font-bold text-blue-100">
        HSC informations
      </p>
      <p className="text-xs text-rose-500">
        *NB:- please fillup all the informations of HSC to update.
      </p>
      <form onSubmit={updateHSCInfo}>
        <section className="p-5 rounded-lg space-y-2 bg-slate-800/60 my-4 ring-2 ring-slate-200/20 w-full grid  gap-1">
          <label className="block text-gray-200 font-bold mb-2">Board</label>
          <select
            className="w-full px-3 py-2 capitalize"
            name="board"
            onChange={(e) =>
              setHsc((pre) => ({ ...pre, board: e.target.value }))
            }
          >
            <optgroup>
              <option
                className="disabled"
                value="choose a Board"
                disabled={true}
                selected
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
        </section>
        <section className="p-5 rounded-lg space-y-2 bg-slate-800/60 my-4 ring-2 ring-slate-200/20 w-full grid  gap-1">
          <label htmlFor="hroll" className="block text-gray-200 font-bold mb-2">
            Roll
          </label>
          <input
            type="number"
            id="hroll"
            className="w-full px-3 py-2 border rounded-md outline-none"
            placeholder="HSC Roll"
            onChange={(e) =>
              setHsc((pre) => ({ ...pre, roll: e.target.value.toString() }))
            }
          />
        </section>
        <section className="p-5 rounded-lg space-y-2 bg-slate-800/60 my-4 ring-2 ring-slate-200/20 w-full grid  gap-1">
          <label htmlFor="hreg" className="block text-gray-200 font-bold mb-2">
            Registration
          </label>
          <input
            type="number"
            id="hreg"
            className="w-full px-3 py-2 border rounded-md outline-none"
            placeholder="HSC Registration"
            onChange={(e) =>
              setHsc((pre) => ({ ...pre, reg: e.target.value.toString() }))
            }
          />
        </section>
        {err && <p className="text-xs text-rose-500">{err}</p>}

        <input
          type="submit"
          className="bg-blue-500 text-white mt-5 px-5 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition-colors"
          value="Save"
        />
      </form>
    </div>
  );
};
const SSCForm = ({ brd, data }) => {
  const [ssc, setSsc] = useState({
    board: "",
    roll: "",
    reg: "",
  });
  const [err, seterr] = useState("");
  const [toast, showToast] = useState("");
  // ===================== update USER SSC profile ==================
  async function updateSSCInfo(e) {
    e.preventDefault();
    const url = import.meta.env.APP_URL;
    if (!ssc.board || !ssc.roll || !ssc.reg) {
      seterr("Please fill all the informations");
      return;
    } else
      try {
        seterr("");
        if (data?._id) {
          await axios
            .patch(`${url}api/user/update/ssc/${data?._id}`, {
              ssc: ssc,
            })
            .then(() => {
              showToast("success");
            })
            .catch((error) => {
              showToast("failed");

              seterr(error?.message);
              // seterr("catch1: Please fill all the informations");
            });
        } else {
          showToast("failed");
          seterr("else: Please fill all the informations");
        }
      } catch (error) {
        showToast("failed");
        seterr("catch2: Please fill all the informations");
      }
  }
  useEffect(() => {
    let loop = setTimeout(() => {
      showToast("");
    }, 3000);
    return () => clearTimeout(loop);
  }, [toast]);
  return (
    <div className="bg-slate-900 rounded-xl px-5 py-10 relative">
      {toast == "success" && (
        <Toast message={"Update successful"} success={true} />
      )}
      {toast == "failed" && <Toast message={"Update failed"} success={false} />}
      <p className="text-lg underline font-bold text-blue-100">
        SSC informations
      </p>
      <p className="text-xs text-rose-500">
        *NB:- please fillup all the informations of SSC to update.
      </p>
      <form onSubmit={updateSSCInfo}>
        <section className="p-5 rounded-lg space-y-2 bg-slate-800/60 my-4 ring-2 ring-slate-200/20 w-full grid  gap-1">
          <label className="block text-gray-200 font-bold mb-2">Board</label>
          <select
            className="w-full px-3 py-2 capitalize"
            name="board"
            onChange={(e) =>
              setSsc((pre) => ({ ...pre, board: e.target.value }))
            }
          >
            <optgroup>
              <option
                className="disabled"
                value="choose a Board"
                disabled={true}
                selected
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
        </section>
        <section className="p-5 rounded-lg space-y-2 bg-slate-800/60 my-4 ring-2 ring-slate-200/20 w-full grid  gap-1">
          <label htmlFor="sroll" className="block text-gray-200 font-bold mb-2">
            Roll
          </label>
          <input
            type="number"
            id="sroll"
            className="w-full px-3 py-2 border rounded-md outline-none"
            placeholder="SSC Roll"
            value={ssc.roll}
            onChange={(e) =>
              setSsc((pre) => ({ ...pre, roll: e.target.value.toString() }))
            }
          />
        </section>
        <section className="p-5 rounded-lg space-y-2 bg-slate-800/60 my-4 ring-2 ring-slate-200/20 w-full grid  gap-1">
          <label htmlFor="sreg" className="block text-gray-200 font-bold mb-2">
            Registration
          </label>
          <input
            type="number"
            id="sreg"
            value={ssc.reg}
            className="w-full px-3 py-2 border rounded-md outline-none"
            placeholder="SSC Registration"
            onChange={(e) =>
              setSsc((pre) => ({ ...pre, reg: e.target.value.toString() }))
            }
          />
        </section>
        {err && <p className="text-xs text-rose-500">{err}</p>}
        <input
          type="submit"
          className="bg-blue-500 text-white mt-5 px-5 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition-colors"
          value="Save"
        />
      </form>
    </div>
  );
};

const HSCInfo = ({ info: { roll, reg, board } }) => {
  return (
    <div className="p-2 text-left bg-white text-black/80 rounded-md my-2">
      <h4 className="font-bold uppercase">HSC Info:</h4>
      <div className="px-3 capitalize">
        <p>Board: {board || "not provided"}</p>
        <p>Roll: {roll || "not provided"}</p>
        <p>Registration: {reg || "not provided"}</p>
      </div>
    </div>
  );
};
const SSCInfo = ({ info: { roll, reg, board } }) => {
  return (
    <div className="p-2 text-left bg-white text-black/80 rounded-md my-2">
      <h4 className="font-bold uppercase">SSC Info:</h4>
      <div className="px-3 capitalize">
        <p>Board: {board || "not provided"}</p>
        <p>Roll: {roll || "not provided"}</p>
        <p>Registration: {reg || "not provided"}</p>
      </div>
    </div>
  );
};
export default UserProfile;
