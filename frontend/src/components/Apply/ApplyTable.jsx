import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function ApplyTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      if (user)
        try {
          let url = import.meta.env.APP_URL || "";
          setLoading(true);
          const response = await fetch(`${url}api/apply`);
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const result = await response.json();
          setData(result);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      else setLoading(false);
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-indigo-600">
          Apply for Exams
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
                  <div className="w-1/3">Apply Link</div>
                </div>
              </div>
              {data?.map((item, index) => (
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
                        href={item.applyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 underline transition duration-300"
                      >
                        Apply Now
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

export default ApplyTable;
