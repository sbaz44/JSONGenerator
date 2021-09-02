import React, { useState } from "react";

export default function Dependencies() {
  const [data, setData] = useState({
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

  const [baseData, setBaseData] = useState([]);
  const [usecaseData, setUsecaseData] = useState([]);
  const [AIData, setAIData] = useState([]);
  const [firmwareData, setFirmwareData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [databaseData, setDatabaseData] = useState([]);

  return <div>Dependencies</div>;
}
