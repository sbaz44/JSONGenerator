import React, { useEffect, useState } from "react";
let LOIClicks = 0;
let lastClick = [0, 0];
let dots = 0;
let finalROI = [];

//  setshowErrorModal((prevState) => ({
//             ...prevState,
//             showPop: true,
//             msg: "OTP limit exhausted, Please try again later!",
//             type: "alert",
//             header: "Error",
//           }));
export default function Canvas() {
  const [Demo, setDemo] = useState(false);
  const [Rows, setRows] = useState(0);
  const [Type, setType] = useState("ROI");
  const [Columns, setColumns] = useState(0);
  const [ROICord, setROICord] = useState([]);
  const inside = (point, vs) => {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

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
  const handleROI = (e) => {
    let canvas = document.getElementById("canvas");

    console.log("handleROI()");
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
      alert("draw inside ROI");
      return;
    }
    if (LOIClicks != 1) {
      LOIClicks++;
      lastClick = [{ x, y }];
      drawCoordinates(x, y);
      console.log();
    } else {
      ctx.beginPath();
      ctx.moveTo(lastClick[0].x, lastClick[0].y);
      ctx.lineTo(x, y, 6);
      ctx.strokeStyle = "#ff2626";
      ctx.stroke();
      LOIClicks = 0;
      lastClick = [...lastClick, { x1: x, y1: y }];
      console.log(inside([x, y], finalROI));
    }
    // console.log(lastClick);
  };

  useEffect(() => {
    if (dots === 4) {
      drawROI([ROICord[2].x, ROICord[2].y], [ROICord[3].x, ROICord[3].y]);
      drawROI([ROICord[3].x, ROICord[3].y], [ROICord[0].x, ROICord[0].y]);
    }
  }, [ROICord]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {console.log(ROICord, finalROI)}
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
      <button onClick={() => setType("ROI")}>ROI</button>
      <button onClick={() => setType("LOI")}>LOI</button>
      <button
        onClick={() => {
          let ctx = document.getElementById("canvas").getContext("2d");
          dots = 0;
          setROICord([]);
          ctx.clearRect(0, 0, 640, 480);
        }}
      >
        Clear
      </button>
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
