import React, { useState, useEffect, useContext } from "react";
import PublicUniversityForm from "./PublicUniversityForm";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function PublicUniversityInfo() {
  const [universities, setUniversities] = useState([]);
  const [eligibleUniversities, setEligibleUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [englishGPA, setEnglishGPA] = useState("");
  const [secondTimerChecked, setSecondTimerChecked] = useState(false);
  const [showList, setShowList] = useState(false);
  const [user] = useContext(AuthContext);

  const [popUp, setPopUp] = useState({
    show: false,
    data: null,
  });
  function handlePopUp(toggleHide, popData) {
    setPopUp({ show: toggleHide, data: popData });
  }
  useEffect(() => {
    const fetchData = async () => {
      if (user == null) return;
      try {
        let url = import.meta.env.APP_URL || "";
        const response = await axios.get(`${url}api/publicuniversity`);
        const data = response.data;
        setUniversities(data);
        setEligibleUniversities(data);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    fetchData();
  }, [user]);

  const handleUniversityClick = (university) => {
    setSelectedUniversity(
      selectedUniversity === university ? null : university
    );
  };

  const categorizedUniversities = (universities) =>
    universities?.reduce((acc, uni) => {
      if (!acc[uni?.category]) {
        acc[uni?.category] = [];
      }
      acc[uni?.category]?.push(uni);
      return acc;
    }, {});

  const categorizedEligibleUniversities =
    categorizedUniversities(eligibleUniversities);

  const categoryOrder = ["Engineering", "University"];

  const filterUniversities = (universities) => {
    return universities.filter((uni) => {
      return !secondTimerChecked || uni.secondTimer;
    });
  };

  const handleEnglishGPAChange = (e) => {
    setEnglishGPA(e.target.value);
  };

  const handleSecondTimerChange = (e) => {
    setSecondTimerChecked(e.target.checked);
  };

  return (
    <div className="py-10 px-5 bg-white rounded-md ">
      <PopUpCard handlePopUp={handlePopUp} popData={popUp} />

      <h1 className="text-3xl font-extrabold mb-8 text-center text-indigo-600">
        Public University List
      </h1>
      {user == null ? (
        <div className="text-center">User must login to see the data</div>
      ) : (
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          <div>
            <PublicUniversityForm
              universities={universities}
              setEligibleUniversities={setEligibleUniversities}
              englishGPA={englishGPA}
              secondTimerChecked={secondTimerChecked}
              handleEnglishGPAChange={handleEnglishGPAChange}
              handleSecondTimerChange={handleSecondTimerChange}
              setShowList={setShowList}
            />
          </div>
          <div
            className={`flex-1 pb-5 max-h-screen overflow-y-auto pt-24 px-5 ring rounded-lg sticky top-0`}
          >
            <p className="text-center bg-primary py-4 rounded-lg text-black absolute w-[calc(100%-10pt)] left-1/2 -translate-x-1/2 top-2">
              List of Eligible Universities
            </p>
            {showList ? (
              <div
                className="grid grid-cols-1  
                xl:grid-cols-4 
              gap-4 "
              >
                {Object.entries(categorizedEligibleUniversities).map(
                  ([category, universities]) =>
                    !categoryOrder.includes(category) && (
                      <div
                        key={category}
                        className="space-y-4 px-2 group overflow-y-auto max-h-[500px] relative scrollbar-none"
                      >
                        <h2 className="text-xl font-bold capitalize bg-slate-300 text-slate-900 px-5 py-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white sticky top-0 left-0">
                          {category}
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                          {filterUniversities(universities).map(
                            (uni, index) => (
                              <div
                                key={index}
                                className="border p-4 cursor-pointer rounded-md hover:bg-blue-100/50 transition-colors"
                                onClick={() => {
                                  // handleUniversityClick(uni)
                                  handlePopUp(true, {
                                    university: uni?.university,
                                    info: uni?.description,
                                  });
                                }}
                              >
                                <p className="text-base text-blue-500 font-semibold">
                                  {"➡️"} {uni.university}
                                </p>
                                {selectedUniversity === uni && (
                                  <div className="mt-2">
                                    <p>{uni.description}</p>
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )
                )}
              </div>
            ) : (
              <div className="bg-blue-100 ring ring-blue-700 text-black font-semibold mx-10 mb-10 p-10 rounded-md shadow-lg shadow-slate-500 place-self-center text-center">
                Fillup the form and click on{" "}
                <span className="text-blue-500">Search</span> button to show
                eligible university list
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
const PopUpCard = ({ handlePopUp, popData }) => {
  return (
    <div
      className={`transition-all fixed left-0 top-0 w-screen h-screen bg-black/20 backdrop-blur-md z-50 ${
        !popData?.show && "hidden"
      } flex justify-center items-center`}
    >
      <div className="card px-5 pt-2 bg-white text-slate-900 w-fit text-wrap max-w-xl">
        <button
          className="btn btn-primary border-none bg-rose-500 hover:bg-rose-600 text-white w-fit"
          onClick={() => {
            handlePopUp(false, null);
          }}
        >
          close
        </button>
        <p className="card-title py-4 text-blue-500">
          {popData?.data?.university}
        </p>
        <hr className="border-blue-400 " />
        <p className="card-body">{popData?.data?.info}</p>
      </div>
    </div>
  );
};
export default PublicUniversityInfo;
