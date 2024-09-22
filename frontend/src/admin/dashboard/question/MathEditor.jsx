import React from "react";
import Editor from "quill-editor-math";
import "quill-editor-math/dist/index.css";

const MathEditor = ({ value, handleChange }) => {
  return (
    <div>
      <Editor
        placeholder="Type your math equations here!"
        onChange={handleChange}
        
      />

      {/* <div
        className="poppins-regular my-2"
        dangerouslySetInnerHTML={{ __html: value }}
      ></div> */}
    </div>
  );
};

export default MathEditor;
