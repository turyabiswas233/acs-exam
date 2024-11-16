import React, { useState } from "react";
import axios from "axios";
import Input from "../../Input";
const API_URL = import.meta.env.APP_URL;

function AdminExamForm() {
  const [examname, setName] = useState("");
  const [starttime, setStartTime] = useState("");
  const [endtime, setEndTime] = useState("");
  const [duration, setDuration] = useState({ hh: 0, mm: 0 });
  const [questype, setQuesType] = useState("");
  const [examtype, setExamType] = useState("");
  const [studytype, setStudyType] = useState("");
  const exmType = [
    "Du Admission",
    "Engineering",
    "BUET",
    "GST",
    "Medical",
    "Academic",
    "Board",
    "নিবন্ধন ১৯",
  ];
  const handleCreate = (e) => {
    e.preventDefault();
    if (examtype == "" || studytype == "" || questype == "") {
      alert("required EXAMTYPE, QUESTIONTYPE, EXAMCLASS");
      return;
    } else if (new Date(endtime).getTime() <= new Date(starttime).getTime()) {
      alert("Exam end time cannot be past of Exam start time");
      return;
    }
    axios
      .post(API_URL + "sadmin/exam/create", {
        examname,
        starttime,
        endtime,
        examtype,
        questype,
        examclass: studytype,
        duration,
      })
      .then((res) => {
        if (res.data.status) {
          alert(res.data.message);
          window.location.reload();
          setStartTime("");
          setDuration({
            hh: 0,
            mm: 0,
          });
          setName("");
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  return (
    <div className="my-10">
      <h2 className="text-4xl text-center">Create New Examboard</h2>
      {/* upload new exam */}
      <form className="w-fit mx-auto my-10 font-normal" onSubmit={handleCreate}>
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-3">
          <section className="relative ring-2 ring-black max-w-sm flex p-2 rounded-md my-2 bg-slate-200">
            <label
              htmlFor="examName"
              className="absolute px-2 -top-2 left-2 text-xs bg-white"
            >
              Exam Name
            </label>
            <input
              className="bg-slate-200 text-black outline-none border-none flex-1"
              type="text"
              name="examName"
              id="examName"
              placeholder="Add Exam Name"
              required
              value={examname}
              onChange={(e) => setName(e.target.value)}
            />
          </section>
          <section className="flex flex-col gap-2">
            <label
              htmlFor="questype"
              className="text-xs rounded-lg text-slate-500"
            >
              Question Type
            </label>
            <select
              className="select bg-slate-300 text-black"
              value={questype}
              required
              onChange={(e) => {
                setQuesType(e.target.value);
              }}
            >
              <optgroup>
                <option value="" disabled>
                  Choose a type
                </option>
                <option value="mcq">MCQ</option>
                <option value="cq">CQ</option>
              </optgroup>
            </select>
          </section>
          <section className="flex flex-col gap-2">
            <label
              htmlFor="studytype"
              className="text-xs rounded-lg text-slate-500"
            >
              Exam Class
            </label>
            <select
              className="select bg-slate-300 text-black"
              value={studytype}
              required
              onChange={(e) => {
                setStudyType(e.target.value);
              }}
            >
              <optgroup>
                <option value="" disabled>
                  Choose a type
                </option>
                <option value="SSC">SSC</option>
                <option value="HSC">HSC</option>
                <option value="Job Exam">Job Exam</option>
              </optgroup>
            </select>
          </section>
          <section className="flex flex-col gap-2">
            <label
              htmlFor="studytype"
              className="text-xs rounded-lg text-slate-500"
            >
              Exam Type
            </label>
            <select
              className=" select bg-slate-300 text-black"
              onChange={(e) => setExamType(e.target.value)}
              name="examtype"
              required
              value={examtype}
            >
              <optgroup>
                <option value="" disabled>
                  Choose Exam type
                </option>
                {exmType.map((sub, id) => (
                  <option className="uppercase" key={id + "_exm"} value={sub}>
                    {sub}
                  </option>
                ))}
              </optgroup>
            </select>
          </section>
          <section className="relative ring-2 ring-black p-2 rounded-md my-2 bg-slate-200 h-fit">
            <Input
              title={"Exam start time"}
              id={"examStartTime"}
              name={"examStartTime"}
              required
              type={"datetime-local"}
              value={starttime}
              setValue={(e) => setStartTime(e.target.value)}
            />
          </section>
          <section className="relative ring-2 ring-black p-2 rounded-md my-2 bg-slate-200 h-fit">
            <Input
              title={"Exam end time"}
              id={"examEndTime"}
              name={"examEndTime"}
              required
              type={"datetime-local"}
              value={endtime}
              setValue={(e) => setEndTime(e.target.value)}
            />
          </section>
          <section className="relative ring-2 ring-black p-2 rounded-md my-2 bg-slate-200 gap-5 md:col-span-2">
            <label className="absolute px-2 -top-2 left-2 text-xs bg-white">
              Duration
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                title={"Hour"}
                id={"hour"}
                name={"hour"}
                placeholder={"00"}
                required
                type={"number"}
                value={duration.hh}
                setValue={(e) =>
                  setDuration((p) => ({ ...p, hh: e.target.value }))
                }
              />

              <Input
                title={"Minute"}
                id={"minute"}
                name={"minute"}
                placeholder={"00"}
                required
                type={"number"}
                value={duration.mm}
                setValue={(e) =>
                  setDuration((p) => ({ ...p, mm: e.target.value }))
                }
              />
            </div>
          </section>
        </div>
        <button
          type="submit"
          className="btn hover:bg-yellow-400 hover:text-black mt-4"
        >
          Add Exam
        </button>
      </form>
    </div>
  );
}

export default AdminExamForm;
