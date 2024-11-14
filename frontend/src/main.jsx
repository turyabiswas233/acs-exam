import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import Home from "./Home/Home.jsx";
import UserProfile from "./components/UserProfile.jsx";
import ForgetPassoword from "./components/ForgetPassoword.jsx";
import Login from "./components/LoginUI.jsx";
import Signup from "./components/Signup.jsx";

import Result from "./components/Result/Result.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy.jsx";
import TermsConditions from "./components/TermsConditions.jsx";
import Services from "./components/services/index.jsx";

import Question from "./components/services/Question.jsx";
import ChallengeQuestion from "./components/services/ChallengeQuestion.jsx";
import ExamPage from "./components/services/ExamPage.jsx";
import Leaderboard from "./components/services/Leaderboard.jsx";
import Error from "./Error.jsx";
// admin info
import AdminPage from "./admin/index.jsx";
import ErrorAdmin from "./admin/ErrorAdmin.jsx";
import AdminHome from "./admin/Home.jsx";
import AccountPage from "./admin/account/index.jsx";
import Dashboard from "./admin/dashboard/index.jsx";
import AdminDash from "./admin/admindash/index.jsx";
import AllTeachers from "./admin/teachers/index.jsx";
import AllStudents from "./admin/students/index.jsx";
import AdminExamForm from "./admin/dashboard/exam/Form.jsx";
import AdminExamList from "./admin/dashboard/exam/List.jsx";
import AdminQuestion from "./admin/dashboard/question/index.jsx";
import AdminLeaderboard from "./admin/dashboard/Leaderboard.jsx";
import ViewExam from "./admin/dashboard/exam/ViewExam.jsx";
import Verified from "./admin/account/Verified.jsx";

const routerConfig = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/settings",
        element: <UserProfile />,
      },
      {
        path: "/forgetpassword",
        element: <ForgetPassoword />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },

      {
        path: "/services",
        element: <Services />,
        children: [
          {
            path: "eligibility/result",
            element: <Result />,
          },
          {
            path: "exam/practice",
            element: <Question />,
          },
          {
            path: "exam/challenge",
            element: <ChallengeQuestion />,
          },
          {
            path: "exam/:id",
            element: <ExamPage />,
          },
          {
            path: "leaderboard",
            element: <Leaderboard />,
          },
        ],
      },

      {
        path: "/privacy_policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms_and_conditions",
        element: <TermsConditions />,
      },
    ],
  },
  {
    path: "/swift-admin",
    element: <AdminPage />,
    errorElement: <ErrorAdmin />,

    children: [
      {
        index: true,
        element: <AdminHome />,
      },
      {
        path: "account",
        element: <AccountPage />,
      },
      {
        path: "account/verified/:userId",
        element: <Verified />,
      },
      {
        path: "aa_dash",
        element: <AdminDash />,
        children: [
          {
            path: "teachers",
            element: <AllTeachers />,
          },
        ],
      },
      {
        path: "a_dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "exam",
            children: [
              {
                path: "create",
                element: <AdminExamForm />,
              },
              {
                path: "add_q/:examid",
                element: <AdminQuestion />,
              },
              {
                path: "view",
                element: <AdminExamList />,
              },
              {
                path: "view/:examid",
                element: <ViewExam />,
              },
            ],
          },
          {
            path: "students",
            element: <AllStudents />,
          },

          {
            path: "leaderboard",
            element: <AdminLeaderboard />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={routerConfig} />
  </StrictMode>
);
