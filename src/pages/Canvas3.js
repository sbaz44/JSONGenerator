import { Memo, Show, useObservable, useObserve } from "@legendapp/state/react";
import React, { useCallback, useRef } from "react";
import "./canvas3.scss";
import { batch } from "@legendapp/state";
const defaultCurrentAnnotation = { roi: [], loi: [] };
export default function Canvas3() {
  const renderCount = ++useRef(0).current;

  const canvasRef = useRef(null);
  const LOIClicks = useRef(0);
  const {
    annotations,
    currentAnnotation,
    draggingPointInfo,
    isAddingNewAnnotation,
    selectedAnnotationIndex,
    isAddingLOI,
    currentLOIIndex,
  } = useObservable({
    annotations: [],
    currentAnnotation: {
      ...defaultCurrentAnnotation,
    },
    draggingPointInfo: null,
    isAddingNewAnnotation: true,
    selectedAnnotationIndex: null,
    isAddingLOI: false,
    currentLOIIndex: -1,
  });

  useObserve(() => {
    console.log(currentAnnotation.get());
    console.log(annotations.get());
    console.log(selectedAnnotationIndex.get());
    console.log(draggingPointInfo.get());
    console.log(currentLOIIndex.get());
  });

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

  function addLOI() {
    isAddingLOI.set(true);
    LOIClicks.current = 0;
  }

  const getArrowCords = (arr) => {
    let xa, xb, ya, yb;
    let midpoint1 = (arr[1].x2 + arr[0].x1) / 2;
    let midpoint2 = (arr[1].y2 + arr[0].y1) / 2;
    let slope = (arr[1].y2 - arr[0].y1) / (arr[1].x2 - arr[0].x1);

    if (arr[1].y2 > arr[0].y1 && arr[0].x1 > arr[1].x2) {
      xa = midpoint1 - Math.sqrt(3200 / (1 + 1 / slope ** 2));
      xb = midpoint1 + Math.sqrt(6400 / (1 + 1 / slope ** 2));
      ya = midpoint2 - (1 / slope) * (xa - midpoint1);
      yb = midpoint2 - (1 / slope) * (xb - midpoint1);
    } else if (arr[1].y2 > arr[0].y1 || arr[0].x1 > arr[1].x2) {
      xa = midpoint1 + Math.sqrt(3200 / (1 + 1 / slope ** 2));
      xb = midpoint1 - Math.sqrt(6400 / (1 + 1 / slope ** 2));
      ya = midpoint2 - (1 / slope) * (xa - midpoint1);
      yb = midpoint2 - (1 / slope) * (xb - midpoint1);
    } else {
      xa = midpoint1 - Math.sqrt(3200 / (1 + 1 / slope ** 2));
      xb = midpoint1 + Math.sqrt(6400 / (1 + 1 / slope ** 2));
      ya = midpoint2 - (1 / slope) * (xa - midpoint1);
      yb = midpoint2 - (1 / slope) * (xb - midpoint1);
    }
    return { xa, xb, ya, yb };
  };

  function getArrowHead({ xa, xb, ya, yb }) {
    var dx = xa - xb;
    var dy = ya - yb;
    var headlen = 20;
    var angle = Math.atan2(dy, dx);
    let res = {};
    if (false) {
      res = {
        point1: {
          x: xb + headlen * Math.cos(angle - Math.PI / 6),
          y: yb + headlen * Math.sin(angle - Math.PI / 6),
        },
        point2: { x: xb, y: yb },
        point3: {
          x: xb + headlen * Math.cos(angle + Math.PI / 6),
          y: yb + headlen * Math.sin(angle + Math.PI / 6),
        },
      };
    } else {
      res = {
        point1: {
          x: xa - headlen * Math.cos(angle - Math.PI / 6),
          y: ya - headlen * Math.sin(angle - Math.PI / 6),
        },
        point2: { x: xa, y: ya },
        point3: {
          x: xa - headlen * Math.cos(angle + Math.PI / 6),
          y: ya - headlen * Math.sin(angle + Math.PI / 6),
        },
      };
    }
    return res;
  }

  const drawArrow = (loiItem) => {
    let arr = [
      { x1: loiItem.start.x, y1: loiItem.start.y },
      { x2: loiItem.end.x, y2: loiItem.end.y },
    ];

    let { xa, xb, ya, yb } = getArrowCords(arr);
    let { point1, point2, point3 } = getArrowHead({ xa, xb, ya, yb });
    return (
      <>
        <line
          x1={loiItem.start.x}
          y1={loiItem.start.y}
          x2={loiItem.end.x}
          y2={loiItem.end.y}
          stroke="green"
          // stroke={
          //   selectedAnnotationIndex.get() === annotationIndex ? "green" : "blue"
          // }
          strokeWidth={2}
        />

        <line
          x1={xa}
          y1={ya}
          x2={xb}
          y2={yb}
          stroke="green"
          // stroke={
          //   selectedAnnotationIndex.get() === annotationIndex ? "green" : "blue"
          // }
          strokeWidth={4}
        />

        <text x={xa} y={ya - 10} fontSize="16">
          A
        </text>

        <text x={xb} y={yb + 10} fontSize="16">
          B
        </text>
        <polygon
          points={`${point1.x},${point1.y} ${point2.x},${point2.y - 5} ${
            point3.x
          },${point3.y}`}
          fill="green"
        />
      </>
    );
  };

  const addPoint = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    //adding new annotation?
    if (isAddingNewAnnotation.get()) {
      if (currentAnnotation.roi.get().length >= 4) return;
      const newPoints = [...currentAnnotation.roi.get(), { x, y }];
      currentAnnotation.roi.set(newPoints);
      // If 4 points are complete, save the annotation
      if (newPoints.length === 4) {
        batch(() => {
          annotations.push({
            ...currentAnnotation.get(),
          });
          // currentAnnotation.set([]);
          isAddingNewAnnotation.set(false);
          selectedAnnotationIndex.set(annotations.get().length - 1);
        });
      }
    }

    //user is adding LOI
    else if (isAddingLOI.get() & (selectedAnnotationIndex.get() !== null)) {
      console.log("user is adding LOI");
      const selectedAnnotation =
        annotations[selectedAnnotationIndex.get()].get();
      if (isPointInsidePolygon({ x, y }, selectedAnnotation.roi)) {
        console.log(annotations[selectedAnnotationIndex.get()].get());
        if (LOIClicks.current === 0) {
          //first LOI click
          annotations[selectedAnnotationIndex.get()].loi.push({
            start: { x, y },
            end: null,
          });
          currentLOIIndex.set(
            annotations[selectedAnnotationIndex.get()].loi.get().length - 1
          );
        }
        if (LOIClicks.current === 1) {
          console.log("second LOI CLICK");
          //second LOI click
          annotations[selectedAnnotationIndex.get()].loi[
            currentLOIIndex.get()
          ].end.set({ x, y });
        }
        LOIClicks.current < 2 && LOIClicks.current++;
      }
    }
    // user is trying to select a annotation
    else {
      // Find the first annotation that contains the point
      const selectedIndex = annotations
        .get()
        .findIndex((annotation) =>
          isPointInsidePolygon({ x, y }, annotation.roi)
        );
      console.log(selectedIndex);
      // If an annotation is found, select it
      if (selectedIndex !== -1) {
        selectedAnnotationIndex.set(selectedIndex);
      }
    }
  };

  const handleMouseDown = useCallback(
    (annotationIndex, pointIndex) => (event) => {
      // Only allow dragging if an annotation is selected and not adding new
      if (selectedAnnotationIndex.get() === null || isAddingNewAnnotation.get())
        return;

      event.preventDefault();
      draggingPointInfo.set({
        annotationIndex,
        pointIndex,
      });
    },
    [selectedAnnotationIndex.get(), isAddingNewAnnotation.get()]
  );

  const handleMouseMove = useCallback(
    (event) => {
      if (!draggingPointInfo.get()) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      annotations[selectedAnnotationIndex.get()].roi.set((prevAnnotations) => {
        return prevAnnotations.map((annotation, annotationIndex) =>
          annotationIndex === draggingPointInfo.pointIndex.get()
            ? { x, y }
            : annotation
        );
      });

      // annotations.set((prevAnnotations) =>
      //   prevAnnotations.map((annotation, annotationIndex) =>
      //     annotationIndex === draggingPointInfo.annotationIndex.get()
      //       ? annotation.map((point, pointIndex) =>
      //           pointIndex === draggingPointInfo.pointIndex.get()
      //             ? { x, y }
      //             : point
      //         )
      //       : annotation
      //   )
      // );
    },
    [draggingPointInfo.get()]
  );

  const handleMouseUp = useCallback(() => {
    draggingPointInfo.set(null);
  }, []);
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#676767",
      }}
    >
      <span>{renderCount}</span>
      <div
        className="canvas-container"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          width={"640px"}
          height={"360px"}
          id="canvas"
          onClick={addPoint}
        />
        <Memo>
          {() => (
            <svg
              className="annotation-svg"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <Show
                if={() =>
                  isAddingNewAnnotation.get() &&
                  currentAnnotation.roi.get().length > 0
                }
              >
                {() => (
                  <>
                    {currentAnnotation.roi.get().map((point, index) => (
                      <circle
                        key={"circle_" + index}
                        cx={point.x}
                        cy={point.y}
                        r={5}
                        fill="red"
                      />
                    ))}
                    {currentAnnotation.roi.get().length > 1 && (
                      <>
                        {currentAnnotation.roi.get().map((point, index) => {
                          if (index === 0) return null;
                          const prevPoint =
                            currentAnnotation.roi[index - 1].get();
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
              </Show>
              {annotations.get().map((annotation, annotationIndex) => (
                <React.Fragment key={`annotation-${annotationIndex}`}>
                  {annotation.roi.map((point, pointIndex) => {
                    console.log({ annotation });
                    if (pointIndex === 0) return null;
                    const prevPoint = annotation.roi[pointIndex - 1];
                    return (
                      <line
                        key={`line-${pointIndex}`}
                        x1={prevPoint.x}
                        y1={prevPoint.y}
                        x2={point.x}
                        y2={point.y}
                        stroke={
                          selectedAnnotationIndex.get() === annotationIndex
                            ? "green"
                            : "blue"
                        }
                        strokeWidth={2}
                      />
                    );
                  })}
                  <line
                    x1={annotation.roi[3].x}
                    y1={annotation.roi[3].y}
                    x2={annotation.roi[0].x}
                    y2={annotation.roi[0].y}
                    stroke={
                      selectedAnnotationIndex.get() === annotationIndex
                        ? "green"
                        : "blue"
                    }
                    strokeWidth={2}
                  />
                  <Show
                    if={() => selectedAnnotationIndex.get() === annotationIndex}
                  >
                    {() => (
                      <>
                        {annotation.roi.map((point, pointIndex) => (
                          <React.Fragment key={`point-${pointIndex}`}>
                            {/* Invisible larger hit area */}
                            <circle
                              cx={point.x}
                              cy={point.y}
                              r={10}
                              fill="transparent"
                              onMouseDown={handleMouseDown(
                                annotationIndex,
                                pointIndex
                              )}
                              style={{
                                cursor: "move",
                                pointerEvents: "auto",
                              }}
                            />
                            {/* Visible point */}
                            <circle
                              cx={point.x}
                              cy={point.y}
                              r={5}
                              fill="green"
                            />
                          </React.Fragment>
                        ))}
                      </>
                    )}
                  </Show>
                  {/* loi's */}
                  {console.log(annotation.loi)}
                  <Show if={() => annotation.loi.length > 0}>
                    {() =>
                      annotation.loi.map((loiItem, loiIndex) => {
                        console.log(loiItem);
                        //render single point
                        if (loiItem.start && !loiItem.end) {
                          return (
                            <circle
                              key={"LOIcircle_" + loiIndex}
                              cx={loiItem.start.x}
                              cy={loiItem.start.y}
                              r={5}
                              fill="red"
                            />
                          );
                        } else {
                          //render arrow
                          // Calculate midpoint for text positioning
                          const midX = (loiItem.start.x + loiItem.end.x) / 2;
                          const midY = (loiItem.start.y + loiItem.end.y) / 2;

                          let arrow = drawArrow(loiItem);
                          return (
                            <>
                              {/* <text
                                x={xa}
                                y={ya - 20}
                                // textAnchor="middle"
                                fontSize="20"
                              >
                                A
                              </text>

                              <text
                                x={xb}
                                y={yb + 30}
                                // textAnchor="middle"
                                fontSize="20"
                              >
                                B
                              </text> */}

                              {arrow}
                            </>
                          );
                        }
                        return null;
                      })
                    }
                  </Show>
                </React.Fragment>
              ))}
            </svg>
          )}
        </Memo>
      </div>
      <button onClick={addLOI}>Add LOI</button>
    </div>
  );
}
