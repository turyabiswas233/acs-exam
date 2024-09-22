import React, { useState } from "react";

const PublicUniversityForm = ({
  universities,
  setEligibleUniversities,
  englishGPA,
  secondTimerChecked,
  handleEnglishGPAChange,
  handleSecondTimerChange,
  setShowList,
}) => {
  const [sscGPA, setSscGPA] = useState("");
  const [hscGPA, setHscGPA] = useState("");
  const [physicsMarks, setPhysicsMarks] = useState("");
  const [chemistryMarks, setChemistryMarks] = useState("");
  const [mathMarks, setMathMarks] = useState("");
  const [biologyMarks, setBiologyMarks] = useState("");

  const handleInputChange = (setter) => (e) => {
    setShowList(false);
    setter(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const filteredUniversities = universities.filter((uni) => {
      return (
        uni.sscGPA <= parseFloat(sscGPA) &&
        uni.hscGPA <= parseFloat(hscGPA) &&
        uni.physicsMarks <= parseInt(physicsMarks) &&
        uni.chemistryMarks <= parseInt(chemistryMarks) &&
        uni.mathMarks <= parseInt(mathMarks) &&
        uni.biologyMarks <= parseInt(biologyMarks) &&
        uni.englishGPA <= parseFloat(englishGPA) &&
        (!secondTimerChecked || uni.secondTimer)
      );
    });
    setShowList(true);
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
              id="sscGPA"
              placeholder="Ex. 5.00"
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
              id="hscGPA"
              placeholder="Ex. 5.00"
              value={hscGPA}
              onChange={handleInputChange(setHscGPA)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="physicsMarks"
              className="block text-sm font-medium text-gray-700"
            >
              Physics Marks
            </label>
            <input
              type="number"
              id="physicsMarks"
              placeholder="HSC physics (in 200)"
              value={physicsMarks}
              onChange={handleInputChange(setPhysicsMarks)}
              className="w-full px-4 py-2 placeholder:text-xs border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="chemistryMarks"
              className="block text-xs font-medium text-gray-700"
            >
              Chemistry Marks
            </label>
            <input
              type="number"
              id="chemistryMarks"
              placeholder="HSC chemistry (in 200)"
              value={chemistryMarks}
              onChange={handleInputChange(setChemistryMarks)}
              className="w-full px-4 py-2 placeholder:text-xs border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="biologyMarks"
              className="block text-sm font-medium text-gray-700"
            >
              Biology Marks
            </label>
            <input
              type="number"
              id="biologyMarks"
              placeholder="HSC biology (in 200)"
              value={biologyMarks}
              onChange={handleInputChange(setBiologyMarks)}
              className="w-full px-4 py-2 placeholder:text-xs border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="mathMarks"
              className="block text-sm font-medium text-gray-700"
            >
              Math Marks
            </label>
            <input
              type="number"
              id="mathMarks"
              placeholder="HSC Math (in 200)"
              value={mathMarks}
              onChange={handleInputChange(setMathMarks)}
              className="w-full px-4 py-2 placeholder:text-xs border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="englishGPA"
              className="block text-sm font-medium text-gray-700"
            >
              English GPA
            </label>
            <input
              type="number"
              id="englishGPA"
              placeholder="Ex. 5.00"
              value={englishGPA}
              onChange={handleEnglishGPAChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="secondTimer"
              checked={secondTimerChecked}
              onChange={handleSecondTimerChange}
              className="mr-2 h-5 w-5 text-gray-500 focus:ring-gray-400 border-gray-300 rounded"
            />
            <label
              htmlFor="secondTimer"
              className="text-sm font-medium text-gray-700"
            >
              Second Timer
            </label>
          </div>
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

export default PublicUniversityForm;
