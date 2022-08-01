import React, { useEffect, useState } from "react";
import "./canvas.scss";
let LOIClicks = 0;
let lastClick = [0, 0];
let dots = 0;
let finalROI = []; //only to pass it as param in INSIDE function
let activeIndex = -1;
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
    if (LOICord.length === 0) return;
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    console.log(x, y);
    if (LOIClicks > 1) return;
    if (!inside([x, y], finalROI)) {
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
      LOIClicks++;
      // LOIClicks = 0;
      lastClick = [...lastClick, { x2: x, y2: y }];
      if (lastClick[0].x1 > lastClick[1].x2) {
        lastClick[0].x1 = lastClick[0].x1 + lastClick[1].x2;
        lastClick[1].x2 = lastClick[0].x1 - lastClick[1].x2;
        lastClick[0].x1 = lastClick[0].x1 - lastClick[1].x2;

        lastClick[0].y1 = lastClick[0].y1 + lastClick[1].y2;
        lastClick[1].y2 = lastClick[0].y1 - lastClick[1].y2;
        lastClick[0].y1 = lastClick[0].y1 - lastClick[1].y2;
      }
      let _LOICord = [...LOICord];
      _LOICord[activeIndex] = {
        ..._LOICord[activeIndex],
        x1: lastClick[0].x1,
        y1: lastClick[0].y1,
        x2: lastClick[1].x2,
        y2: lastClick[1].y2,
      };
      setLOICord([..._LOICord]);
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

  const addNewLOI = () => {
    if (validateLOIData()) {
      console.log("VALIDATION");
      return;
    }
    activeIndex += 1;
    LOIClicks = 0;
    setLOICord((oldArray) => [
      ...oldArray,
      {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0,
        label: "",
        type: "Latitude",
      },
    ]);
  };

  const validateLOIData = () => {
    let arr = [];
    if (ROICord.length === 0) arr.push(true);
    LOICord.map((item) => {
      if (!item.x2) {
        arr.push(true);
      }
      if (!item.label) {
        arr.push(true);
      }
    });
    console.log(arr);
    if (arr.includes(true)) return true;
    return false;
  };
  const postData = () => {
    let _LOICord = [...LOICord];
    let body = {
      roi1: {
        loicord: {},
        roicords: {},
        roiName: "roi1",
      },
    };
    let roiObj = {};
    for (let i = 0; i < ROICord.length; i++) {
      roiObj["x" + [i + 1]] = ROICord[i].x;
      roiObj["y" + [i + 1]] = ROICord[i].y;
    }
    body.roi1.roicords = { ...roiObj };
    let loiObj = {};

    for (let i = 0; i < LOICord.length; i++) {
      let value =
        LOICord[i].type === "Latitude"
          ? "lat-" + LOICord[i].label
          : "long-" + LOICord[i].label;
      loiObj["line" + Number(i + 1)] = {
        x1: LOICord[i].x1,
        y1: LOICord[i].y1,
        x1: LOICord[i].x1,
        y2: LOICord[i].y2,
        label: value,
      };
    }
    body.roi1.loicord = { ...loiObj };

    console.log(loiObj);
    console.log(body);
  };
  useEffect(() => {
    if (dots === 4) {
      setType("LOI");
      drawROI([ROICord[2].x, ROICord[2].y], [ROICord[3].x, ROICord[3].y]);
      drawROI([ROICord[3].x, ROICord[3].y], [ROICord[0].x, ROICord[0].y]);
      activeIndex += 1;
      setLOICord((oldArray) => [
        ...oldArray,
        {
          x1: 0,
          x2: 0,
          y1: 0,
          y2: 0,
          label: "",
          type: "Latitude",
        },
      ]);
    }
  }, [ROICord]);

  useEffect(() => {
    drawROILOI();
    setType("LOI");
  }, []);

  return (
    <div className="canvas_container">
      {console.log("ROICORD:", ROICord)}
      {console.log("LOICORD:", LOICord)}
      <div className="canvas_">
        <p>canvas</p>
        <p>Type: {Type}</p>
        <canvas
          id="canvas"
          width="640px"
          height="480px"
          style={{ background: "gray", alignSelf: "center" }}
          onClick={(e) => {
            if (Type === "ROI") handleROI(e);
            else handleLOI(e);
          }}
        />
      </div>
      <div className="card_container_wrapper">
        <div className="card_container">
          <button disabled={dots === 4} onClick={() => setType("ROI")}>
            ROI
          </button>
          <button onClick={() => setType("LOI")}>LOI</button>
          <button
            onClick={() => {
              let ctx = document.getElementById("canvas").getContext("2d");
              dots = 0;
              finalROI = [];
              setROICord([]);
              setLOICord([]);
              setType("ROI");
              ctx.clearRect(0, 0, 640, 480);
            }}
          >
            Clear
          </button>
        </div>
        <div className="loi_card">
          {LOICord.map((item, idx) => (
            <div key={"card__" + idx + 12}>
              <p>LOI-{idx + 1}</p>
              <input
                type={"text"}
                placeholder="Label"
                value={item.label}
                onChange={(e) => {
                  // return textarea.value.match(/^\d+(\.\d+)?$/);
                  let _data = [...LOICord];
                  _data[idx].label = e.target.value;
                  setLOICord([..._data]);
                }}
              />
              <select
                onChange={(e) => {
                  let _data = [...LOICord];
                  _data[idx].type = e.target.value;
                  setLOICord([..._data]);
                }}
                value={item.type}
              >
                <option value={"Latitude"}>Latitude</option>
                <option value={"Longitude"}>Longitude</option>
              </select>
              <button
                onClick={() => {
                  activeIndex -= 1;
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
          <button className="add_loi" onClick={addNewLOI}>
            Add New LOI
          </button>
        </div>
      </div>
      <button className="submit_btn" onClick={postData}>
        Submit
      </button>
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
    {
      x1: 157.75,
      y1: 86.75,
      x2: 531.75,
      y2: 264.75,
      type: "Longitude",
      label: "a",
    },
    {
      x1: 526.75,
      y1: 55.75,
      x2: 176.75,
      y2: 303.75,
      type: "Longitude",
      label: "b",
    },
    {
      x1: 340.75,
      y1: 66.75,
      x2: 361.75,
      y2: 287.75,
      type: "Longitude",
      label: "f",
    },
    {
      x1: 164.75,
      y1: 205.75,
      x2: 533.75,
      y2: 151.75,
      type: "Longitude",
      label: "s",
    },
  ],
};
