import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  MdCancel,
  MdEdit,
  MdSave,
  MdBrush,
  MdFullscreen,
  MdFullscreenExit,
} from "react-icons/md";
import { LuEraser, LuLoader, LuLoader2, LuUndo2 } from "react-icons/lu";
import { fetchAndStoreImage, getReportList } from "../hooks/report";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../Config/firebase-config";
//main component
export default function ReportList() {
  const [user, isAuthenticated] = useContext(AuthContext);
  const [datas, setData] = useState([]);
  const [load, setLoader] = useState(true);
  const [error, setError] = useState(true);
  const [filterD, setFilter] = useState("Engineering");
  useEffect(() => {
    async function x() {
      try {
        setLoader(true);
        const response = await getReportList(filterD);
        const data = await response.json();
        if (data.status === 200)
          setData(
            data.data?.sort((a, b) => {
              let x, y;
              x = a.createdAt;
              y = b.createdAt;
              if (x < y) return 1;
              else return -1;
            })
          );
        else setData([]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoader(false);
      }
    }
    if (isAuthenticated === 1) {
      x();
      setError(false);
    } else setError(true);
  }, [user, isAuthenticated, filterD]);
  if (error)
    return (
      <div className="ring rounded-lg ring-blue-500 p-10 text-center space-y-6 text-slate-700 animate-pulse">
        <p className="text-2xl">Your email is not authenticated.</p>
        <p>Please go to profile page to verify your email.</p>
      </div>
    );
  if (!user) return <div></div>;
  else
    return (
      <div className="bg-white text-slate-900 rounded-md h-auto min-h-[50vh]">
        <div className="py-10 bg- h-fit">
          <h2 className="text-center text-2xl underline">Report List</h2>

          <div className="w-full my-4 p-4">
            <select
              className="w-full p-4 rounded-md bg-white text-black border-2"
              name="excata"
              value={filterD}
              onChange={(e) => {
                setFilter(e.target.value);
              }}
            >
              <option value="Engineering">Engineering</option>
              <option value="Versity">Versity</option>
            </select>
          </div>

          {user != null ? (
            load ? (
              <LuLoader className="animate-spin mx-auto my-20" size={"2em"} />
            ) : (
              <div>
                {datas.length == 0 ? (
                  "No reports"
                ) : (
                  <>
                    {datas.map((data, id) => {
                      return (
                        <ReplyBox
                          key={`reply-${id}`}
                          data={data}
                          id={id}
                          tID={data?._id}
                          email={user?.email}
                        />
                      );
                    })}
                  </>
                )}
              </div>
            )
          ) : (
            <p className="text-center text-gray-500">
              User must login to see the data
            </p>
          )}
        </div>
      </div>
    );
}
const ReplyBox = ({ data, id, tID, email }) => {
  const [loader, setLoader] = useState(false);
  const [updatedImage, setUpdatedImage] = useState([]);
  const [totalMark, setTolalMark] = useState(0);

  const [changedMark, setChangedMark] = useState([]);
  const sendReply = async (e) => {
    e.preventDefault();

    if (totalMark === data?.updatedMark) {
      alert("It seems student's updated mark is same as previous.");
      return;
    }

    const prompt = confirm("Have you confirmed to update questions mark(s)?");
    if (Boolean(prompt) === true)
      try {
        setLoader(true);
        const replyImages = await uploadImages(updatedImage);

        const url = import.meta.env.APP_URL;
        const replyInfo = await fetch(`${url}report/reply/?id=${tID}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            updatedMark: totalMark,
            reportBy: email,
            problemList: data?.problemList?.map((d, i) => {
              return {
                ...d,
                replyImages:
                  replyImages[i].length > 0
                    ? replyImages[i]
                    : d?.replyImages || [],
                changedMark: changedMark[i],
              };
            }),
          }),
        });
        if ((await replyInfo.json()).ok) {
          alert("Report updated");
          // window.location.reload();
        } else if (!(await replyInfo.json()).ok)
          alert("Report did't not updated");
      } catch (error) {
        console.log(error);
        setLoader(false);
        alert("Reply did't not send");
      } finally {
        setLoader(false);
      }
  };

  useEffect(() => {
    let x = changedMark.reduce((p, c) => p + c, 0);
    if (x == 0) setTolalMark(data?.updatedMark || 0);
    else if (x + data?.obtainMark === data?.updatedMark)
      setTolalMark(data?.updatedMark);
    else setTolalMark(x + data?.obtainMark);
  }, [changedMark]);

  useEffect(() => {
    setChangedMark(
      data?.problemList?.map((m) => (m?.changedMark ? m?.changedMark : 0))
    );
  }, [data]);

  useEffect(() => {
    console.log(updatedImage);
  }, [updatedImage]);

  return (
    <section
      key={data?._id}
      className="p-3 my-2 rounded-md border-2 border-blue-500 bg-zinc-100 text-black w-full space-y-3"
    >
      <div className="leftpart">
        <div>
          {id + 1}.
          <br />
          <p className="w-full px-2 py-1 rounded-md border border-slate-300 text-slate-800 hover:bg-slate-900/20 transition-colors font-normal mb-2">
            Total Marks: {data?.obtainMark}
          </p>
          <div className="w-full px-2 py-1 rounded-md border border-slate-300 text-slate-800 hover:bg-slate-900/20 transition-colors font-normal mb-2">
            <p className="font-bold text-lg">Student Info: </p>
            <p className="px-4">Full Name: {data?.studentInfo?.fullname}</p>
            <p className="px-4">Exam ID: {data?.studentInfo?.examId}</p>
            <p className="px-4">ACS Roll: {data?.studentInfo?.roll}</p>
          </div>
          <div className="w-full px-2 py-1 rounded-md border border-slate-300 text-slate-800 hover:bg-slate-900/20 transition-colors font-normal mb-2">
            <p className="font-bold text-lg">Update Info: </p>
            <p className="px-4">
              Updated Mark:{" "}
              <span className="font-bold">
                {totalMark === data?.updatedMark
                  ? data?.updatedMark || "No update Yet"
                  : `${totalMark} will be set as Update Mark`}
              </span>
            </p>
            <p className="px-4">
              Last Updated At:{" "}
              <span className="font-bold">
                {new Date(data?.updatedAt).toLocaleDateString()} T{" "}
                {new Date(data?.updatedAt).toLocaleTimeString()}
              </span>
            </p>
            <p className="px-4">
              Updated By:{" "}
              <span className="font-bold">
                {data?.reportBy || "No one updated yet"}
              </span>
            </p>
          </div>
        </div>
        <div className="w-full px-2 py-1 rounded-md border border-slate-300 text-slate-800 font-normal mb-2">
          <p>Problem List:</p>
          <div className="md:grid md:grid-cols-3">
            {data?.problemList?.map((pl, pid) => {
              const [cutmark, setcutmark] = useState(
                Number(pl?.changedMark || 0)
              );
              return (
                <div
                  key={`pl_${pid}`}
                  className="mx-4 border rounded-lg mb-4 border-amber-500 p-5 shadow-lg shadow-amber-200 hover:shadow-amber-900 transition-shadow"
                >
                  <header>
                    <p className="font-medium">{pl?.questionNo}.</p>
                    <p>{pl?.reportMsg}</p>
                  </header>

                  <ImageList
                    images={pl?.images}
                    updateImage={setUpdatedImage}
                    qId={pid}
                  />
                  <div className="border border-gray-500 p-2 rounded-md bg-gray-50">
                    <p className="text-sm">Mark to be changed</p>
                    <input
                      className="bg-transparent px-3 py-1 border-2 w-full font-thin text-sm"
                      type="number"
                      max={data?.category === "Versity" ? 2.5 : 10}
                      step={0.25}
                      placeholder={`Mark: 0 - ${
                        data?.category === "Versity" ? 2.5 : 10
                      }`}
                      value={cutmark.toString()}
                      onChange={(e) => setcutmark(e.target.value)}
                    />
                    <button
                      className="bg-green-500 text-black border border-green-900 my-2 w-full"
                      type="button"
                      onClick={() => {
                        setChangedMark((pre) => {
                          let newMark = [...pre];
                          newMark[pid] = Number(cutmark);
                          return newMark;
                        });
                      }}
                    >
                      Change Mark
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="rightPart">
        <button
          className="w-full bg-blue-950 hover:bg-blue-900 transition-colors text-white rounded-md py-3 disabled:text-opacity-50"
          type="submit"
          onClick={sendReply}
          disabled={loader}
        >
          Update Report{" "}
          {loader && (
            <LuLoader2
              className="animate-spin inline-flex ml-2"
              color="white"
              size={"2em"}
            />
          )}
        </button>
      </div>
    </section>
  );
};

const ImageList = ({ images, updateImage, qId }) => {
  const [files, setfiles] = useState(images);

  useEffect(() => {
    updateImage((pre) => {
      const newList = [...pre];
      newList[qId] = files.filter((f) => f.includes("blob:"));
      return newList;
    });
  }, [files]);

  return (
    <div className="grid grid-cols-3 gap-3 mb-5">
      {files?.map((f, img_id) => {
        return (
          <ImageCard
            key={`${img_id}-image-${img_id}`}
            img={f}
            img_id={img_id}
            setFiles={setfiles}
            rootImageList={images}
          />
        );
      })}
    </div>
  );
};

const ImageCard = ({ img, setFiles, img_id, rootImageList }) => {
  const [imageBase64, setImg] = useState(null);
  const [imageId, setId] = useState(null);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    const demo = async () => {
      let image64 = await fetchAndStoreImage(img);
      if (image64) {
        setImg(image64);
      }
    };
    demo();
  }, [img]);

  return (
    <section className="relative w-fit">
      <img
        className="object-fill aspect-square rounded-lg"
        src={img instanceof Blob ? URL.createObjectURL(img) : imageBase64}
        width={500}
        height={500}
        alt="image"
      />
      <button
        className="p-1 bg-yellow-300 rounded-sm absolute top-2 right-2"
        type="button"
        onClick={(e) => {
          setId(img);
          setIndex(img_id);
        }}
      >
        <MdEdit color="#550" />
      </button>
      <ImageEditor
        imageId={imageId}
        index={index}
        setId={setId}
        setFid={setIndex}
        setNewImage={setFiles}
        rootImage={rootImageList[img_id]}
      />
    </section>
  );
};

function ImageEditor({
  imageId,
  index,
  setFid,
  setId,
  setNewImage,
  rootImage,
}) {
  const [drawingContext, setDrawingContext] = useState(null);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [toggleErase, setToggleErase] = useState(false);
  const [editNow, setEditNow] = useState(false);
  const [drawnLines, setDrawnLines] = useState([]);
  const [restorizeImage, setRImage] = useState([]);
  const [restoreId, setrid] = useState(-1);
  const [resize, setResize] = useState(false);
  const [dimention, setDimention] = useState({
    w: 1280,
    h: 720,
  });

  const canvasRef = useRef(null);

  const resetCanvas = (paramImage, w = 1280, h = 720) => {
    setDimention({
      w: w,
      h: h,
    });
    setRImage([]);
    setrid(-1);
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = paramImage;
    image.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, w, w);
      ctx.drawImage(image, 0, 0, w, h);
      setDrawingContext(ctx);
    };
  };

  useEffect(() => {
    resetCanvas(imageId, dimention.w, dimention.h);
  }, [imageId]);

  useEffect(() => {
    if (resize) resetCanvas(imageId, 500, 760);
    else resetCanvas(imageId, 1280, 720);
  }, [resize]);

  // handle resize
  const handleResize = () => {
    setResize((pre) => !pre);
  };

  // handle drawing tool
  const handleDrawing = (event) => {
    if (!drawingContext) return;
    const { clientX, clientY } = event?.touches ? event?.touches[0] : event;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Define prevLines within the function
    const prevLines = drawnLines;

    setDrawnLines((prevLines) => [...prevLines, { x, y }]);

    drawingContext.beginPath();
    drawingContext.moveTo(x, y);

    if (prevLines.length > 0) {
      const lastPoint = prevLines[prevLines.length - 1];
      drawingContext.lineTo(lastPoint.x, lastPoint.y);
    }
    if (editNow) {
      drawingContext.strokeStyle = "#ff4433";
      drawingContext.lineWidth = 3;
      drawingContext.stroke();
    }
  };
  // handle pointer {x,y}
  const handlePointer = (e) => {
    const { clientX, clientY } = e?.touches ? e?.touches[0] : e;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    setDrawnLines((prevLines) => [...prevLines, { x, y }]);
  };
  // handle erase tool
  const handleErasing = () => {
    if (!drawingContext) return;
    resetCanvas(rootImage, dimention.w, dimention.h);
  };

  // handle save tool
  const handleSave = () => {
    function dataURLToBlob(dataURL) {
      const binaryString = window.atob(dataURL.split(",")[1]);
      const arrayBuffer = new ArrayBuffer(binaryString.length);
      const view = new Uint8Array(arrayBuffer);

      for (let i = 0; i < binaryString.length; i++) {
        view[i] = binaryString.charCodeAt(i);
      }

      return new Blob([arrayBuffer], { type: "image/jpeg" });
    }

    const canvas = canvasRef.current;
    const imageURL = canvas.toDataURL("image/jpeg");

    const blob = dataURLToBlob(imageURL);

    const file = new File([blob], `image-${Date.now()}.jpeg`, {
      type: "image/jpeg",
    });

    if (file.type === "image/jpeg")
      setNewImage((pre) => {
        return pre.map((ele, eid) => {
          if (eid === index) return URL.createObjectURL(file);
          return ele;
        });
      });
    setId(null);
    setFid(-1);
  };

  useEffect(() => {
    if (restorizeImage.length == 0) {
      resetCanvas(imageId, dimention.w, dimention.h);
    }
  }, [restoreId]);

  if (index > -1)
    return (
      <div className="fixed top-0 left-0 bg-black/90 w-screen h-screen z-50">
        <div className="rounded-sm ring ring-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain w-fit h-fit">
          <canvas
            className="aspect-auto object-cover w-fit h-auto"
            width={dimention.w}
            height={dimention.h}
            ref={canvasRef}
            // mouse control
            onMouseDown={() => {
              if (toggleEdit) {
                setEditNow(true);
              } else if (toggleErase) {
                setEditNow(false);
              }
            }}
            onMouseMove={(e) => {
              if (toggleEdit) handleDrawing(e);
              // else if (toggleErase) handleBrushEraser(e);
              else handlePointer(e);
            }}
            onMouseUp={() => {
              setEditNow(false);
              const canvas = canvasRef.current;
              const ctx = canvas.getContext("2d");
              if (toggleEdit) {
                setRImage((pre) => [
                  ...pre,
                  ctx?.getImageData(0, 0, canvas.width, canvas.height),
                ]);
                setrid((p) => p + 1);
              }
            }}
            //touch screen
            onTouchStart={() => {
              if (toggleEdit) {
                setEditNow(true);
              } else if (toggleErase) {
                setEditNow(false);
              }
            }}
            onTouchMove={(e) => {
              if (toggleEdit) handleDrawing(e);
              // else if (toggleErase) handleBrushEraser(e);
              else handlePointer(e);
            }}
            onTouchEnd={() => {
              setEditNow(false);
            }}
          />
        </div>

        {/* customize tool */}
        <div className="fixed p-2 right-10 top-1/4 w-fit grid gap-3 justify-center bg-black">
          <button
            className="p-1 rounded-sm bg-white top-20 right-10 z-30"
            type="button"
            onClick={(e) => {
              setId(null);
              setFid(-1);
            }}
          >
            <MdCancel color="red" size={"2em"} />
          </button>
          <button
            className={`p-1 rounded-sm ${
              toggleErase ? "bg-sblack ring-1 ring-rose-500" : "bg-swhite"
            }`}
            title="Erase Brush 10px"
            type="button"
            onClick={() => {
              // setToggleErase(true);
              setToggleEdit(false);
              handleErasing();
            }}
          >
            <LuEraser color="#a3af3f" size={"2em"} />
          </button>
          <button
            className={`p-1 rounded-sm bg-swhite`}
            title="Undo state"
            type="button"
            onClick={async () => {
              try {
                if (restoreId < 0 || restorizeImage.length == 0) {
                  handleErasing();
                } else if (restorizeImage.length > 0) {
                  const ctx = canvasRef.current.getContext("2d");
                  await ctx.putImageData(restorizeImage[restoreId], 0, 0);
                  setDrawingContext(ctx);
                  setRImage((pre) => pre.filter((_, pid) => pid <= restoreId));
                }
              } catch (error) {
                console.log(error);
              } finally {
                setrid((e) => (e - 1 >= 0 ? e - 1 : -1));
              }
            }}
          >
            <LuUndo2 color="#3333cf" size={"2em"} />
          </button>
          <button
            className={`p-1 rounded-sm ${
              toggleEdit ? "bg-sblack ring-1 ring-rose-500" : "bg-swhite"
            }`}
            title="Paint Brush 3px"
            type="button"
            onClick={() => {
              setToggleErase(false);
              setToggleEdit(true);
            }}
          >
            <MdBrush color="#cf5656" size={"2em"} />
          </button>
          <button
            className="p-1 rounded-sm bg-swhite"
            title="Save the edited image"
            type="button"
            onClick={handleResize}
          >
            {resize ? (
              <MdFullscreen color="#33afcf" size={"2em"} />
            ) : (
              <MdFullscreenExit color="#33afcf" size={"2em"} />
            )}
          </button>
          <button
            className="p-1 rounded-sm bg-swhite"
            title="Save the edited image"
            type="button"
            onClick={handleSave}
          >
            <MdSave color="#33afcf" size={"2em"} />
          </button>
        </div>
      </div>
    );
}

const uploadImages = async (filesList) => {
  try {
    const uploadPromisesAll = [];
    for (let i = 0; i < filesList.length; i++) {
      const uploadPromises = [];
      const files = filesList[i];
      for (let j = 0; j < files.length; j++) {
        const file = files[j];

        if (file.startsWith("blob") == false) continue;

        // convert blob URL to data

        const response = await fetch(file, { method: "GET" });
        const blob = await response.blob();

        const storageRef = ref(storage, `images/image-${Date.now()}.jpeg`);
        uploadPromises.push(uploadBytes(storageRef, blob));
      }
      uploadPromisesAll.push(uploadPromises);
    }

    const downloadURLs = await Promise.all(
      uploadPromisesAll.map(async (p) => {
        const promiseList = await Promise.all(
          p.map(async (promise) => {
            const snapshot = await promise;
            return getDownloadURL(snapshot.ref);
          })
        );
        return promiseList;
      })
    );
    return downloadURLs;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw new Error("Failed to upload all images. Try again");
  }
};
