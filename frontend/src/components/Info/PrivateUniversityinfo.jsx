import React, { useEffect, useState, Suspense, useContext } from "react";
import PrivateUniversityForm from "./PrivateUniversityForm";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function PrivateUniversityInfo() {
  const [eligibleUniversities, setEligibleUniversities] = useState([]);
  const [universitiesData, setUniversitiesData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [user] = useContext(AuthContext);
  useEffect(() => {
    const getPrivateUniversity = async () => {
      try {
        let url = import.meta.env.APP_URL || "";

        const res = await axios.get(`${url}api/privateuniversity`);
        // console.log("Fetched data:", res.data);
        setUniversitiesData(res.data);
        setEligibleUniversities(res.data); // Initialize with full data
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };
    getPrivateUniversity();
  }, [user]);

  return (
    <div className="py-6 px-5 bg-white rounded-md ">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-indigo-600">
        Private University List
      </h1>
      {user == null ? (
        <div className="text-center">User must login to see the data</div>
      ) : (
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          <div className="mb-6">
            <PrivateUniversityForm
              universitiesData={universitiesData}
              setEligibleUniversities={setEligibleUniversities}
            />
          </div>
          <div
            className={`flex-1 pb-5 max-h-screen overflow-y-auto pt-24 px-5 ring rounded-lg sticky top-0`}
          >
            <p className="text-center bg-primary py-4 rounded-lg text-black absolute w-[calc(100%-10pt)] left-1/2 -translate-x-1/2 top-2">
              List of Eligible Universities
            </p>
            {loading ? (
              <div>Loading...</div> // Display loading indicator
            ) : (
              <>
                <div className="bg-blue-100 ring ring-blue-700 text-black font-semibold mx-10 mb-10 p-10 rounded-md shadow-lg shadow-slate-500 place-self-center text-center">
                  Not available right now
                </div>
                <div className="hidden grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {false &&
                    eligibleUniversities.map((uni, index) => (
                      <div key={index} className="p-4 border rounded shadow-md">
                        <h2 className="text-lg font-bold">{uni.university}</h2>
                        <p>SSC GPA: {uni.sscGPA}</p>
                        <p>HSC GPA: {uni.hscGPA}</p>
                        <p>Budget: {uni.budget}</p>
                        <p>Subjects: {uni.subjects.join(", ")}</p>
                        <p>{uni.description}</p>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PrivateUniversityInfo;
