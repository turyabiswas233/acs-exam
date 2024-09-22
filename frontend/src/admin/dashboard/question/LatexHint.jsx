import React, { useState } from "react";

const LatexHint = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <div className={`w-full `}>
      <button
        type="button"
        className="btn btn-success m-5 "
        onClick={() => setToggle((pre) => !pre)}
      >
        {toggle ? "Hide" : "Show"} Hint
      </button>
      <div hidden={!toggle}>
        <h2 className="text-center underline text-2xl p-2">Latex Guideline</h2>
        <iframe
          className="w-full overflow-hidden rounded-lg"
          src="https://katex.org/docs/support_table"
          height={500}
        ></iframe>
      </div>
    </div>
  );
};
export default LatexHint;
