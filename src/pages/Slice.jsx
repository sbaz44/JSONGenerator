import React, { useRef, useEffect, useState, useMemo } from "react";
// import './style.css';
import delete_icon from "../assets/delete_icon.png";
import restore_icon from "../assets/restore_icon.png";
import snap from "../assets/snap.png";
let timeout = null;
const deleteIconImage = new Image();
const restoreIconImage = new Image();
const snapImage = new Image();
deleteIconImage.src = delete_icon;
restoreIconImage.src = restore_icon;
snapImage.src = snap;
export default function App() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [annotation, setAnnotation] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingLine, setIsDraggingLine] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(-1);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [rows, setRows] = useState(1);
  const [columns, setColumns] = useState(1);
  const [gridLines, setGridLines] = useState({ horizontal: [], vertical: [] });
  const [draggedLine, setDraggedLine] = useState(null);
  const [deletedGrid, setDeletedGrid] = useState([]);
  const [HoverElement, setHoverElement] = useState("");
  const handleSize = 8;
  const lineHandleSize = 10;
  const containerWidth = 640;
  const containerHeight = 360;
  //   console.log(HoverElement);

  useEffect(() => {
    updateGridLines();
  }, [annotation, rows, columns]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const redraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(snapImage, 0, 0, canvas.width, canvas.height);
      // Draw main annotation
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        annotation.x,
        annotation.y,
        annotation.width,
        annotation.height
      );

      // Draw grid lines
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 1;
      gridLines.vertical.forEach((x) => {
        ctx.beginPath();
        ctx.moveTo(x, annotation.y);
        ctx.lineTo(x, annotation.y + annotation.height);
        ctx.stroke();
      });
      gridLines.horizontal.forEach((y) => {
        ctx.beginPath();
        ctx.moveTo(annotation.x, y);
        ctx.lineTo(annotation.x + annotation.width, y);
        ctx.stroke();
      });

      // Draw resize handles
      ctx.fillStyle = "blue";
      drawHandle(ctx, annotation.x, annotation.y);
      drawHandle(ctx, annotation.x + annotation.width, annotation.y);
      drawHandle(ctx, annotation.x, annotation.y + annotation.height);
      drawHandle(
        ctx,
        annotation.x + annotation.width,
        annotation.y + annotation.height
      );

      //draw deleted grid background
      deletedGrid?.map((obj) => {
        // console.log({ obj, annotation });
        ctx.beginPath();
        ctx.moveTo(
          cellCoordinates[obj.index].x1,
          cellCoordinates[obj.index].y1
        );
        ctx.lineTo(
          cellCoordinates[obj.index].x2,
          cellCoordinates[obj.index].y2
        );
        ctx.lineTo(
          cellCoordinates[obj.index].x3,
          cellCoordinates[obj.index].y3
        );
        ctx.lineTo(
          cellCoordinates[obj.index].x4,
          cellCoordinates[obj.index].y4
        );
        ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
        ctx.fill();
        ctx.closePath();
        // ctx.stroke();
      });

      //draw hover element icon
      if (
        HoverElement?.deleted !== null &&
        !isDrawing &&
        !isResizing &&
        !isDragging &&
        !isDraggingLine
      ) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          console.log({ HoverElement });
          console.log({ annotation });
          console.log({ rows });
          console.log({ columns });
          console.log({ gridLines });
          console.log({ deletedGrid });
        }, 500);
        if (HoverElement.deleted === null) {
          //user is hovering outside the annotation
        } else if (HoverElement.deleted === false) {
          // user is hovering on grid which is not delete

          const {
            gridItem: { x3, y1 },
          } = HoverElement;

          //   ctx.drawImage(deleteIconImage, x3 - 24, y1, 24, 24);
        } else if (HoverElement.deleted === true) {
          const {
            gridItem: { x3, y1 },
          } = HoverElement;

          // user is hovering on grid which is deleted
          //   ctx.drawImage(restoreIconImage, x3 - 24, y1, 24, 24);
        }
      }
    };

    redraw();
  }, [annotation, gridLines, deletedGrid, HoverElement]);

  const drawHandle = (ctx, x, y) => {
    ctx.fillRect(
      x - handleSize / 2,
      y - handleSize / 2,
      handleSize,
      handleSize
    );
  };

  const isOverHandle = (x, y) => {
    const handles = [
      { x: annotation.x, y: annotation.y },
      { x: annotation.x + annotation.width, y: annotation.y },
      { x: annotation.x, y: annotation.y + annotation.height },
      {
        x: annotation.x + annotation.width,
        y: annotation.y + annotation.height,
      },
    ];

    for (let i = 0; i < handles.length; i++) {
      if (
        Math.abs(x - handles[i].x) <= handleSize / 2 &&
        Math.abs(y - handles[i].y) <= handleSize / 2
      ) {
        return i;
      }
    }
    return -1;
  };

  const isOverGridLine = (x, y) => {
    for (let i = 0; i < gridLines.vertical.length; i++) {
      if (
        Math.abs(x - gridLines.vertical[i]) <= lineHandleSize / 2 &&
        y >= annotation.y &&
        y <= annotation.y + annotation.height
      ) {
        return { type: "vertical", index: i };
      }
    }
    for (let i = 0; i < gridLines.horizontal.length; i++) {
      if (
        Math.abs(y - gridLines.horizontal[i]) <= lineHandleSize / 2 &&
        x >= annotation.x &&
        x <= annotation.x + annotation.width
      ) {
        return { type: "horizontal", index: i };
      }
    }
    return null;
  };

  const startDrawOrResize = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log("startDrawOrResize");
    const handle = isOverHandle(x, y);
    const lineHandle = isOverGridLine(x, y);
    console.log(HoverElement);
    console.log({ x, y });
    console.log(
      HoverElement?.gridItem?.x3,
      HoverElement?.gridItem?.x3 - 24,
      HoverElement?.gridItem?.y1
    );
    console.log(
      x >= HoverElement?.gridItem?.x3 - 24,
      x <= HoverElement?.gridItem?.x3,
      y >= HoverElement?.gridItem?.y1,
      y <= HoverElement?.gridItem?.y1 + 24
    );
    if (handle !== -1) {
      setIsResizing(true);
      setResizeHandle(handle);
    } else if (lineHandle) {
      setIsDraggingLine(true);
      setDraggedLine(lineHandle);
    } else if (
      HoverElement &&
      x >= HoverElement?.gridItem?.x3 - 24 &&
      x <= HoverElement?.gridItem?.x3 &&
      y >= HoverElement?.gridItem?.y1 &&
      y <= HoverElement?.gridItem?.y1 + 24
    ) {
      console.log("here");

      if (HoverElement?.deleted) {
        //restore grid
        handleRestoreGrid(HoverElement?.gridIndex);
      } else {
        //delete grid
        handleDeleteGrid(HoverElement?.gridIndex);
      }
    } else if (
      x >= annotation.x &&
      x <= annotation.x + annotation.width &&
      y >= annotation.y &&
      y <= annotation.y + annotation.height
    ) {
      setIsDragging(true);
      setDragOffset({ x: x - annotation.x, y: y - annotation.y });
    } else {
      setIsDrawing(true);
      setAnnotation({ x, y, width: 0, height: 0 });
    }
  };

  const drawOrResize = (e) => {
    // if (annotation.width === 0 && annotation.height === 0) return;
    // if (!isDrawing && !isResizing && !isDragging && !isDraggingLine) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDrawing) {
      setAnnotation((prev) => ({
        ...prev,
        width: x - prev.x,
        height: y - prev.y,
      }));
    } else if (isResizing) {
      resizeAnnotation(x, y);
    } else if (isDragging) {
      const newX = Math.max(
        0,
        Math.min(x - dragOffset.x, containerWidth - annotation.width)
      );
      const newY = Math.max(
        0,
        Math.min(y - dragOffset.y, containerHeight - annotation.height)
      );
      setAnnotation((prev) => ({
        ...prev,
        x: newX,
        y: newY,
      }));
    } else if (isDraggingLine) {
      dragGridLine(x, y);
    }
    if (!isDrawing && !isResizing && !isDragging && !isDraggingLine) {
      const hoverElement = handleGridHover(x, y);
      let { deleted, gridIndex, gridItem } = hoverElement;
      //   console.log({ deleted, gridIndex, gridItem });
      setHoverElement({ ...hoverElement });
    }

    // setHoverElement(hoverElement);
  };

  const stopDrawOrResize = () => {
    if (isDrawing || isResizing || isDragging) {
      normalizeAnnotation();
    }
    // Remove the updateGridLines() call from here
    // setTimeout(() => {
    //   updateGridLines();
    // }, 1000);
    setIsDrawing(false);
    setIsResizing(false);
    setIsDragging(false);
    setIsDraggingLine(false);
    setResizeHandle(-1);
    setDraggedLine(null);
  };

  const resizeAnnotation = (x, y) => {
    setAnnotation((prev) => {
      let newAnnotation = { ...prev };
      switch (resizeHandle) {
        case 0: // Top-left
          newAnnotation.width += newAnnotation.x - x;
          newAnnotation.height += newAnnotation.y - y;
          newAnnotation.x = Math.max(0, x);
          newAnnotation.y = Math.max(0, y);
          break;
        case 1: // Top-right
          newAnnotation.width = Math.min(
            containerWidth - newAnnotation.x,
            x - newAnnotation.x
          );
          newAnnotation.height += newAnnotation.y - y;
          newAnnotation.y = Math.max(0, y);
          break;
        case 2: // Bottom-left
          newAnnotation.width += newAnnotation.x - x;
          newAnnotation.height = Math.min(
            containerHeight - newAnnotation.y,
            y - newAnnotation.y
          );
          newAnnotation.x = Math.max(0, x);
          break;
        case 3: // Bottom-right
          newAnnotation.width = Math.min(
            containerWidth - newAnnotation.x,
            x - newAnnotation.x
          );
          newAnnotation.height = Math.min(
            containerHeight - newAnnotation.y,
            y - newAnnotation.y
          );
          break;
      }
      return newAnnotation;
    });
  };

  const dragGridLine = (x, y) => {
    if (!draggedLine) return;

    setGridLines((prev) => {
      const newLines = { ...prev };
      if (draggedLine.type === "vertical") {
        const minX = annotation.x;
        const maxX = annotation.x + annotation.width;
        newLines.vertical[draggedLine.index] = Math.max(
          minX,
          Math.min(maxX, x)
        );
      } else {
        const minY = annotation.y;
        const maxY = annotation.y + annotation.height;
        newLines.horizontal[draggedLine.index] = Math.max(
          minY,
          Math.min(maxY, y)
        );
      }
      return newLines;
    });
  };

  const normalizeAnnotation = () => {
    setAnnotation((prev) => {
      let newAnnotation = { ...prev };
      if (newAnnotation.width < 0) {
        newAnnotation.x += newAnnotation.width;
        newAnnotation.width = Math.abs(newAnnotation.width);
      }
      if (newAnnotation.height < 0) {
        newAnnotation.y += newAnnotation.height;
        newAnnotation.height = Math.abs(newAnnotation.height);
      }
      newAnnotation.x = Math.max(
        0,
        Math.min(newAnnotation.x, containerWidth - newAnnotation.width)
      );
      newAnnotation.y = Math.max(
        0,
        Math.min(newAnnotation.y, containerHeight - newAnnotation.height)
      );
      return newAnnotation;
    });
  };

  const handleMouseLeave = () => {
    stopDrawOrResize();
  };

  const updateGridLines = () => {
    const horizontalLines = [];
    const verticalLines = [];

    for (let i = 1; i < rows; i++) {
      const y = annotation.y + (annotation.height * i) / rows;
      horizontalLines.push(Math.round(y));
    }

    for (let i = 1; i < columns; i++) {
      const x = annotation.x + (annotation.width * i) / columns;
      verticalLines.push(Math.round(x));
    }

    setGridLines({ horizontal: horizontalLines, vertical: verticalLines });
  };

  const handleGridHover = (x, y) => {
    const gridIndex = cellCoordinates.findIndex(
      (cell) => x >= cell.x1 && x <= cell.x2 && y >= cell.y1 && y <= cell.y3
    );

    if (gridIndex !== -1) {
      let _data = cellCoordinates[gridIndex];
      if (deletedGrid.some((grid) => grid.index === gridIndex)) {
        //   index found in deleted array data
        return { deleted: true, gridIndex, gridItem: _data };
      } else {
        // Render delete icon
        return { deleted: false, gridIndex, gridItem: _data };
      }
    }

    return { deleted: null, gridIndex: null, gridItem: null };
  };

  const handleDeleteGrid = (gridIndex) => {
    setDeletedGrid((prevDeletedGrid) => [
      ...prevDeletedGrid,
      { index: gridIndex, ...cellCoordinates[gridIndex] },
    ]);
  };

  const handleRestoreGrid = (gridIndex) => {
    setDeletedGrid((prevDeletedGrid) =>
      prevDeletedGrid.filter((grid) => grid.index !== gridIndex)
    );
  };

  const cellCoordinates = useMemo(() => {
    const coords = [];
    const xLines = [
      annotation.x,
      ...gridLines.vertical,
      annotation.x + annotation.width,
    ];
    const yLines = [
      annotation.y,
      ...gridLines.horizontal,
      annotation.y + annotation.height,
    ];

    for (let i = 0; i < yLines.length - 1; i++) {
      for (let j = 0; j < xLines.length - 1; j++) {
        coords.push({
          x1: Math.round(xLines[j]),
          y1: Math.round(yLines[i]),
          x2: Math.round(xLines[j + 1]),
          y2: Math.round(yLines[i]),
          x3: Math.round(xLines[j + 1]),
          y3: Math.round(yLines[i + 1]),
          x4: Math.round(xLines[j]),
          y4: Math.round(yLines[i + 1]),
        });
      }
    }

    return coords;
  }, [annotation, gridLines]);

  return (
    <>
      <div>
        <div>
          <label>
            Rows:
            <input
              type="number"
              value={rows}
              onChange={(e) => setRows(Math.max(1, parseInt(e.target.value)))}
              min="1"
            />
          </label>
          <label>
            Columns:
            <input
              type="number"
              value={columns}
              onChange={(e) =>
                setColumns(Math.max(1, parseInt(e.target.value)))
              }
              min="1"
            />
          </label>
        </div>
        <div
          ref={containerRef}
          style={{
            position: "relative",
            width: `${containerWidth}px`,
            height: `${containerHeight}px`,
            border: "1px solid black",
          }}
        >
          <canvas
            ref={canvasRef}
            width={containerWidth}
            height={containerHeight}
            style={
              {
                //   position: "absolute",
                //   top: 0,
                //   left: 0,
                //   backgroundImage: `url(${snap})`,
                //   backgroundSize: "cover",
              }
            }
            onMouseDown={startDrawOrResize}
            onMouseMove={drawOrResize}
            onMouseUp={stopDrawOrResize}
          />
        </div>
        <div>
          <h3>Annotation Coordinates:</h3>
          <p>
            Top-Left: ({Math.round(annotation.x)}, {Math.round(annotation.y)}),
            Top-Right: ({Math.round(annotation.x + annotation.width)},{" "}
            {Math.round(annotation.y)}), Bottom-Left: (
            {Math.round(annotation.x)},{" "}
            {Math.round(annotation.y + annotation.height)}), Bottom-Right: (
            {Math.round(annotation.x + annotation.width)},{" "}
            {Math.round(annotation.y + annotation.height)})
          </p>
          <button
            onClick={() => {
              console.log(
                multiplyCoordinates(
                  {
                    x: 4.05,
                    y: 5.4,
                  },
                  cellCoordinates
                )
              );
            }}
          >
            {" "}
            send data
          </button>{" "}
          <h3>Cell Coordinates:</h3>
          <pre>{JSON.stringify(cellCoordinates, null, 2)}</pre>
        </div>
      </div>
    </>
  );
}

