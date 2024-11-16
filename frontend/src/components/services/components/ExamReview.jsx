import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import { MdCheckCircleOutline, MdClose } from "react-icons/md";

const API_URL = import.meta.env.APP_URL;

function ExamReview({ id }) {
  const [data, setData] = useState({});
  const { user } = useAuth();

  const checkPastExam = async () => {
    const response = await axios.get(
      API_URL + `api/live-exam/checkpastexam/${user?.uid}/${id}`
    );

    if (response.data) {
      setData(response.data);
    } else {
      alert("Could not load your answers.");
    }
    // console.log("Prev sub", response.data);
  };

  useEffect(() => {
    if (user) checkPastExam();
  }, [user]);

  const options_identifier = ["A", "B", "C", "D"];
  const renderOptions = (ops) => {
    return ops.map((op, ind) => {
      <div key={op.id}>
        <span>{options_identifier[ind]}</span>
      </div>;
    });
  };

  const questions = data.examInfo?.questionsList.map((q, ind) => {
    const optionEL = q.options.map((op, ind) => {
      const bgStyle = op.isCorrect
        ? "bg-green-100 rounded-lg ring-2 ring-green-600 my-1"
        : " ";
      return (
        <div key={op.id} className={"flex p-1 " + bgStyle}>
          <span className="text-gray-500 font-bold">
            {options_identifier[ind]}. &nbsp;
          </span>
          <p className="">
            <span dangerouslySetInnerHTML={{ __html: op.text }}></span>
            <span></span>
          </p>
          {data?.submitInfo?.submitData
            ?.find((f) => f?.questionId === q?._id)
            ?.optionsIds?.includes(op.id) && op?.isCorrect ? (
            <MdCheckCircleOutline className="ml-auto font-bold text-lg text-green-600" />
          ) : (
            data?.submitInfo?.submitData
              ?.find((f) => f?.questionId === q?._id)
              ?.optionsIds?.includes(op.id) &&
            !op?.isCorrect && (
              <MdClose className="ml-auto font-bold text-lg text-red-500" />
            )
          )}
        </div>
      );
    });

    return (
      <div
        key={q.id}
        className="mb-3 w-full bg-slate-100 rounded-lg p-3 text-black"
      >
        <p className="flex mb-3">
          {" "}
          {ind + 1}. &nbsp;{" "}
          <span dangerouslySetInnerHTML={{ __html: q.question }}></span>{" "}
          {!data?.submitInfo?.submitData?.find(
            (f) => f?.questionId === q?._id
          ) && (
            <span className="text-gray-900 bg-gray-300 text-xs rounded-full px-3 py-1 h-fit w-fit">
              skipped
            </span>
          )}
        </p>
        <div className="flex flex-col gap-1 mb-2">{optionEL}</div>
        <hr></hr>
        <p className="text-black font-semibold">SOLVE: </p>
        <p className="">
          <span dangerouslySetInnerHTML={{ __html: q.solve }}></span>
        </p>
      </div>
    );
  });
  function formatedDate(time) {
    let date = new Date(time);
    return date.toLocaleString({
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }
  return (
    <div className="p-5 bg-slate-900">
      <p className="text-sm mb-1"> You have taken this exam </p>
      <p className="text-md mb-0">
        Class:{" "}
        <span className="text-white">
          {data?.examInfo?.examclass || "HSC"}{" "}
        </span>
      </p>
      <p className="text-md mb-0">
        Exam :{" "}
        <span className="text-white">
          {data?.examInfo?.examname || "Demo"}{" "}
        </span>
      </p>

      <p className="text-md mb-0">
        Start Time :{" "}
        <span className="text-white">
          {formatedDate(data?.examInfo?.starttime) || "NO time"}{" "}
        </span>
      </p>

      <p className="text-md mb-0">
        End Time :{" "}
        <span className="text-white">
          {formatedDate(data?.examInfo?.endtime) || "NO time"}{" "}
        </span>
      </p>

      <p className="text-md mb-3">
        Duration :{" "}
        <span className="text-white">
          {data?.examInfo?.duration.hh || 0} Hour{" "}
          {data?.examInfo?.duration.mm || 0} Minutes{" "}
        </span>
      </p>

      {questions}

      <button
        className="btn btn-info px-6 mt-3"
        onClick={() => {
          window.location = "\\";
        }}
      >
        {" "}
        Go to Home{" "}
      </button>
    </div>
  );
}

export default ExamReview;
