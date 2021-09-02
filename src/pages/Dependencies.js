import React, { useEffect, useState } from "react";

export default function Dependencies() {
  const [obj, setObj] = useState({
    Base: {},
    Usecase: {
      loitering: [
        {
          serviceId: "612faf2ffbad2434de32aa95",
          versions: "latest",
        },
        {
          serviceId: "6130856754b96c9e2b743e0c",
          versions: "1.0.1",
        },
      ],
      tresspassing: [
        {
          serviceId: "61308658026cfe2b4a89380f",
          versions: "1.0.1",
        },
      ],
      "People Count": [
        {
          serviceId: "6130a0d1563144901780a3c9",
          versions: "1.0",
        },
      ],
      "Mask Detection": [
        {
          serviceId: "6130a11b563144901780a3ca",
          versions: "1.0",
        },
      ],
    },
    AI: {},
    Firmware: {},
    Analytics: {},
    Database: {},
  });
  const [Data, setData] = useState([]);
  const makeArray = () => {
    let arr = [];
    for (let ele of Object.keys(obj)) {
      let objKey = Object.keys(obj[ele]);
      if (objKey.length) {
        for (let ele2 of objKey) {
          for (let ele3 of obj[ele][ele2]) {
            console.log(ele3);
            ele3.type = ele;
            ele3.subtype = ele2;
            let services = obj[ele][ele2];
            console.log(services);
            // ele.serviceVersion = services;
            arr.push(ele3);
          }
        }
      }
    }
    console.log(arr);
    setData(arr);
  };
  useEffect(() => {
    makeArray();
  }, []);

  const [baseData, setBaseData] = useState([]);
  const [usecaseData, setUsecaseData] = useState([]);
  const [AIData, setAIData] = useState([]);
  const [firmwareData, setFirmwareData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [databaseData, setDatabaseData] = useState([]);

  return (
    <div>
      Dependencies
      {Object.keys(obj).map((item, index) => {
        return Data.map((dataItem, index) => {
          if (item === dataItem.type) {
            return <p>{dataItem.subtype}</p>;
          } else return null;
        });
      })}
    </div>
  );
}
