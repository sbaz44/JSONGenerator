import ReactHlsPlayer from "react-hls-player";
import "./magnify.scss";
import React, { useRef, useState, memo } from "react";
import { useEffect } from "react";

export const VideoZoom = ({ zoom }) => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ left: 0, top: 0 });
  const [containerRect, setContainerRect] = useState({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });
  const [isZoomOn, setZoomOn] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const startZoom = () => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      setContainerRect({
        width: containerRect.width,
        height: containerRect.height,
        left: containerRect.left,
        top: containerRect.top,
      });
      setZoomOn(true);
    }
  };

  const setPosition = ({ clientX, clientY }) => {
    setMousePosition({
      left: clientX - containerRect.left,
      top: clientY - containerRect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      className="video-container"
      onMouseMove={(e) => {
        // const element = document.getElementById("parent_player");
        // setCurrentTime(element.currentTime);
        setPosition({
          clientX: e.clientX,
          clientY: e.clientY,
        });
      }}
      onMouseEnter={(e) => {
        const element = document.getElementById("parent_player");
        setCurrentTime(element.currentTime);

        startZoom();
        setPosition({
          clientX: e.clientX,
          clientY: e.clientY,
        });
      }}
      onMouseLeave={() => setZoomOn(false)}
      onTouchMove={(e) => {
        e.preventDefault();
        setPosition({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY - 80,
        });
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        startZoom();
        setPosition({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY - 80,
        });
      }}
      onTouchEnd={() => setZoomOn(false)}
    >
      <Player parent_id={"parent_player"} />
      {isZoomOn && (
        <div
          className="zoom-container"
          style={{
            left: mousePosition.left,
            top: mousePosition.top,
            display: isZoomOn ? "block" : "none",
          }}
        >
          <div
            style={{
              transform: `translate(calc(-${
                mousePosition.left * zoom
              }px + 75px), calc(-${mousePosition.top * zoom}px + 75px))`,
              width: containerRect.width * zoom,
              height: containerRect.height * zoom,
            }}
          >
            <Player
              currentTime={currentTime}
              parent_id={"parent_player"}
              id={"zoom_" + "parent_player"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default function Magnify() {
  return (
    <div>
      <>
        <VideoZoom
          src={
            "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          }
          zoom={1.5}
          width={1000}
          loop
          muted
        />
      </>
    </div>
  );
}

const Player = memo(function Player({
  width,
  style = {},
  height,
  id,
  parent_id,
  currentTime,
}) {
  const zoomRef = useRef(null);

  useEffect(() => {
    if (currentTime && currentTime >= 0) {
      const element = document.getElementById(parent_id);
      zoomRef.current.currentTime = currentTime + 1;
      //   setTimeout(() => {
      //     const element = document.getElementById(parent_id);
      //     const element2 = document.getElementById(id);
      //     console.log(element, element2);
      //   }, 2000);
    }
  }, [currentTime]);

  return (
    <ReactHlsPlayer
      src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
      autoPlay={true}
      controls={false}
      width={width ? width : "100%"}
      height="100%"
      muted
      loop
      style={style}
      id={parent_id ?? id}
      playerRef={zoomRef}
      onLoadedData={(data) => {
        if (id) {
          console.log(data);
          console.log(id, parent_id);
          const element = document.getElementById(parent_id);
          const element2 = document.getElementById(id);
          console.log(element.currentTime);
          console.log(element2);
          zoomRef.current.currentTime = element.currentTime + 0.25;
        }
      }}
      onPlay={() => {
        if (id) {
          console.log(parent_id);
          const element2 = document.getElementById(parent_id);
          console.log(element2.currentTime);
          //   zoomRef.current.currentTime = element2.currentTime;
        }
      }}
    />
  );
});
