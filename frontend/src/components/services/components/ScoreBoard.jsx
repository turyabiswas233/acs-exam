import React from "react";
import { FaRegCircle } from "react-icons/fa6";
function calculateScore(ele) {
  const exam = ele?.examInfo;
  const submitInfo = ele?.submitInfo?.submitData;
  let correct = 0;
  let inCorrect = 0;
  let total = exam?.questionsList?.length;
  const markList = exam?.questionsList?.map((e) => ({
    submitted: submitInfo?.find((f) => f.questionId === e?._id)?.optionsIds,
    answer: e?.options,
  }));

  markList?.forEach((e) => {
    if (e.submitted) {
      let flag = true;
      let d = null;
      e.submitted.forEach((f) => {
        d = e.answer.find((g) => g.id === f);
        if (d)
          if (!d?.isCorrect) {
            flag = false;
          }
        if (!d) {
          flag = false;
          return;
        }
      });
      if (flag) correct++;
      else inCorrect++;
    }
  });

  return { correct, inCorrect, total };
}
function ScoreBoard({ ele }) {
  const { correct, inCorrect, total } = calculateScore(ele);
  console.log(ele);
  return (
    <div className="bg-white rounded-lg shadow-xl shadow-slate-400/30 p-5 space-y-3 my-6">
      <p className="text-blue-600 text-center font-bold text-3xl">Score</p>

      <div className="flex items-center justify-evenly text-black font-bold">
        <div className="p-4 rounded-full ring ring-yellow-500 w-32 h-32 grid grid-cols-1 justify-center items-center">
          <p className="text-center">{correct - inCorrect*0.25}</p>
          <div className="w-3/4 bg-black h-px rounded-full mx-auto"></div>
          <p className="text-center">{total}</p>
        </div>
        <div className="p-4 rounded-full ring ring-yellow-500 w-32 h-32 grid grid-cols-1 justify-center items-center gap-3">
          <p className="text-center">
            {((correct - inCorrect * 0.25) * 100) / total}%
          </p>
        </div>
      </div>

      <div className="text-slate-100 bg-slate-900 rounded-md">
        <div className="grid grid-cols-3 justify-between p-3 ">
          <p className="flex items-center gap-2">
            <FaRegCircle color="#1faa1f" size={20} /> Correct
          </p>
          <p className="text-center">{(correct / total) * 100}%</p>
          <p className="text-right">{correct}</p>
        </div>
        <hr />
        <div className="grid grid-cols-3 justify-between p-3">
          <p className="flex items-center gap-2">
            <FaRegCircle color="#fa1f1f" size={20} /> Wrong
          </p>
          <p className="text-center">{(inCorrect / total) * 100}%</p>
          <p className="text-right">{inCorrect}</p>
        </div>
        <hr />
        <div className="grid grid-cols-3 justify-between p-3">
          <p className="flex items-center gap-2">
            <FaRegCircle color="#ffaf33" size={20} /> Skipped
          </p>
          <p className="text-center">
            {((total - correct - inCorrect) / total) * 100}%
          </p>
          <p className="text-right">{total - (correct + inCorrect)}</p>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <p className="w-fit text-black bg-gray-100 rounded-full px-4 py-2">Note: This score may be updated.</p>
      </div>
    </div>
  );
}

export default ScoreBoard;
