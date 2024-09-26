import { useState } from "react";

function ExamQuestion({
    examID = 10, // needed for submit 
    questionNumber = 1,
    question,
}){

    const [checkedAns, setCheckedAns] = useState([]);

    const options = question.options.map((option, i) =>{
        return (
               <div key={option.id}
                className="flex gap-3 hover:bg-gray-100 p-2"
                onClick={ ()=> {setCheckedAns([...checkedAns, option.id])} }>
                    <input type="checkbox" checked={checkedAns.includes(option.id)} onChange={()=>{}} className="checkbox checkbox-info border-2 border-sky-400" />
                    <p className="text-black" dangerouslySetInnerHTML={{__html: option.text}}/>
                    {/* </div>Yes. I know the answer is {i+1}. </p> */}
                </div>
            );
    });

    return (
        <div className="card bg-amber-50 w-full mt-3 shadow-md">
            <div className="card-body">
                <h2 className="card-title text-black" > {questionNumber}. <span dangerouslySetInnerHTML={{ __html: question.question }} ></span> </h2>
                {options}
                <div className="card-actions justify-end">
                <button className="btn-sm btn btn-primary px-3" disabled={checkedAns.length < 1}>Submit This</button>
                </div>
            </div>
        </div>
        
    );
}

export default ExamQuestion;


// cq question should have subquestions