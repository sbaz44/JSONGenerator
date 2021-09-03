import React, { useState } from "react";
import Inputbox from "../components/Inputbox";
import Button from "../components/Button";
import { axiosApiInstance } from "../helpers/request";
import { useHistory } from "react-router-dom";

const MountCard = (data) => {
  return (
    <div className="mount__card">
      <Inputbox
        label={data.label1}
        onChange={data.onSrcChange}

        // value={serviceName}
        // onChange={(e) => {
        //   setServiceName(e.target.value);
        // }}
        // onFocus={() => setisServiceNameUnique(true)}
      />
      <Inputbox
        label={data.label2}
        onChange={data.onDestChange}
        // value={serviceName}
        // onChange={(e) => {
        //   setServiceName(e.target.value);
        // }}
        // onFocus={() => setisServiceNameUnique(true)}
      />
    </div>
  );
};

export default function Resource() {
  let history = useHistory();
  const [resrcLimit, setResrcLimit] = useState("");
  const [resrcRes, setResrcRes] = useState("");
  const [DBName, setDBName] = useState("");
  const [DBType, setDBType] = useState("mongo");

  const [mount, setMount] = useState([
    {
      Source: "",
      Target: "",
    },
  ]);

  const [port, setPort] = useState([
    {
      PublishedPort: "",
      TargetPort: "",
    },
  ]);

  const addMount = () => {
    let _mount = [...mount];
    let obj = {
      Source: "",
      Target: "",
    };
    _mount.push(obj);
    setMount(_mount);
  };

  const addPort = () => {
    let _port = [...port];
    let obj = {
      PublishedPort: "",
      TargetPort: "",
    };
    _port.push(obj);
    setPort(_port);
  };

  const mountHandleChange = (e, i, n) => {
    let data = [...mount];
    data[i][n] = e.target.value;
    setMount(data);
  };

  const portHandleChange = (e, i, n) => {
    let data = [...port];
    data[i][n] = e.target.value;
    setPort(data);
  };

  const onSubmit = async () => {
    let data = {
      serviceId: localStorage.getItem("serviceID"),
      requiredRamLimit: Number(resrcLimit),
      requiredRamReservation: Number(resrcRes),
      mounts: mount,
      ports: port,
      database: {
        databaseName: DBName,
        databaseType: DBType,
      },
    };
    let res = await axiosApiInstance.post(
      "service_mgmt/metadata/service/",
      data
    );
    console.log(res);
    history.push("/dependencies");
  };

  return (
    <div className="service-wrapper">
      {console.log(port)}
      <div className="cardd card-5 card-6">
        <h2>Mounts</h2>
        <Button onClick={addMount} style={{ alignSelf: "start" }} name="Add" />
        <div className="resource_mount_wrapper">
          {mount.map((item, index) => (
            <MountCard
              label1="Source"
              label2="Destination"
              onSrcChange={(e) => mountHandleChange(e, index, "Source")}
              onDestChange={(e) => mountHandleChange(e, index, "Destination")}
            />
          ))}
        </div>
        <h2>Resources</h2>

        <Inputbox
          label="Resource Limit"
          value={resrcLimit}
          onChange={(e) => {
            if (isNaN(e.target.value)) {
              return;
            }
            const onlyNums = e.target.value.replace(/[^0-9]/g, "");
            setResrcLimit(onlyNums);
          }}
        />
        <Inputbox
          label="Resource Reservation"
          value={resrcRes}
          onChange={(e) => {
            if (isNaN(e.target.value)) {
              return;
            }
            const onlyNums = e.target.value.replace(/[^0-9]/g, "");
            setResrcRes(onlyNums);
          }}
        />
        <h2>Ports</h2>
        <Button onClick={addPort} style={{ alignSelf: "start" }} name="Add" />
        <div className="resource_mount_wrapper">
          {port.map((item, index) => (
            <MountCard
              label1="Published Port"
              label2="Target Port"
              onSrcChange={(e) => portHandleChange(e, index, "PublishedPort")}
              onDestChange={(e) => portHandleChange(e, index, "TargetPort")}
            />
          ))}
        </div>

        {/* <Inputbox
          label="Published Port"
          // value={serviceName}
          // onChange={(e) => {
          //   setServiceName(e.target.value);
          // }}
          // onFocus={() => setisServiceNameUnique(true)}
        />
        <Inputbox
          label="Target Port"
          // value={serviceName}
          // onChange={(e) => {
          //   setServiceName(e.target.value);
          // }}
          // onFocus={() => setisServiceNameUnique(true)}
        /> */}
        <h2>Database</h2>
        <Inputbox
          label="Database Name"
          value={DBName}
          onChange={(e) => {
            setDBName(e.target.value);
          }}
        />
        <Inputbox
          label="Database Type"
          value={DBType}
          // value={serviceName}
          // onChange={(e) => {
          //   setServiceName(e.target.value);
          // }}
          // onFocus={() => setisServiceNameUnique(true)}
        />
        <Button
          onClick={onSubmit}
          style={{ alignSelf: "center" }}
          name="Submit"
        />
      </div>
    </div>
  );
}
