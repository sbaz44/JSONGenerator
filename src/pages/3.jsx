import React, { useState, useRef, useCallback } from "react";

export default function Canvas3() {
  const canvasRef = useRef(null);
  const [annotations, setAnnotations] = useState([]);
  const [currentAnnotation, setCurrentAnnotation] = useState([]);
  const [selectedAnnotationIndex, setSelectedAnnotationIndex] = useState(null);
  const [draggingPointInfo, setDraggingPointInfo] = useState(null);
  const [isAddingNewAnnotation, setIsAddingNewAnnotation] = useState(false);

  // New state for Line of Interest (LOI)
  const [currentLOI, setCurrentLOI] = useState(null);
  const [isAddingLOI, setIsAddingLOI] = useState(false);

  const isPointInsidePolygon = useCallback((point, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x,
        yi = polygon[i].y;
      const xj = polygon[j].x,
        yj = polygon[j].y;

      const intersect =
        yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

      if (intersect) inside = !inside;
    }
    return inside;
  }, []);

  const handleCanvasClick = useCallback(
    (event) => {
      // If adding new annotation, use addPoint logic
      if (isAddingNewAnnotation) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const newPoints = [...currentAnnotation, { x, y }];
        setCurrentAnnotation(newPoints);

        // If 4 points are complete, save the annotation
        if (newPoints.length === 4) {
          setAnnotations((prev) => [...prev, newPoints]);
          setCurrentAnnotation([]);
          setIsAddingNewAnnotation(false);
          setSelectedAnnotationIndex(null);
        }
      }
      // If adding LOI, handle LOI point selection
      else if (isAddingLOI && selectedAnnotationIndex !== null) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Ensure point is inside the selected annotation
        const selectedAnnotation = annotations[selectedAnnotationIndex];
        if (isPointInsidePolygon({ x, y }, selectedAnnotation)) {
          // If no first point, set first point
          if (!currentLOI) {
            setCurrentLOI({ start: { x, y }, end: null });
          }
          // If first point exists, set second point and finalize LOI
          else {
            const updatedAnnotations = annotations.map((annotation, index) =>
              index === selectedAnnotationIndex
                ? {
                    ...annotation,
                    loi: {
                      start: currentLOI.start,
                      end: { x, y },
                    },
                  }
                : annotation
            );
            setAnnotations(updatedAnnotations);
            setCurrentLOI(null);
            setIsAddingLOI(false);
          }
        }
      }
      // If not adding new annotation or LOI, try to select an annotation
      else {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Find the first annotation that contains the point
        const selectedIndex = annotations.findIndex((annotation) =>
          isPointInsidePolygon({ x, y }, annotation)
        );

        // If an annotation is found, select it and reset LOI
        if (selectedIndex !== -1) {
          setSelectedAnnotationIndex(selectedIndex);
          // Reset LOI when reshaping annotation
          const updatedAnnotations = annotations.map((annotation, index) =>
            index === selectedIndex ? { ...annotation, loi: null } : annotation
          );
          setAnnotations(updatedAnnotations);
        }
      }
    },
    [
      isAddingNewAnnotation,
      currentAnnotation,
      annotations,
      isPointInsidePolygon,
      isAddingLOI,
      selectedAnnotationIndex,
      currentLOI,
    ]
  );

  const handleAddNewAnnotation = () => {
    // Reset everything before starting a new annotation
    setSelectedAnnotationIndex(null);
    setCurrentAnnotation([]);
    setIsAddingNewAnnotation(true);
    setCurrentLOI(null);
  };

  const handleAddLOI = () => {
    // Ensure an annotation is selected before adding LOI
    if (selectedAnnotationIndex !== null) {
      setIsAddingLOI(true);
      setCurrentLOI(null);
    }
  };

  // ... [previous mouse handling methods remain the same]

  const handleClearAll = () => {
    setAnnotations([]);
    setCurrentAnnotation([]);
    setSelectedAnnotationIndex(null);
    setIsAddingNewAnnotation(false);
    setCurrentLOI(null);
    setIsAddingLOI(false);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#676767",
        gap: "20px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "640px",
          height: "360px",
        }}
      >
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          id="canvas"
          onClick={handleCanvasClick}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "white",
            cursor: isAddingNewAnnotation
              ? "crosshair"
              : isAddingLOI
              ? "crosshair"
              : "pointer",
          }}
        />
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "640px",
            height: "360px",
            pointerEvents: "none",
          }}
        >
          {/* Existing SVG rendering logic */}
          {/* ... previous SVG code ... */}

          {/* Render Line of Interest (LOI) */}
          {annotations.map(
            (annotation, annotationIndex) =>
              annotation.loi && (
                <line
                  key={`loi-${annotationIndex}`}
                  x1={annotation.loi.start.x}
                  y1={annotation.loi.start.y}
                  x2={annotation.loi.end.x}
                  y2={annotation.loi.end.y}
                  stroke="red"
                  strokeWidth={3}
                  strokeDasharray="5,5"
                />
              )
          )}

          {/* Render current LOI being drawn */}
          {isAddingLOI && currentLOI && currentLOI.start && (
            <line
              x1={currentLOI.start.x}
              y1={currentLOI.start.y}
              x2={currentLOI.start.x}
              y2={currentLOI.start.y}
              stroke="red"
              strokeWidth={3}
              strokeDasharray="5,5"
            />
          )}
        </svg>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleAddNewAnnotation}
          style={{
            padding: "10px 20px",
            backgroundColor: "white",
            border: "1px solid black",
            cursor: isAddingNewAnnotation ? "not-allowed" : "pointer",
            opacity: isAddingNewAnnotation ? 0.5 : 1,
          }}
          disabled={isAddingNewAnnotation}
        >
          Add New Annotation
        </button>
        <button
          onClick={handleAddLOI}
          style={{
            padding: "10px 20px",
            backgroundColor: "white",
            border: "1px solid black",
            cursor:
              selectedAnnotationIndex === null ? "not-allowed" : "pointer",
            opacity: selectedAnnotationIndex === null ? 0.5 : 1,
          }}
          disabled={selectedAnnotationIndex === null}
        >
          Add Line of Interest
        </button>
        <button
          onClick={handleClearAll}
          style={{
            padding: "10px 20px",
            backgroundColor: "white",
            border: "1px solid black",
            cursor: "pointer",
          }}
        >
          Clear All Annotations
        </button>
      </div>
    </div>
  );
}

//3
