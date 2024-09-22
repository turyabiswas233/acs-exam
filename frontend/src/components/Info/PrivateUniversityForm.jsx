import React, { useState } from "react";

const PrivateUniversityForm = ({
  universitiesData,
  setEligibleUniversities,
}) => {
  const [sscGPA, setSscGPA] = useState("");
  const [hscGPA, setHscGPA] = useState("");
  const [budget, setBudget] = useState("");
  const [subject, setSubject] = useState("");

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const filteredUniversities = universitiesData.filter((uni) => {
      const meetsSscGPA = parseFloat(uni.sscGPA) <= parseFloat(sscGPA);
      const meetsHscGPA = parseFloat(uni.hscGPA) <= parseFloat(hscGPA);
      const meetsBudget = parseInt(uni.budget) <= parseInt(budget);
      const meetsSubject =
        subject === "all" ? true : uni.subjects.includes(subject);

      return meetsSscGPA && meetsHscGPA && meetsBudget && meetsSubject;
    });

    setEligibleUniversities(filteredUniversities);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-200 rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold">Search Eligible Universities</h1>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="sscGPA"
              className="block text-sm font-medium text-gray-700"
            >
              SSC GPA
            </label>
            <input
              type="number"
              step="0.01"
              id="sscGPA"
              value={sscGPA}
              onChange={handleInputChange(setSscGPA)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="hscGPA"
              className="block text-sm font-medium text-gray-700"
            >
              HSC GPA
            </label>
            <input
              type="number"
              step="0.01"
              id="hscGPA"
              value={hscGPA}
              onChange={handleInputChange(setHscGPA)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="budget"
            className="block text-sm font-medium text-gray-700"
          >
            Budget
          </label>
          <input
            type="number"
            id="budget"
            value={budget}
            onChange={handleInputChange(setBudget)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700"
          >
            Subject
          </label>
          <select
            id="subject"
            value={subject}
            onChange={handleInputChange(setSubject)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <option value="" selected disabled>
              Select a subject
            </option>
            <option value="all">All</option>
            <option value="CSE">CSE</option>
            <option value="EEE">EEE</option>
            <option value="ME">ME</option>
            <option value="SWE">SWE</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default PrivateUniversityForm;