function multiplyCoordinates(point, arrayOfObjects) {
  return arrayOfObjects.map((obj) => ({
    x1: Math.round(point.x * obj.x1),
    y1: Math.round(point.y * obj.y1),
    x2: Math.round(point.x * obj.x2),
    y2: Math.round(point.y * obj.y2),
    x3: Math.round(point.x * obj.x3),
    y3: Math.round(point.y * obj.y3),
    x4: Math.round(point.x * obj.x4),
    y4: Math.round(point.y * obj.y4),
  }));
}

const UndoIcon = (props) => (
  <svg
    fill="#000000"
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    viewBox="0 0 52 52"
    enableBackground="new 0 0 52 52"
    xmlSpace="preserve"
    {...props}
  >
    <path d="M30.3,12.6c10.4,0,18.9,8.4,18.9,18.9s-8.5,18.9-18.9,18.9h-8.2c-0.8,0-1.3-0.6-1.3-1.4v-3.2 c0-0.8,0.6-1.5,1.4-1.5h8.1c7.1,0,12.8-5.7,12.8-12.8s-5.7-12.8-12.8-12.8H16.4c0,0-0.8,0-1.1,0.1c-0.8,0.4-0.6,1,0.1,1.7l4.9,4.9 c0.6,0.6,0.5,1.5-0.1,2.1L18,29.7c-0.6,0.6-1.3,0.6-1.9,0.1l-13-13c-0.5-0.5-0.5-1.3,0-1.8L16,2.1c0.6-0.6,1.6-0.6,2.1,0l2.1,2.1 c0.6,0.6,0.6,1.6,0,2.1l-4.9,4.9c-0.6,0.6-0.6,1.3,0.4,1.3c0.3,0,0.7,0,0.7,0L30.3,12.6z" />
  </svg>
);

const DeleteIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="#000000"
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
      fill="red"
    />
  </svg>
);
