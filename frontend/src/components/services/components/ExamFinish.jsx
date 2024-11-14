
function ExamFinish({ onReviewDemand }){
    return (
     <div className="card my-12 mx-auto w-4/5 md:3/5 py-8 px-8 bg-amber-100">
        <p className="mb-4 text-indigo-600 fony-bold text-lg"> You have completed the exam. </p>
        <div className="ml-auto flex flex-row gap-2">
            <button className="btn btn-ghost border-1 border-blue-400"
               onClick={ ()=>{
                window.location = "/"; 
            } } 
            > Go To Home </button>
            <button className="btn btn-primary" 
                onClick={ onReviewDemand }
            > Exam Review </button>
        </div>
     </div>
    );
}

export default ExamFinish;