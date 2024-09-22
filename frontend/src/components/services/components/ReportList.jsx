import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getReportByUser, fetchAndStoreImage } from "../../../hooks/report";
import { MdCancel } from "react-icons/md";
//main component
export default function ReportList() {
  const [user, loading] = useContext(AuthContext);
  const [datas, setData] = useState([]);
  const [requested, setRequested] = useState(false);
  useEffect(() => {
    async function x() {
      try {
        const response = await getReportByUser(user?.uid);
        const data = await response.json();
        if (data.status === 200) setData(data.data);
        else setData([]);
      } catch (error) {
        console.error(error);
      }
    }

    x();
  }, [user]);

  useEffect(() => {
    if (requested) {
      alert("Report recheck request Successful");
    }
  }, [requested]);

  return (
    <div className="bg-white text-slate-900 rounded-md h-auto min-h-[50vh]">
      <div className="py-10 bg- h-fit">
        <h2 className="text-center text-2xl underline">Report List</h2>

        {user != null ? (
          <div>
            {datas.length == 0 ? (
              <p className="text-center text-3xl font-bold my-10">
                You have no reports
              </p>
            ) : (
              <>
                {datas.map((data, id) => {
                  return (
                    <section
                      key={data?._id}
                      className="p-3 m-2 rounded-md ring bg-zinc-50 text-slate-800 space-y-2"
                    >
                      {id + 1}.
                      <p>
                        <span className="font-bold">Exam ID: </span>
                        {data?.studentInfo?.examId}
                      </p>
                      <p>
                        <span className="font-bold">Exam Categroy: </span>
                        {data?.category}
                      </p>
                      <p>
                        <span className="font-bold">Exam Branch: </span>
                        {data?.studentInfo?.branch}
                      </p>
                      <p>
                        <span className="font-bold">Total Marks: </span>
                        {data?.updatedMark || data?.obtainMark}
                      </p>
                      <p className="text-sm max-w-sm text-yellow-700 font-medium rounded-md bg-yellow-400/40 border border-yellow-400 p-3">
                        your images are hidden. You can see replied images if
                        teacher response it.
                      </p>
                      {data?.requestCount == 2 && (
                        <p className="text-sm max-w-sm text-yellow-700 font-medium rounded-md bg-yellow-400/40 border border-yellow-400 p-3">
                          You may see previously updated info. Come back later.
                          Out teachers will soon update your report.
                        </p>
                      )}
                      <div>
                        {data?.problemList?.length > 0 && (
                          <div className="grid grid-cols-3 my-4 gap-2">
                            {data?.problemList?.map((problem, pi) => {
                              if (Array.isArray(problem?.replyImages))
                                return (
                                  <div className="grid p-2 rounded-md gap-2 shadow-md shadow-slate-500">
                                    <p>Problem: {problem?.questionNo}</p>
                                    <div className="grid grid-cols-3">
                                      {problem?.replyImages?.map((img, i) => {
                                        return (
                                          <ImageCard
                                            key={`${pi}-${i}-image`}
                                            img={img}
                                          />
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                            })}
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-bold">
                          {data?.updatedMark ? "Updated:" : "Pending..."}{" "}
                        </span>
                        {data?.problemList?.length > 0 && (
                          <table className="table">
                            <thead className="bg-slate-800 table-pin-rows text-slate-200 text-center">
                              <tr className="">
                                <th>Problem No</th>
                                <th>Problem Info</th>
                                <th>Changed Mark</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data?.problemList?.map((ele, i) => {
                                return (
                                  <tr
                                    key={i}
                                    className={`text-center ${
                                      i % 2 !== 0 && "bg-slate-300"
                                    }`}
                                  >
                                    <td className="border border-black">
                                      {ele?.questionNo}
                                    </td>
                                    <td className="border border-black">
                                      {ele?.reportMsg}
                                      <div></div>
                                    </td>
                                    <td className="border border-black">
                                      {ele?.changedMark || "--"}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        )}
                      </div>
                      {data?.requestCount == 1 ? (
                        <button
                          className="bg-green-600 text-white w-fit rounded-md px-4 py-2 mt-3"
                          type="button"
                          onClick={async () => {
                            const url = import.meta.env.APP_URL;
                            const reponse = await fetch(
                              `${url}report/request?id=${data?._id}`,
                              {
                                method: "PATCH",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  requestCount: data?.requestCount,
                                }),
                              }
                            );
                            if ((await reponse.json()).status === 200) {
                              setRequested(true);
                            } else {
                              alert("You have reacher request asking limit");
                            }
                          }}
                        >
                          Report again
                        </button>
                      ) : (
                        <p className="bg-green-400/30 border border-green-500 mt-3 rounded-sm p-3 text-green-700 font-medium">
                          Request Limit over
                        </p>
                      )}
                    </section>
                  );
                })}
              </>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            User must login to see the data
          </p>
        )}
      </div>
    </div>
  );
}

const ImageCard = ({ img }) => {
  const [imageBase64, setImg] = useState(null);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const demo = async () => {
      try {
        let image64 = await fetchAndStoreImage(img);
        if (image64) {
          setImg(image64);
          // console.log(image64);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    demo();
  }, [img]);
  return (
    <div>
      <img
        src={imageBase64}
        width={100}
        height={100}
        alt="image"
        onClick={() => setOpen(true)}
      />
      {isOpen && (
        <ImageViewer img64={imageBase64} onClick={() => setOpen(false)} />
      )}
    </div>
  );
};
const ImageViewer = ({ img64, onClick }) => {
  return (
    <div className="fixed top-0 left-0 bg-black/90 w-screen h-screen overflow-y-auto z-40 p-2">
      <button
        className="p-1 rounded-sm bg-white absolute top-32 right-10 z-30"
        type="button"
        onClick={onClick}
      >
        <MdCancel color="red" size={"2em"} />
      </button>
      {/* <div className=""> */}
      {/* image */}
      <img
        className="w-auto p-2 aspect-auto object-fill rounded-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        src={img64}
        width={1000}
        height={1000}
        alt="image"
        onClick={() => setOpen(true)}
      />
      {/* </div> */}
    </div>
  );
};
