import React, { useState, useRef } from "react";
import "./App.css";

const CanvasWidth = 640;
const CanvasHeight = 360;

function App() {
  const [annotations, setAnnotations] = useState([]);
  const [currentPoints, setCurrentPoints] = useState([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [draggingPointIndex, setDraggingPointIndex] = useState(null);
  const [draggingAnnotationIndex, setDraggingAnnotationIndex] = useState(null);

  const canvasRef = useRef(null);

  const addPoint = (event) => {
    if (currentPoints.length >= 4) return; // Prevent more than 4 points
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setCurrentPoints([...currentPoints, { x, y }]);
  };

  const finalizeAnnotation = () => {
    if (currentPoints.length !== 4) {
      alert("You must draw exactly 4 points before adding a new annotation!");
      return;
    }
    const newAnnotation = {
      id: Date.now(),
      points: currentPoints,
      color: getRandomDarkColor(),
    };
    setAnnotations([...annotations, newAnnotation]);
    setCurrentPoints([]);
    setSelectedAnnotation(newAnnotation.id);
  };

  const getRandomDarkColor = () => `hsl(${Math.random() * 360}, 70%, 30%)`;

  const resetAnnotations = () => {
    setAnnotations([]);
    setCurrentPoints([]);
    setSelectedAnnotation(null);
  };

  const handleMouseDown = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if dragging a point in the current annotation
    const pointIndex = currentPoints.findIndex(
      (point) => Math.abs(point.x - x) < 5 && Math.abs(point.y - y) < 5
    );
    if (pointIndex !== -1) {
      setDraggingPointIndex(pointIndex);
      return; // Avoid other actions when dragging a point
    }

    // Check if dragging a point in an existing annotation
    if (selectedAnnotation !== null) {
      const selectedAnnotationPoints =
        annotations.find((annotation) => annotation.id === selectedAnnotation)
          ?.points || [];
      const annotationPointIndex = selectedAnnotationPoints.findIndex(
        (point) => Math.abs(point.x - x) < 5 && Math.abs(point.y - y) < 5
      );
      if (annotationPointIndex !== -1) {
        setDraggingPointIndex(annotationPointIndex);
        return; // Avoid dragging the annotation
      }
    }

    // Check if clicking inside an annotation for dragging
    const annotationIndex = annotations.findIndex((annotation) =>
      isPointInsidePolygon({ x, y }, annotation.points)
    );
    if (annotationIndex !== -1) {
      setSelectedAnnotation(annotations[annotationIndex].id);
      setDraggingAnnotationIndex(annotationIndex);
    }
  };

  const handleMouseMove = (event) => {
    if (draggingPointIndex !== null) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.min(Math.max(0, event.clientX - rect.left), CanvasWidth); // Ensure x stays within canvas
      const y = Math.min(Math.max(0, event.clientY - rect.top), CanvasHeight); // Ensure y stays within canvas

      const updatedPoints = [...currentPoints];
      updatedPoints[draggingPointIndex] = { x, y };
      setCurrentPoints(updatedPoints);
    }

    if (draggingAnnotationIndex !== null) {
      const rect = canvasRef.current.getBoundingClientRect();
      const dx = event.movementX;
      const dy = event.movementY;

      const updatedAnnotations = [...annotations];
      const updatedPoints = updatedAnnotations[
        draggingAnnotationIndex
      ].points.map((point) => ({
        x: Math.min(Math.max(0, point.x + dx), CanvasWidth),
        y: Math.min(Math.max(0, point.y + dy), CanvasHeight),
      }));

      updatedAnnotations[draggingAnnotationIndex].points = updatedPoints;
      setAnnotations(updatedAnnotations);
    }
  };

  const handleMouseUp = () => {
    setDraggingPointIndex(null);
    setDraggingAnnotationIndex(null);
  };

  const isPointInsidePolygon = (point, polygon) => {
    let isInside = false;
    const { x, y } = point;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x,
        yi = polygon[i].y;
      const xj = polygon[j].x,
        yj = polygon[j].y;
      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) isInside = !isInside;
    }
    return isInside;
  };

  return (
    <div className="App">
      <h1>Annotation Tool</h1>
      <div className="toolbar">
        <button onClick={finalizeAnnotation}>Add New ROI</button>
        <button onClick={resetAnnotations}>Reset</button>
      </div>
      <div
        className="canvas-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          width={CanvasWidth}
          height={CanvasHeight}
          onClick={addPoint}
        />
        {annotations.map((annotation) => (
          <svg
            key={annotation.id}
            className="annotation-svg"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            <polygon
              points={annotation.points
                .map((point) => `${point.x},${point.y}`)
                .join(" ")}
              fill="none" // No fill color
              stroke={selectedAnnotation === annotation.id ? "yellow" : "black"}
              strokeWidth={2}
            />
          </svg>
        ))}
        <svg
          className="annotation-svg"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {currentPoints.map((point, index) => (
            <circle key={index} cx={point.x} cy={point.y} r={5} fill="red" />
          ))}
          {currentPoints.length === 4 && (
            <polygon
              points={currentPoints
                .map((point) => `${point.x},${point.y}`)
                .join(" ")}
              fill="none"
              stroke="red"
              strokeWidth={2}
            />
          )}
        </svg>
      </div>
      <div className="annotations">
        {annotations.map((annotation) => (
          <div
            key={annotation.id}
            className={`annotation-card ${
              selectedAnnotation === annotation.id ? "selected" : ""
            }`}
          >
            <h4>Annotation {annotation.id}</h4>
            <p>Coordinates:</p>
            <ul>
              {annotation.points.map((point, index) => (
                <li key={index}>
                  ({point.x.toFixed(1)}, {point.y.toFixed(1)})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

//1
