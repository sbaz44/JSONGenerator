import React, { useState, useMemo, useCallback } from "react";
import ReactHlsPlayer from "react-hls-player";
import { Link, useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";

export default function VMS() {
  const [Selected, setSelected] = useState([]);
  const [Data, setData] = useState([
    "https://assets.afcdn.com/video49/20210722/v_645516.m3u8",
    "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  ]);

  const encrypt = (value) => {
    return CryptoJS.AES.encrypt(value, "my-secret-key@123").toString();
  };
  const renderPlayer = () => {
    console.count("RE");
    return Data.map((item) => (
      <div
        onClick={() => {
          let _selected = [...Selected];
          _selected.push(item);
          console.log(_selected);
          setSelected([..._selected]);
        }}
      >
        <ReactHlsPlayer
          key={item}
          src={item}
          autoPlay={true}
          controls={false}
          width="25%"
          height="auto"
          muted
          loop
        />
      </div>
    ));
  };
  return (
    <div>
      {/* {console.log(Selected)} */}
      {renderPlayer()}
      <button
        onClick={() => {
          console.log(Selected);
          let ciphertext = encrypt(JSON.stringify(Selected));
          window.open(
            "player?link=" + encodeURIComponent(ciphertext),
            "_blank"
          );
        }}
      >
        Open in new tab
      </button>

      {/* <ReactHlsPlayer
        src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
        autoPlay={true}
        controls={false}
        width="25%"
        height="auto"
        muted
        loop
      /> */}
    </div>
  );
}

// http://devimages.apple.com/iphone/samples/bipbop/bipbopall.m3u8
// https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8
