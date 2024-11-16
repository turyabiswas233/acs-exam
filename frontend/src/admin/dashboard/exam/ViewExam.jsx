import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MdCheckCircle, MdDelete } from "react-icons/md";
import { LuLoader } from "react-icons/lu";
import axios from "axios";
const url = import.meta.env.APP_URL;

function ViewExam() {
  const { examid } = useParams();
  const [data, setData] = useState(null);
  const [load, setLoad] = useState(false);
  async function getData() {
    try {
      setLoad(true);

      const response = await axios.get(`${url}sadmin/exam/${examid}`);
      console.log(response.data);
      if (response.data.status === "success") setData(response.data.data);
      else alert("Failed to load data");
    } catch (error) {
      alert("Failed to load data");
    } finally {
      setLoad(false);
    }
  }
  useEffect(() => {
    getData();
  }, [examid]);

  return (
    <div>
      <h2 className="text-center text-2xl mb-10">View Exam Info</h2>
      <h2>ExamID: {examid}</h2>
      {load ? (
        <LuLoader
          className="mx-auto my-10 text-3xl animate-spin"
          size={"3rem"}
        />
      ) : (
        <>
          <ExamHeader data={data} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <ExamBody queryList={data?.questionsList} />
          </div>
          {data?.questionsList?.length === 0 && (
            <div className="text-center text-2xl">No Questions Found</div>
          )}
        </>
      )}
    </div>
  );
}
const ExamHeader = ({
  data = {
    examname: "",
    starttime: "",
    endtime: "",
    duration: { hh: 0, m: 0 },
    examtype: "",
    questype: "",
    examclass: "",
    questionsList: [],
  },
}) => {
  const startTime = new Date(data?.starttime);
  const endtime = new Date(data?.endtime);
  const { examid } = useParams();
  return (
    <div className="font-normal">
      <p>{data?.examname}</p>
      <p>
        Start Time: {startTime.toDateString()}, {endtime.toLocaleTimeString()}
      </p>
      <p>
        Duration: {data?.duration?.hh}h : {data?.duration?.mm}m
      </p>
      <Link
        className="btn mt-5 bg-green-600 hover:bg-green-500 text-white"
        to={`/swift-admin/a_dashboard/exam/add_q/${examid}`}
      >
        Add Questions
      </Link>
    </div>
  );
};
const ExamBody = ({ queryList = [] }) => {
  const [load,setLoad] = useState(false)
  return queryList.map((q, qid) => {
    const [delId, setDelId] = useState(null);
    if (delId === q?._id) return;
    return (
      <div key={q?._id} className="my-10">
        <section className="flex items-start gap-2">
          <span>{qid + 1}. </span>
          <h2
            className="text-xl"
            dangerouslySetInnerHTML={{ __html: q?.question }}
          ></h2>
          <button
            type="button"
            className="text-red-500 hover:text-red-700"
            disabled={load}
            onClick={async () => {
              const check = window.confirm(
                "Are you sure you want to delete this question?"
              );
              if (check) {
                try {
                  setLoad(true);
                  const res = await axios.delete(
                    `${url}sadmin/exam/delquestion/${q?._id}`,
                    {
                      withCredentials: true,
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "authToken"
                        )}`,
                      },
                    }
                  );
                  if (res.data.status) {
                    setDelId(res.data.deletedId);
                  }
                } catch (error) {
                  console.log(error);
                } finally {
                  setLoad(false);
                }
              }
            }}
          >
          {load ? <LuLoader /> :  <MdDelete size={"1.25rem"} />}
          </button>
        </section>

        <ul className="grid gap-2 my-4">
          {q?.options?.map((op) => (
            <li
              className={`flex items-center font-normal justify-between gap-2 ring-1 ${
                op?.isCorrect
                  ? "bg-green-100 ring-green-300"
                  : "bg-slate-100 ring-slate-300"
              } p-2 rounded-md`}
              key={`${q?._id}--${op?.id}`}
            >
              <section className="flex items-center gap-2">
                <span>{serialKey(op?.id)}.</span>
                <p dangerouslySetInnerHTML={{ __html: op?.text }}></p>
              </section>
              {op?.isCorrect === true ? (
                <MdCheckCircle size={"1.25rem"} color="white" fill="green" />
              ) : null}
            </li>
          ))}
          <li>
            Solve:{" "}
            {q?.solve ? (
              <div
                className="bg-slate-50 ring-1 ring-slate-300 rounded-md px-4 py-2 text-slate-900"
                dangerouslySetInnerHTML={{ __html: q?.solve }}
              ></div>
            ) : (
              "--"
            )}
          </li>
        </ul>
      </div>
    );
  });
};

function serialKey(key) {
  return String.fromCharCode(64 + key);
}
export default ViewExam;
