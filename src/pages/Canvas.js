import React, { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars";
import "./canvas.scss";
let LOIClicks = 0;
let lastClick = [0, 0];
let _lastClick = [0, 0];
let dots = 0;
let finalROI = []; //only to pass it as param in INSIDE function
let activeIndex = -1;
let isUpdate = false;
export default function Canvas() {
  let cnt = 1;
  const [Demo, setDemo] = useState(false);
  const [Rows, setRows] = useState(0);
  const [Type, setType] = useState("ROI");
  const [Columns, setColumns] = useState(0);
  const [Counter, setCounter] = useState(15);
  const [Count, setCount] = useState(20);
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
      if (item.x1 && item.x2 && item.y1 && item.y2) {
        ctx.beginPath();
        ctx.moveTo(item.x1, item.y1);
        ctx.lineTo(item.x2, item.y2, 6);
        ctx.strokeStyle = "#ff2626";
        ctx.stroke();
      }
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
        drawROI([ROICord[dots - 2].x, ROICord[dots - 2].y], [x, y]);
      }
    }
  };

  const handleLOI = (e) => {
    console.log(activeIndex);

    if (ROICord.length === 0) return;
    if (LOICord.length === 0) return;
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    console.log(x, y);
    console.log(LOIClicks);
    if (LOIClicks > 1) return;
    if (!inside([x, y], finalROI)) {
      return;
    }
    if (LOIClicks != 1) {
      LOIClicks++;
      lastClick = [{ x1: x, y1: y }];
      _lastClick = [{ x: x, y: y }];
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
      _lastClick = [..._lastClick, { x: x, y: y }];

      const d = (point) => {
        return Math.pow(point.x, 2) + Math.pow(point.y, 2);
      };
      var closest = _lastClick.slice(1).reduce(
        function (min, p) {
          if (d(p) < min.d) min.point = p;
          return min;
        },
        { point: _lastClick[0], d: d(_lastClick[0]) }
      ).point;

      let newClosest = {
        x1: closest.x,
        y1: closest.y,
      };

      if (newClosest.x1 !== lastClick[0].x1) {
        console.log("SWAP");
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
    activeIndex = LOICord.length;
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
    console.log(activeIndex);
    let arr = [];
    if (ROICord.length === 0) arr.push(true);
    LOICord.map((item) => {
      if (!item.x2) {
        console.log("X2 empty");
        arr.push(true);
      }
      if (!item.label) {
        console.log("Label empty");
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
        x2: LOICord[i].x2,
        y2: LOICord[i].y2,
        label: value,
      };
    }
    body.roi1.loicord = { ...loiObj };

    console.log(loiObj);
    console.log(body);
  };

  const getData = () => {
    // http://localhost:3000/camera/update/d3d3f4cab3ec4ee4a08e64dcebeb9ae0?service=person_tresspassing_detection
    let _data = { ...apiData };
    let ctx = document.getElementById("canvas").getContext("2d");
    const authResult = new URLSearchParams(window.location.search);
    const sType = authResult.get("service");
    let _obj = [
      {
        x: _data[sType].roi1.roicords.x1,
        y: _data[sType].roi1.roicords.y1,
      },
      {
        x: _data[sType].roi1.roicords.x2,
        y: _data[sType].roi1.roicords.y2,
      },
      {
        x: _data[sType].roi1.roicords.x3,
        y: _data[sType].roi1.roicords.y3,
      },
      {
        x: _data[sType].roi1.roicords.x4,
        y: _data[sType].roi1.roicords.y4,
      },
    ];
    dots = 4;
    isUpdate = true;
    setROICord([..._obj]);
    let loiCord = { ..._data[sType].roi1.loicord };
    console.log(loiCord);
    let _loiData = Object.keys(loiCord).map((item) => {
      let obj = { ...loiCord[item] };
      if (obj.label.includes("long")) {
        obj.type = "Longitude";
      } else {
        obj.type = "Latitude";
      }
      obj.label = obj.label.split("-")[1];
      ctx.beginPath();
      ctx.moveTo(obj.x1, obj.y1);
      ctx.lineTo(obj.x2, obj.y2, 6);
      ctx.strokeStyle = "#ff2626";
      ctx.stroke();
      return obj;
    });
    setLOICord([..._loiData]);
  };
  useEffect(() => {
    if (dots === 4) {
      // let ctx = document.getElementById("canvas").getContext("2d");
      // ctx.clearRect(0, 0, 640, 480);
      setType("LOI");
      drawROI([ROICord[0].x, ROICord[0].y], [ROICord[1].x, ROICord[1].y]);
      drawROI([ROICord[1].x, ROICord[1].y], [ROICord[2].x, ROICord[2].y]);
      drawROI([ROICord[2].x, ROICord[2].y], [ROICord[3].x, ROICord[3].y]);
      drawROI([ROICord[3].x, ROICord[3].y], [ROICord[0].x, ROICord[0].y]);
      finalROI.length = 0;
      finalROI.push([ROICord[0].x, ROICord[0].y]);
      finalROI.push([ROICord[1].x, ROICord[1].y]);
      finalROI.push([ROICord[2].x, ROICord[2].y]);
      finalROI.push([ROICord[3].x, ROICord[3].y]);
      if (!isUpdate) {
        activeIndex += 1;
        console.log(isUpdate);

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
    }
  }, [ROICord]);

  useEffect(() => {
    // drawROILOI();
    // setType("LOI");
    // getData();
    // console.log(_ddata);
  }, []);

  return (
    <div>
      <div className="canvas_container">
        {console.log("ROICORD:", ROICord)}
        {console.log("LOICORD:", LOICord)}
        {console.log("COUNT:", Count)}
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
                activeIndex = -1;
                finalROI = [];
                isUpdate = false;
                LOIClicks = 0;
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
                    const value = e.target.value;
                    const regex = /^\d{1,}(\.\d{0,50})?$/;
                    if (value.match(regex) || value === "") {
                      let _data = [...LOICord];
                      _data[idx].label = e.target.value;
                      setLOICord([..._data]);
                    }
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
                    // activeIndex -= 1;
                    let _data = [...LOICord];
                    _data.splice(idx, 1);
                    setLOICord([..._data]);
                    redrawCanvas(ROICord, _data);
                  }}
                >
                  Remove
                </button>
                <button
                  onClick={() => {
                    if (validateLOIData()) {
                      return;
                    }
                    activeIndex = idx;
                    console.log(idx);
                    let _data = [...LOICord];
                    _data[idx] = {
                      ..._data[idx],
                      x1: 0,
                      x2: 0,
                      y1: 0,
                      y2: 0,
                    };
                    LOIClicks = 0;
                    setLOICord([..._data]);
                    redrawCanvas(ROICord, _data);
                  }}
                >
                  Reset
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
      <div style={{ marginTop: "5vw", paddingBottom: "5vw" }}>
        <Scrollbars
          autoHeight
          autoHeightMax="50vh"
          onScrollFrame={(values) => {
            if (values.top === 1) {
              setCount(Count + 15);
            }
          }}
        >
          {dummy.map((item) =>
            item.images.map((items) => {
              if (cnt < Count) {
                cnt += 1;
                return (
                  <img
                    style={{ margin: "0.5vw" }}
                    src={items}
                    width="215px"
                    height="215px"
                  />
                );
              }
              return null;
            })
          )}
        </Scrollbars>
      </div>
    </div>
  );
}

const staticData = {
  roi: [
    { x: 0, y: 4 },
    { x: 634, y: 8 },
    { x: 635, y: 470 },
    { x: 0, y: 480 },
  ],
  loi: [
    // {
    //   x1: 157.75,
    //   y1: 86.75,
    //   x2: 531.75,
    //   y2: 264.75,
    //   type: "Longitude",
    //   label: "a",
    // },
    // {
    //   x1: 526.75,
    //   y1: 55.75,
    //   x2: 176.75,
    //   y2: 303.75,
    //   type: "Longitude",
    //   label: "b",
    // },
    // {
    //   x1: 340.75,
    //   y1: 66.75,
    //   x2: 361.75,
    //   y2: 287.75,
    //   type: "Longitude",
    //   label: "f",
    // },
    // {
    //   x1: 164.75,
    //   y1: 205.75,
    //   x2: 533.75,
    //   y2: 151.75,
    //   type: "Longitude",
    //   label: "s",
    // },
  ],
};

let apiData = {
  safety: {
    roi1: {
      loicord: {
        line1: {
          label: "lat-423",
          x1: 120,
          x2: 539,
          y1: 163,
          y2: 158,
        },
        line2: {
          label: "lat-234",
          x1: 113,
          x2: 538,
          y1: 254,
          y2: 253,
        },
        line3: {
          label: "lat-23412",
          x1: 103,
          x2: 550,
          y1: 333,
          y2: 333,
        },
        line4: {
          label: "lat-23",
          x1: 224,
          x2: 183,
          y1: 78,
          y2: 407,
        },
        line5: {
          label: "lat-42",
          x1: 341,
          x2: 320,
          y1: 77,
          y2: 411,
        },
        line6: {
          label: "lat-123",
          x1: 447,
          x2: 450,
          y1: 77,
          y2: 411,
        },
      },
      roicords: {
        x1: 129,
        x2: 537,
        x3: 560,
        x4: 92,
        y1: 74,
        y2: 76,
        y3: 418,
        y4: 414,
      },
      roiName: "roi1",
    },
  },
};

const dummy = [
  {
    label: "A",
    images: [
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
    ],
  },
  {
    label: "B",
    images: [
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/300×300",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
      "https://source.unsplash.com/random/200×200",
    ],
  },
];
