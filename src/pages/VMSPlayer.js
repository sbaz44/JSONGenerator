import React, { useEffect, useMemo, useState } from "react";
import CryptoJS from "crypto-js";
import { useLocation } from "react-router-dom";
import ReactHlsPlayer from "react-hls-player/dist";

export default function VMSPlayer() {
  const [Data, setData] = useState([]);
  function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }
  let query = useQuery();
  const decrypt = (textToDecrypt) => {
    return JSON.parse(
      CryptoJS.AES.decrypt(textToDecrypt, "my-secret-key@123").toString(
        CryptoJS.enc.Utf8
      )
    );
  };
  useEffect(() => {
    let link = query.get("link");
    let decryptedData = decrypt(link);
    console.log(decryptedData);
    setData([...decryptedData]);
  }, []);

  return (
    <div>
      VMSPlayer
      <div>
        {Data.map((item) => (
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
        ))}
      </div>
    </div>
  );
}
