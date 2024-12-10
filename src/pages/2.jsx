import React, { useState, useRef, useCallback } from "react";

export default function Canvas3() {
  const canvasRef = useRef(null);
  const [annotations, setAnnotations] = useState([]);
  const [currentAnnotation, setCurrentAnnotation] = useState([]);
  const [selectedAnnotationIndex, setSelectedAnnotationIndex] = useState(null);
  const [draggingPointInfo, setDraggingPointInfo] = useState(null);
  const [isAddingNewAnnotation, setIsAddingNewAnnotation] = useState(false);

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
      // If not adding new annotation, try to select an annotation
      else {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Find the first annotation that contains the point
        const selectedIndex = annotations.findIndex((annotation) =>
          isPointInsidePolygon({ x, y }, annotation)
        );

        // If an annotation is found, select it
        if (selectedIndex !== -1) {
          setSelectedAnnotationIndex(selectedIndex);
        }
      }
    },
    [
      isAddingNewAnnotation,
      currentAnnotation,
      annotations,
      isPointInsidePolygon,
    ]
  );

  const handleAddNewAnnotation = () => {
    // Reset everything before starting a new annotation
    setSelectedAnnotationIndex(null);
    setCurrentAnnotation([]);
    setIsAddingNewAnnotation(true);
  };

  const handleMouseDown = useCallback(
    (annotationIndex, pointIndex) => (event) => {
      // Only allow dragging if an annotation is selected and not adding new
      if (selectedAnnotationIndex === null || isAddingNewAnnotation) return;

      event.preventDefault();
      setDraggingPointInfo({
        annotationIndex,
        pointIndex,
      });
    },
    [selectedAnnotationIndex, isAddingNewAnnotation]
  );

  const handleMouseMove = useCallback(
    (event) => {
      if (!draggingPointInfo) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setAnnotations((prevAnnotations) =>
        prevAnnotations.map((annotation, annotationIndex) =>
          annotationIndex === draggingPointInfo.annotationIndex
            ? annotation.map((point, pointIndex) =>
                pointIndex === draggingPointInfo.pointIndex ? { x, y } : point
              )
            : annotation
        )
      );
    },
    [draggingPointInfo]
  );

  const handleMouseUp = useCallback(() => {
    setDraggingPointInfo(null);
  }, []);

  // Add global event listeners for mouse move and up
  React.useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleClearAll = () => {
    setAnnotations([]);
    setCurrentAnnotation([]);
    setSelectedAnnotationIndex(null);
    setIsAddingNewAnnotation(false);
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
            cursor: isAddingNewAnnotation ? "crosshair" : "pointer",
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
          {/* Current annotation being drawn */}
          {isAddingNewAnnotation && currentAnnotation.length > 0 && (
            <>
              {currentAnnotation.map((point, index) => (
                <circle
                  key={`current-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r={5}
                  fill="red"
                />
              ))}
              {currentAnnotation.length > 1 && (
                <>
                  {currentAnnotation.map((point, index) => {
                    if (index === 0) return null;
                    const prevPoint = currentAnnotation[index - 1];
                    return (
                      <line
                        key={`current-line-${index}`}
                        x1={prevPoint.x}
                        y1={prevPoint.y}
                        x2={point.x}
                        y2={point.y}
                        stroke="red"
                        strokeWidth={2}
                      />
                    );
                  })}
                </>
              )}
            </>
          )}

          {/* Existing annotations */}
          {annotations.map((annotation, annotationIndex) => (
            <React.Fragment key={`annotation-${annotationIndex}`}>
              {/* Lines connecting points */}
              {annotation.map((point, pointIndex) => {
                if (pointIndex === 0) return null;
                const prevPoint = annotation[pointIndex - 1];
                return (
                  <line
                    key={`line-${pointIndex}`}
                    x1={prevPoint.x}
                    y1={prevPoint.y}
                    x2={point.x}
                    y2={point.y}
                    stroke={
                      selectedAnnotationIndex === annotationIndex
                        ? "green"
                        : "blue"
                    }
                    strokeWidth={2}
                  />
                );
              })}
              {/* Closing line for polygon */}
              <line
                x1={annotation[3].x}
                y1={annotation[3].y}
                x2={annotation[0].x}
                y2={annotation[0].y}
                stroke={
                  selectedAnnotationIndex === annotationIndex ? "green" : "blue"
                }
                strokeWidth={2}
              />

              {/* Draggable points - only show when annotation is selected */}
              {selectedAnnotationIndex === annotationIndex &&
                annotation.map((point, pointIndex) => (
                  <React.Fragment key={`point-${pointIndex}`}>
                    {/* Invisible larger hit area */}
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={10}
                      fill="transparent"
                      onMouseDown={handleMouseDown(annotationIndex, pointIndex)}
                      style={{
                        cursor: "move",
                        pointerEvents: "auto",
                      }}
                    />
                    {/* Visible point */}
                    <circle cx={point.x} cy={point.y} r={5} fill="green" />
                  </React.Fragment>
                ))}
            </React.Fragment>
          ))}
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
//2
