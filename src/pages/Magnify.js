import ReactHlsPlayer from "react-hls-player";
import "./magnify.scss";
import React, { useRef, useState, memo } from "react";
import { useEffect } from "react";

export default function Magnify() {
  const [ShowMangify, setShowMangify] = useState(false);
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
          ShowMangify={ShowMangify}
        />
      </>
      <button
        onClick={() => {
          setShowMangify(!ShowMangify);
        }}
      >
        Magnify:{JSON.stringify(ShowMangify)}
      </button>
    </div>
  );
}

export const VideoZoom = ({ zoom, ShowMangify }) => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ left: 0, top: 0 });
  const [containerRect, setContainerRect] = useState({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });
  const [isZoomOn, setZoomOn] = useState(false);
  const [currentTime, setCurrentTime] = useState(null);
  const startZoom = () => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      setContainerRect({
        width: containerRect.width,
        height: containerRect.height,
        left: containerRect.left,
        top: containerRect.top,
      });
    }
  };

  const setPosition = ({ clientX, clientY }) => {
    setMousePosition({
      left: clientX - containerRect.left,
      top: clientY - containerRect.top,
    });
  };

  useEffect(() => {
    if (ShowMangify) {
      const element = document.getElementById("parent_player");
      setCurrentTime(element.currentTime);
    } else {
      setCurrentTime(null);
    }
    const handleTimeUpdate = (e) => {
      console.log(e.target.currentTime);
      setCurrentTime(e.target.currentTime);
    };
    // if (ShowMangify) {
    //   element.addEventListener("timeupdate", handleTimeUpdate);
    // } else {
    //   element.removeEventListener("timeupdate", handleTimeUpdate);
    // }

    // return () => {
    //   element.removeEventListener("timeupdate", handleTimeUpdate);
    // };
  }, [ShowMangify]);

  return (
    <div
      ref={containerRef}
      className="video-container"
      onMouseMove={(e) => {
        if (!ShowMangify) return;
        const element = document.getElementById("parent_player");
        // console.log(element.currentTime);
        // setCurrentTime(element.currentTime);
        setPosition({
          clientX: e.clientX,
          clientY: e.clientY,
        });
      }}
      onMouseEnter={(e) => {
        if (!ShowMangify) return;
        if (ShowMangify) {
          document.querySelector(".zoom-container").style.display = "block";
        }
        const element = document.getElementById("parent_player");
        setCurrentTime(element.currentTime);
        startZoom();
        setPosition({
          clientX: e.clientX,
          clientY: e.clientY,
        });
      }}
      onMouseLeave={() => {
        if (ShowMangify) {
          document.querySelector(".zoom-container").style.display = "none";
        }
      }}
      onTouchMove={(e) => {
        if (!ShowMangify) return;
        e.preventDefault();
        setPosition({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY - 80,
        });
      }}
      onTouchStart={(e) => {
        if (!ShowMangify) return;
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
      {ShowMangify && (
        <div
          className="zoom-container"
          style={{
            left: mousePosition.left,
            top: mousePosition.top,
            // display: ShowMangify ? "block" : "none",
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

const Player = memo(function Player({
  width,
  style = {},
  height,
  id,
  parent_id,
  currentTime,
  setCurrentTime,
}) {
  const zoomRef = useRef(null);

  useEffect(() => {
    console.log(currentTime);
    if (currentTime && currentTime >= 0) {
      const element = document.getElementById(parent_id);
      console.log(
        "currentTime",
        currentTime,
        zoomRef.current.currentTime,
        element.currentTime
      );
      console.log(element.currentTime, currentTime);
      zoomRef.current.currentTime = element.currentTime;
    }
  }, [currentTime]);

  return (
    <ReactHlsPlayer
      src="http://192.168.1.63/static_server/live/6253c6f6775f6411359f7883/index.m3u8"
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
          zoomRef.current.currentTime = element.currentTime;
        }
      }}
      onPlay={() => {
        if (id) {
          // console.log(parent_id);
          // const element2 = document.getElementById(parent_id);
          // console.log(currentTime);
          // zoomRef.current.currentTime = element2.currentTime;
        }
      }}
      onWaiting={() => {
        // if (!id) {
        //   const element2 = document.getElementById(parent_id);
        //   setCurrentTime(element2.currentTime);
        // }
        // console.log("onwaiting", parent_id, id);
      }}
      onCanPlay={() => {
        console.log(id, parent_id);
        if (id && parent_id) {
          const element2 = document.getElementById(parent_id);
          console.log(
            "onCanPlay",
            zoomRef.current.currentTime,
            element2.currentTime
          );
          zoomRef.current.currentTime = element2.currentTime;
          // setCurrentTime(element2.currentTime);
        } else {
          // zoomRef.current.currentTime = currentTime;
        }
      }}
    />
  );
});
