import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function ResultTable() {
  const [data, setData] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    const fetchResults = async () => {
      let url = import.meta.env.APP_URL || "";
      if (user)
        try {
          const response = await fetch(`${url}api/result`);
          if (!response.ok) {
            throw new Error("Failed to fetch results");
          }
          const resultData = await response.json();
          setData(resultData);
        } catch (error) {
          console.error("Error fetching results:", error);
        }
    };

    fetchResults();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-indigo-600">
          Exam Results
        </h1>
        {user == null ? (
          <div className="text-center">User must login to see the data</div>
        ) : (
          <div className="flex flex-wrap justify-center">
            <div className="w-full lg:w-2/3 px-4 mb-4">
              <div className="border-b-2 border-gray-300 pb-2 mb-6">
                <div className="flex text-lg font-semibold text-gray-700">
                  <div className="w-1/3">University Name</div>
                  <div className="w-1/3">Exam Name</div>
                  <div className="w-1/3">Result Link</div>
                </div>
              </div>
              {data.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-6 shadow-lg bg-white mb-6 transform transition duration-500 hover:scale-105"
                >
                  <div className="flex items-center text-base">
                    <div className="w-1/3 text-gray-800 font-medium">
                      {item.universityName}
                    </div>
                    <div className="w-1/3 text-gray-800 font-medium">
                      {item.examName}
                    </div>
                    <div className="w-1/3">
                      <a
                        href={item.resultLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 underline transition duration-300"
                      >
                        View Result
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultTable;
