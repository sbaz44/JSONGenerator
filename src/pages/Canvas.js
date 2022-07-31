import React, { useEffect, useState } from "react";
let LOIClicks = 0;
let lastClick = [0, 0];
let dots = 0;
let finalROI = []; //only to pass it as param in INSIDE function
export default function Canvas() {
  const [Demo, setDemo] = useState(false);
  const [Rows, setRows] = useState(0);
  const [Type, setType] = useState("ROI");
  const [Columns, setColumns] = useState(0);
  const [ROICord, setROICord] = useState([]);
  const [LOICord, setLOICord] = useState([]);
  const inside = (point, vs) => {
    let x = point[0],
      y = point[1];

    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      let xi = vs[i][0],
        yi = vs[i][1];
      let xj = vs[j][0],
        yj = vs[j][1];

      let intersect =
        yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  };
  const draw = (w = 640, h = 480, step = 50) => {
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.beginPath();
    // for (let x = 0; x <= w; x += step) {
    //   console.log(x, 0);
    //   console.log(x, h);
    //   ctx.moveTo(x, 0);
    //   ctx.lineTo(x, h);
    // }
    for (let i = 0; i < w; i += step) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, h);
      ctx.stroke();
    }
    // set the color of the line
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 1;
    // the stroke will actually paint the current path
    ctx.stroke();
    // for the sake of the example 2nd path
    ctx.beginPath();
    for (let y = 0; y <= h; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    // set the color of the line
    ctx.strokeStyle = "green";
    // just for fun
    ctx.lineWidth = 1;
    // for your original question - you need to stroke only once
    ctx.stroke();
  };

  const drawGrid = (row = 2, column = 3, width = 640, height = 480) => {
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.clearRect(0, 0, width, height);
    let rowPoints = [];
    let columnPoints = [];
    let rowValue = width / row;
    let columnValue = height / column;
    ctx.beginPath();
    for (let i = 1; i < row; i++) {
      rowPoints.push(rowValue * i);
      ctx.moveTo(rowValue * i, 0);
      ctx.lineTo(rowValue * i, height);
    }
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    for (let i = 1; i < column; i++) {
      columnPoints.push(columnValue * i);
      ctx.moveTo(0, columnValue * i);
      ctx.lineTo(width, columnValue * i);
    }
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();
    console.log(rowPoints, columnPoints);
  };
  const drawCoordinates = (x, y) => {
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.fillStyle = "#ff2626"; // Red color
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, Math.PI * 2, true);
    ctx.fill();
  };
  const drawROI = (moveto, lineto) => {
    let c = document.getElementById("canvas");
    let ctx = c.getContext("2d");
    ctx.fillStyle = "red";
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(moveto[0], moveto[1]);
    ctx.lineTo(lineto[0], lineto[1]);
    ctx.stroke();
  };
  const redrawCanvas = (roiData = ROICord, loiData = LOICord) => {
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.clearRect(0, 0, 640, 480);
    // ROICord.map((item, idx) =>
    //   idx === 3
    //     ? drawROI(
    //         [ROICord[idx].x, ROICord[idx].y],
    //         [ROICord[0].x, ROICord[0].y]
    //       )
    //     : drawROI(
    //         [ROICord[idx].x, ROICord[idx].y],
    //         [ROICord[idx + 1].x, ROICord[idx + 1].y]
    //       )
    // );
    roiData.map((item, idx) =>
      idx === 3
        ? drawROI(
            [roiData[idx].x, roiData[idx].y],
            [roiData[0].x, roiData[0].y]
          )
        : drawROI(
            [roiData[idx].x, roiData[idx].y],
            [roiData[idx + 1].x, roiData[idx + 1].y]
          )
    );

    loiData.map((item, idx) => {
      ctx.beginPath();
      ctx.moveTo(item.x1, item.y1);
      ctx.lineTo(item.x2, item.y2, 6);
      ctx.strokeStyle = "#ff2626";
      ctx.stroke();
    });
    setROICord(roiData);
    setLOICord(loiData);
  };
  const handleROI = (e) => {
    let canvas = document.getElementById("canvas");
    if (dots >= 4) {
      alert("All ROI points drawn!");
    } else {
      let rect = canvas.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      dots += 1;
      finalROI.push([x, y]);
      setROICord((oldArray) => [...oldArray, { x, y }]);

      drawCoordinates(x, y);
      if (dots === 4) {
        //check useEffect
      } else if (dots > 1) {
        console.log(dots - 2);
        drawROI([ROICord[dots - 2].x, ROICord[dots - 2].y], [x, y]);
      }
    }
  };

  const handleLOI = (e) => {
    if (ROICord.length === 0) return;
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    console.log(x, y);
    if (!inside([x, y], finalROI)) {
      // alert("draw inside ROI");
      return;
    }
    if (LOIClicks != 1) {
      LOIClicks++;
      lastClick = [{ x1: x, y1: y }];
      drawCoordinates(x, y);
    } else {
      ctx.beginPath();
      ctx.moveTo(lastClick[0].x1, lastClick[0].y1);
      ctx.lineTo(x, y, 6);
      ctx.strokeStyle = "#ff2626";
      ctx.stroke();
      LOIClicks = 0;
      lastClick = [...lastClick, { x2: x, y2: y }];
      setLOICord((oldArray) => [
        ...oldArray,
        {
          x1: lastClick[0].x1,
          y1: lastClick[0].y1,
          x2: lastClick[1].x2,
          y2: lastClick[1].y2,
        },
      ]);
    }
    console.log(lastClick);
  };

  const drawROILOI = () => {
    let _roi = staticData.roi;
    let _loi = staticData.loi;
    dots = 4;
    _roi.map((item) => {
      finalROI.push([item.x, item.y]);
    });
    redrawCanvas(_roi, _loi);
  };

  useEffect(() => {
    if (dots === 4) {
      setType("LOI");
      drawROI([ROICord[2].x, ROICord[2].y], [ROICord[3].x, ROICord[3].y]);
      drawROI([ROICord[3].x, ROICord[3].y], [ROICord[0].x, ROICord[0].y]);
    }
  }, [ROICord]);

  useEffect(() => {
    drawROILOI();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      {console.log(ROICord, LOICord, finalROI)}
      <div>
        <p>canvas</p>
        <p>Type: {Type}</p>
        <canvas
          id="canvas"
          width="640px"
          height="480px"
          style={{ margin: "1vw", background: "gray", alignSelf: "center" }}
          onClick={(e) => {
            if (Type === "ROI") handleROI(e);
            else handleLOI(e);
          }}
        />
      </div>
      <div>
        <div style={{ display: "flex" }}>
          <button disabled={dots === 4} onClick={() => setType("ROI")}>
            ROI
          </button>
          <button onClick={() => setType("LOI")}>LOI</button>

          <button
            onClick={() => {
              let ctx = document.getElementById("canvas").getContext("2d");
              dots = 0;
              setROICord([]);
              setType("ROI");
              ctx.clearRect(0, 0, 640, 480);
            }}
          >
            Clear
          </button>
          <button onClick={() => setType("LOI")}>Add new LOI</button>
        </div>
        {LOICord.map((item, idx) => (
          <div>
            <p>LOI-{idx + 1}</p>
            <button
              onClick={() => {
                let _data = [...LOICord];
                _data.splice(idx, 1);
                setLOICord([..._data]);
                redrawCanvas(ROICord, _data);
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      {/* <input
        type={"text"}
        onChange={(e) => setRows(e.target.value)}
        value={Rows}
      />
      <input
        type={"text"}
        onChange={(e) => setColumns(e.target.value)}
        value={Columns}
      /> */}
      {/* <button
        onClick={() => {
          drawGrid(Rows, Columns);
        }}
      >
        Submit
      </button> */}
    </div>
  );
}

const staticData = {
  roi: [
    { x: 139.75, y: 74.75 },
    { x: 532.75, y: 51.75 },
    { x: 550.75, y: 274.75 },
    { x: 168.75, y: 312.75 },
  ],
  loi: [
    { x1: 157.75, y1: 86.75, x2: 531.75, y2: 264.75 },
    { x1: 526.75, y1: 55.75, x2: 176.75, y2: 303.75 },
    { x1: 340.75, y1: 66.75, x2: 361.75, y2: 287.75 },
    { x1: 164.75, y1: 205.75, x2: 533.75, y2: 151.75 },
  ],
};
