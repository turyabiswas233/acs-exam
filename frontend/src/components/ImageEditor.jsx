import { useRef, useState, useEffect } from "react";
import { MdCancel, MdOutlineDraw, MdSave } from "react-icons/md";
import { LuEraser } from "react-icons/lu";

export default function ImageEditor({
  imageId,
  index,
  setFid,
  setId,
  setNewImage,
}) {
  if (!imageId) return;

  const [drawingContext, setDrawingContext] = useState(null);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [drawnLines, setDrawnLines] = useState([]);
  const [dimention, setDimention] = useState({
    width: 0,
    height: 0,
  });

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const resetCanvas = () => {
    const image = new Image();
    image.src = URL.createObjectURL(imageId);

    image.onload = () => {
      setDimention({ width: image.width, height: image.height });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      setDrawingContext(ctx);
    };
  };

  useEffect(() => {
    resetCanvas();
  }, [imageId, containerRef]);
  // handle drawing tool
  const handleDrawing = (event) => {
    if (!drawingContext) return;
    if (!toggleEdit) return;

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
    drawingContext.strokeStyle = "#ff4433";
    drawingContext.lineWidth = 2;
    drawingContext.stroke();
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
  const handleErasing = (e) => {
    if (!drawingContext) return;

    resetCanvas();
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
    try {
      const canvas = canvasRef.current;
      const imageURL = canvas.toDataURL("image/jpeg");

      const blob = dataURLToBlob(imageURL);

      const file = new File(
        [blob],
        `${imageId?.name}-${Math.floor(Math.random() * 5000)}`,
        {
          type: "image/jpeg",
        }
      );

      if (file.type === "image/jpeg")
        setNewImage((pre) => {
          return pre.map((ele, eid) => {
            if (eid === index) return file;
            return ele;
          });
        });
      // alert("Image Saved");
    } catch (error) {
      console.log(error);
    } finally {
      setFid(-1);
    }
  };

  if (index !== -1)
    return (
      <div className="fixed top-0 left-0 bg-black/90 w-screen h-screen z-40">
        <button
          className="p-1 rounded-sm bg-white absolute top-32 right-10 z-30"
          type="button"
          onClick={(e) => {
            setId(null);
          }}
        >
          <MdCancel color="red" size={"2em"} />
        </button>
        <div
          className="rounded-sm ring ring-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain w-fit h-fit"
          ref={containerRef}
        >
          <canvas
            className="aspect-auto object-cover w-auto h-auto"
            width={dimention.width > 1000 ? 1000 : dimention.width}
            height={dimention.height > 1000 ? 1000 : dimention.height}
            ref={canvasRef}
            onMouseDown={() => setToggleEdit(true)}
            onMouseMove={(e) => {
              if (toggleEdit) handleDrawing(e);
              else handlePointer(e);
            }}
            onMouseUp={() => setToggleEdit(false)}
            onTouchStart={(e) => {
              handlePointer(e);
              setToggleEdit(true);
            }}
            onTouchMove={(e) => {
              if (toggleEdit) handleDrawing(e);
              else handlePointer(e);
            }}
            onTouchEnd={() => setToggleEdit(false)}
          />

          {/* customize tool */}
          <div className="absolute p-2 left-1/2 -translate-x-1/2 -bottom-20 w-fit flex gap-3 justify-center">
            <button
              hidden
              className="p-1 rounded-sm bg-swhite"
              type="button"
              title="Toggle to draw on the image"
              onClick={(e) => setToggleEdit((p) => !p)}
            >
              <MdOutlineDraw color="#f322dd" size={"2em"} />
            </button>
            <button
              className="p-1 rounded-sm bg-swhite"
              title="Erase all"
              type="button"
              onClick={handleErasing}
            >
              <LuEraser color="#a3af3f" size={"2em"} />
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
      </div>
    );
}
