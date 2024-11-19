import React, { useEffect, useState } from "react";
import Toast from "./Toast";
import Input from "./Input";
import axios from "axios";
import { LuLoader } from "react-icons/lu";
function Login() {
  const [displayName, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [toast, showToast] = useState(false);
  const [load, setLoad] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("PUBLIC_USER")) || null
  );
  const userToken = localStorage.getItem("USER_TOKEN");
  const handleLogin = async (e) => {
    e.preventDefault();
    const regex = /^\+8801[3-9]\d{8}$/;
    if (
      displayName.length < 3 ||
      phone?.length < 11 ||
      regex.test(phone) === false
    ) {
      if (regex.test(phone) == false) {
        setError("Please add +88 before phone number");
      } else setError("Please fill both Name and Phone in valid format.");
      return;
    }

    const url = import.meta.env.APP_URL;
    try {
      setLoad(true);
      const { data } = await axios.post(
        `${url}api/user`,
        {
          displayName: displayName,
          phone: phone,
          uid: `${Date.now()}_${displayName}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (data?.status) {
        setUser(data?.user);
        localStorage.setItem("USER_TOKEN", data?.user?.uid);
        localStorage.setItem("PUBLIC_USER", JSON.stringify(data?.user));
        window.location = "/";
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }

    // try {
    //   // signInWithEmailAndPassword(auth, email, password);
    //   // console.log("User signed in:", userCredential.user);
    //   setError("");
    //   // Redirect or perform further actions after successful login
    // } catch (error) {
    //   console.error("Error signing in:", error);
    //   if (error?.message?.includes("network"))
    //     setError("Failed to log in. No network");
    //   else
    //     setError(
    //       "Failed to log in. Please check your input data and try again."
    //     );
    // }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const url = import.meta.env.APP_URL;
      try {
        const { data } = await axios.get(`${url}api/user`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });
        if (data?.user) {
          setUser(data?.user);

          localStorage.setItem("PUBLIC_USER", JSON.stringify(data?.user));
          window.location = "/";
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [userToken]);

  useEffect(() => {
    const loop = setTimeout(() => {
      showToast(false);
    }, 3000);
    return () => clearTimeout(loop);
  }, [toast]);
  // never touch this login code
  // const loginWithGoogle = async () => {
  //   try {
  //     const provider = new GoogleAuthProvider();
  //     let result = await signInWithPopup(auth, provider);

  //     const url = import.meta.env.APP_URL;
  //     if (result) {
  //       const { data } = await axios.get(`${url}api/user`, {
  //         method: "GET",
  //         params: {
  //           uid: auth?.currentUser?.uid,
  //         },
  //       });
  //       if (data?.message == "old_user") {
  //         console.log("Old user found");
  //       } else if (data.message == "new_user") {
  //         console.log("Creating a new user account...");

  //         await axiox.post(`${url}api/auth/signup`, {
  //           uid: result?.user?.uid,
  //           email: result?.user?.email,
  //           displayName: result?.user?.displayName,
  //           phone: result?.user?.phoneNumber
  //             ? result?.user?.phoneNumber
  //             : "no number",
  //         });
  //         setError("success");
  //       }
  //     }

  //     console.log("Google sign-in result:", result?.user?.email);
  //   } catch (error) {
  //     auth?.signOut();
  //     console.error("Error during Google sign in:", error);
  //     console.log(error);
  //     // setError("Failed to log in with Google. Please try again.");
  //     setError("Failed to create an account. Please try after a few minutes.");
  //   }
  // };
  // const { user } = useAuth();
  // useEffect(() => {
  //   let loop = setTimeout(() => {
  //     if (user?.email) {
  //       navigate("/settings");
  //     }
  //   }, 1000);
  //   return () => clearTimeout(loop);
  // }, [user]);
  return (
    <div className="w-full h-dvh bg-sblack flex justify-center items-center relative">
      {user && error === "success" && (
        <Toast success={true} message={"Login successful"} count={toast} />
      )}

      {user ? (
        <div className="modal-box grid bg-blue-900/20 text-blue-200 place-items-center ring-1 ring-blue-400">
          <h2 className="w-full rounded-lg text-lg">
            <span>Name: {user?.displayName}</span> <br />
            <span>Phone: {user?.phone || "Not provided"}</span>
          </h2>
          {/* <Link to={"/"}>
            <button className="mt-2 px-4 py-2 text-blue-500 text-lg bg-white rounded-md shadow-inner hover:shadow-blue-500 transition">
              Go to Home {">>"}
            </button>
          </Link> */}
          <button
            className="mt-2 px-4 py-2 text-lg bg-red-500 text-white rounded-md shadow-inner hover:shadow-red-100 transition"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <form
          className="bg-white rounded-2xl shadow-lg text-black space-y-2 p-10 w-full mx-2 max-w-sm my-10 shadow-slate-600/30"
          onSubmit={handleLogin}
        >
          <h3 className="text-center font-bold text-3xl lg:text-4xl mb-10">
            Login
          </h3>
          <ul className="text-xs text-sblack px-5 list-disc my-3">
            <li>
              *আপনার প্রদানকৃত তথ্য সঠিক হতে হবে। এই তথ্য দ্বারা আপনার সকল পরীক্ষার রেকর্ড সংরক্ষিত থাকবে।
            </li>
            <li>
              *আপনি সঠিকভাবে নাম পূরণ করুন। পরবর্তীতে নাম পরিবর্তন করা যাবে না।
            </li>
            <li>
              *ফোন নাম্বার এর পূর্বে +88 যোগ করুন। যেমন: +8801xxxxxxxxx
            </li>
            <li>
              *
            </li>
          </ul>
          <Input
            id={"displayName"}
            name={"displayName"}
            title={"full name"}
            type={"displayName"}
            required={true}
            setValue={(e) => setName(e.target.value)}
            value={displayName}
            placeholder={"Your full name"}
          />

          <Input
            id={"phone"}
            name={"phone"}
            title={"phone"}
            type={"tel"}
            required={true}
            minlen={11}
            setValue={(e) => setPhone(e.target.value)}
            value={phone}
            placeholder={"+8801xxxxxxxxx"}
          />

          {error && <p className="text-red-500 mt-2">{error}</p>}

          <div className="flex flex-col mt-4 space-y-2 w-full break-words">
            <button
              className="w-full btn border-none bg-blue-600 hover:bg-blue-700 text-white dm-sans-medium"
              type="submit"
              required={true}
              disabled={load}
            >
              {load ? <LuLoader className="animate-spin" size={30} /> : "Sign In"}
            </button>
            <p className="text-blue-700 text-lg text-left mt-5 mb-4">
              {/* If you are new to login, you may need to provide additional info
              after you login */}
            </p>
            {/* <button
              className="w-full btn bg-slate-100 hover:bg-slate-700 text-black dm-sans-medium hover:text-slate-50 border border-slate-700"
              type="button"
              onClick={loginWithGoogle}
            >
              <FaGoogle />
              Login with Google
            </button> */}

            {/* <p className="text-right text-sm text-gray-700/60 tracking-tight pt-5 hidden">
              Not have an account?{" "}
              <Link
                className="text-blue-600 font-normal hover:underline dm-sans-bold"
                to="/signup"
              >
                signup
              </Link>{" "}
            </p> */}
          </div>
        </form>
      )}
    </div>
  );
}

export default Login;
