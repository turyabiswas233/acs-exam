import React from "react";
function comment(score) {
  if (score < 40) {
    return "খুবই খারাপ 👎";
  } else if (score < 50) {
    return "খারাপ 😔";
  }
  if (score < 60) {
    return "মোটামুটি 😐";
  }
  if (score < 70) {
    return "ভালো 🙂";
  }
  if (score < 80) {
    return "অনেক ভালো 😉";
  } else {
    return "🥰অসাধারণ! এগিয়ে যাও 🥰";
  }
}
function ScoreBoard({ correct, inCorrect, skip, total }) {
  let score = correct - (inCorrect * 0.25).toFixed(2);
  return (
    <div className="bg-sblack grid gap-3 p-5 rounded-lg">
      <h2>স্কোর বোর্ড</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-center">
        <p className="border border-green-400 bg-green-200/20 text-sgreen rounded-md p-2">
          সঠিক:{correct}
        </p>
        <p className="border border-red-400 bg-red-500/20 text-sred rounded-md p-2">
          ভুল:{inCorrect}
        </p>
        <p className="border border-swhite bg-swhite/70 text-swhite rounded-md p-2">
          স্কিপ:{skip}
        </p>
      </div>
      <div className="grid grid-cols-2 items-center text-center gap-2">
        <p className="border border-green-400 bg-green-900/70 text-sgreen rounded-md p-2 h-full">
          মোট: {score}
        </p>
        <p className="border border-green-400 bg-green-900/70 text-sgreen rounded-md p-2">
          মন্তব্য: {comment((score / total) * 100)}
        </p>
      </div>
    </div>
  );
}

export default ScoreBoard;
