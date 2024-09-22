import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdDelete, MdPlusOne } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { NavLink } from "react-router-dom";
const API_URL = import.meta.env.APP_URL;

function AdminExamList() {
  const [exams, setExamList] = useState([]);

  const handleFetchExam = () => {
    axios
      .get(API_URL + "sadmin/exam/getAll")
      .then((res) => {
        if (res.data.status) {
          setExamList(res.data.list);
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  useEffect(() => {
    handleFetchExam();
  }, []);
  return (
    <div>
      <hr />
      <div className="grid gap-5 my-4">
        <h3 className="text-3xl text-black text-center">List of Exams</h3>

        {exams.length > 0 ? (
          <div className="text-left overflow-x-auto">
            <header>
              <p className="text-sm grid grid-cols-6 text-center">
                <span className="rounded-md bg-slate-200 mx-2 px-2">Name</span>
                <span className="rounded-md bg-slate-200 mx-2 px-2">Type</span>
                <span className="rounded-md bg-slate-200 mx-2 px-2">
                  Start Time
                </span>
                <span className="rounded-md bg-slate-200 mx-2 px-2">
                  End Time
                </span>
                <span className="rounded-md bg-slate-200 mx-2 px-2">
                  Duration
                </span>
                <span className="rounded-md bg-slate-200 mx-2 px-2">
                  Controller
                </span>
              </p>
            </header>
            <section>
              {exams
                ?.sort((a, b) => {
                  if (a?.starttime > b?.starttime) return -1;
                  else return 1;
                })
                ?.map((exam, eid, arr) => {
                  return (
                    <ExamCard
                      key={"eid+" + eid}
                      exam={exam}
                      list={arr}
                      setData={setExamList}
                    />
                  );
                })}
            </section>
          </div>
        ) : (
          "No Exams found"
        )}
      </div>
    </div>
  );
}

const ExamCard = ({ exam, list, setData }) => {
  const starttime = new Date(exam?.starttime);
  const endtime = new Date(exam?.endtime);
  return (
    <p className="px-4 my-2 rounded-md hover:bg-blue-50 hover:text-slate-900 transition-colors duration-100 ease-out font-thin text-xs grid grid-cols-6 text-center items-center">
      <span className="font-bold px-2">{exam?.examname}</span>
      <span className="px-2">
        <span>{exam?.examclass}</span>
        <span>{exam?.questype}</span>
      </span>

      <span className="px-2">{starttime?.toLocaleString()}</span>
      <span className="px-2">{endtime?.toLocaleString()}</span>
      <span className="px-2">{`${exam?.duration?.hh || 0}h: ${
        exam?.duration?.mm || 0
      }m`}</span>

      <span className="h-full flex items-center flex-wrap gap-2 justify-center py-2 md:scale-100">
        <button className="p-2 rounded-md bg-yellow-500 hover:bg-yellow-400">
          <NavLink
            className={"flex items-center"}
            to={`/swift-admin/a_dashboard/exam/add_q/${exam?._id}`}
          >
            <MdPlusOne size={"1.2em"} />
          </NavLink>
        </button>
        <button className="p-2 rounded-md bg-blue-500 hover:bg-blue-400">
          <NavLink
            className={"flex items-center"}
            to={`/swift-admin/a_dashboard/exam/view/${exam?._id}`}
          >
            <IoMdEye size={"1.2em"} color="white" />
          </NavLink>
        </button>
        <button
          className="p-2 rounded-md bg-red-500 hover:bg-red-400"
          onClick={async () => {
            let willDelete = confirm(
              `Are you sure to delete the exam \`${exam?.examname}\``
            ).valueOf();
            if (willDelete) {
              axios
                .post(API_URL + `sadmin/exam/delete`, {
                  _id: exam?._id,
                })
                .then((res) => {
                  if (res.data.status) {
                    alert(res.data.message);
                    let newList = list?.filter((doc) => doc?._id != exam?._id);
                    setData(newList);
                  }
                })
                .catch((err) => {
                  alert(err.response.data.message);
                  console.log(err);
                });
            }
          }}
        >
          <MdDelete size={"1.2em"} color="white" />
        </button>
      </span>
    </p>
  );
};
export default AdminExamList;
