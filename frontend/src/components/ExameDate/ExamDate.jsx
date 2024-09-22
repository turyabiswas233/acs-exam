import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function ExamDate() {
  const [exams, setExams] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  useEffect(() => {
    const getExamdate = async () => {
      if (user == null) return;
      try {
        let url = import.meta.env.APP_URL || "";
        const res = await axios.get(`${url}api/examdate`);
        console.log(res.data);
        setExams(res.data);
      } catch (error) {
        console.log("Error: " + error);
        setError("Failed to fetch exam dates. Please try again later.");
      }
    };
    getExamdate();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-indigo-600">
          Upcoming Exams
        </h1>

        {user == null ? (
          <div className="text-center">User must login to see the data</div>
        ) : (
          <div className="flex flex-wrap justify-center">
            <div className="w-full lg:w-2/3 px-4 mb-4">
              {error ? (
                <div className="text-red-500 text-center mb-6">{error}</div>
              ) : (
                <>
                  <div className="border-b-2 border-gray-300 pb-2 mb-6">
                    <div className="flex text-lg font-semibold text-gray-700">
                      <div className="w-1/2">Exam Name</div>
                      <div className="w-1/2">Exam Date</div>
                    </div>
                  </div>
                  {exams.map((exam, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-6 shadow-lg bg-white mb-6 transform transition duration-500 hover:scale-105"
                    >
                      <div className="flex items-center text-base">
                        <div className="w-1/2 text-gray-800 font-medium">
                          {exam.examName}
                        </div>
                        <div className="w-1/2">
                          {new Date(exam.examDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamDate;
