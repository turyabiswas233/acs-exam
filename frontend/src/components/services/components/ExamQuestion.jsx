import { useState } from "react";


function Image({src, setRemoveImg}){
    return (
        <>
         <div className="relative">
            <button
                onClick={setRemoveImg}
                className="btn btn-sm btn-circle btn-ghost text-black absolute right-0 top-0">✕</button>
            <img src={src} width={100} alt=""
                 onClick={()=>document.getElementById('my_modal_3').showModal()}
            ></img>
         </div>
         <dialog id="my_modal_3" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button
                        className="btn p-2 btn-circle btn-ghost text-black bg-red-600 absolute right-0.5 top-0.5"
                    >✕</button>
                </form>
                <img src={src} className="w-full" alt=""></img>
            </div>
          </dialog>
        </>
    );
}


function CqAnswer(){
    
    const dummy = "https://media.istockphoto.com/id/1371256107/photo/the-turquoise-wave-water-background-of-summer-beach-at-the-seashore-and-beach-summer-pattern.jpg?s=612x612&w=is&k=20&c=mMF336_bIfYf0DYcH-JmZDJtMOJhAnDrbCqDTq-MbKA=";
    const [uploadedImages, setUploadedImages] = useState([]);
    const [isUploaded, setIsUploaded] = useState(false);
    
    // for upload store files, not urls
    const [formData, setFormDAta] = useState({examID: "Saikat", forms: []});


    const handleFileUppload = (e)=>{
        // console.log(e.target.files);
        if(e.target.files.length > 0){
            const files = Array.from(e.target.files);
            const urls = files.map(file => URL.createObjectURL(file) );
            setUploadedImages([...uploadedImages, ...urls]);
            e.target.value = null;
        }
    };
    const handleRemove = (imgSrc)=>{
        setUploadedImages(uploadedImages.filter(img => img !== imgSrc))
    };

    const images = uploadedImages.map( (imgSrc,i) => {
        return ( <Image key={i} src={imgSrc} setRemoveImg={ ()=>{handleRemove(imgSrc)} } /> );
    });

    return (
        <div className="flex flex-col gap-1 pl-1">
            <div className="flex flex-wrap items-center gap-1">
                {images}
                { uploadedImages.length>0 &&
                    <input onClick={()=>{
                        // api answer upload call
                        setIsUploaded(true)
                    }} type="button" className="btn btn-primary" value={isUploaded? 'Update' : 'Submit'}/> }
            </div>
            <input
                type="file" multiple={true}
                className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                onChange={handleFileUppload}
             />
        </div>
    );
}



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
                { question.type == "mcq" && options}
                { question.type == "cq" && <CqAnswer/> }
                { question.type == "mcq" && (<div className="card-actions justify-end">
                    <button className="btn-sm btn btn-primary px-3" disabled={checkedAns.length < 1}>Submit This</button>
                </div>) }
            </div>
        </div>
        
    );
}

export default ExamQuestion;



// cq question should have optional subquestions like a,b,c
// i will render the upload image boxes according to the question.
