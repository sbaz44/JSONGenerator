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
        error={data.error}
        onFocus={data.onFocus}
        value={data.value}
      />
      <Inputbox
        label={data.label2}
        onChange={data.onDestChange}
        error={data.error2}
        onFocus={data.onFocus2}
        value={data.value2}
      />
    </div>
  );
};

export default function Resource() {
  let history = useHistory();

  const [errors, setErrors] = useState({
    isResourceLimitEmpty: false,
    isResrcResEmpty: false,
    isDBNameEmpty: false,
  });

  const [srcError, setSrcError] = useState([false]);
  const [targetError, setTargetError] = useState([false]);

  const [pPortError, setPPortError] = useState([false]);
  const [tPortError, setTPortError] = useState([false]);

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
    setSrcError([...srcError, false]);
    setTargetError([...targetError, false]);
    let obj = {
      Source: "",
      Target: "",
    };
    _mount.push(obj);
    setMount(_mount);
  };

  const addPort = () => {
    let _port = [...port];
    setPPortError([...pPortError, false]);
    setTPortError([...tPortError, false]);
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
    if (isNaN(e.target.value)) {
      console.log("object");
      return;
    } else {
      console.log("object2");

      const onlyNums = e.target.value.replace(/[^0-9]/g, "");

      let data = [...port];
      data[i][n] = onlyNums;
      setPort(data);
    }
  };
  const validateDynamicInput = () => {
    let _mount = [...mount];
    let _port = [...port];
    let _srcError = [...srcError];
    let _targetError = [...targetError];
    let _pPortError = [...pPortError];
    let _tPortError = [...tPortError];
    let _errors = { ...errors };

    for (let i = 0; i < _mount.length; i++) {
      if (_mount[i].Source === "") {
        _srcError[i] = true;
      }
      if (_mount[i].Target === "") {
        _targetError[i] = true;
      }
    }

    for (let i = 0; i < _port.length; i++) {
      if (_port[i].PublishedPort === "") {
        _pPortError[i] = true;
      }
      if (_port[i].TargetPort === "") {
        _tPortError[i] = true;
      }
    }

    if (resrcLimit === "") {
      _errors["isResourceLimitEmpty"] = true;
    }
    if (resrcRes === "") {
      _errors["isResrcResEmpty"] = true;
    }
    if (DBName === "") {
      _errors["isDBNameEmpty"] = true;
    }
    setErrors(_errors);
    setSrcError(_srcError);
    setTargetError(_targetError);
    setTPortError(_tPortError);
    setPPortError(_pPortError);
    const __srcError = _srcError.includes(true);
    const __targetError = _targetError.includes(true);
    const __pPortError = _pPortError.includes(true);
    const __tPortError = _tPortError.includes(true);
    if (
      __srcError ||
      __targetError ||
      __pPortError ||
      __tPortError ||
      resrcLimit === "" ||
      resrcRes === "" ||
      DBName === ""
    ) {
      return true;
    } else return false;
  };

  const onSubmit = async () => {
    if (!validateDynamicInput()) {
      console.log("ALL OK!");
    } else {
      console.log("SOMETHING MISSING!");
    }

    // }
    // for(let portEle of port){
    //   // if (this.state.gaurdians[i].Name === "") {
    //   //   nameError[i] = true;
    //   // }
    //   if(portEle.PublishedPort===""){

    //   }
    //   console.log(portEle.PublishedPort);
    // }

    // let data = {
    //   serviceId: localStorage.getItem("serviceID"),
    //   requiredRamLimit: Number(resrcLimit),
    //   requiredRamReservation: Number(resrcRes),
    //   mounts: mount,
    //   ports: port,
    //   database: {
    //     databaseName: DBName,
    //     databaseType: DBType,
    //   },
    // };
    // let res = await axiosApiInstance.post(
    //   "service_mgmt/metadata/service/",
    //   data
    // );
    // console.log(res);
    // history.push("/dependencies");
  };

  const clearSrcError = (i) => {
    let _srcError = [...srcError];
    if (_srcError[i] === true) {
      _srcError[i] = false;
      setSrcError(_srcError);
    }
  };
  const clearTargetError = (i) => {
    let _targetError = [...targetError];
    if (_targetError[i] === true) {
      _targetError[i] = false;
      setTargetError(_targetError);
    }
  };

  const clearPPortError = (i) => {
    let _srcError = [...pPortError];
    if (_srcError[i] === true) {
      _srcError[i] = false;
      setPPortError(_srcError);
    }
  };
  const clearTPortError = (i) => {
    let _targetError = [...tPortError];
    if (_targetError[i] === true) {
      _targetError[i] = false;
      setTPortError(_targetError);
    }
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
              key={index + 58}
              value={item.Source}
              value2={item.Target}
              label1="Source"
              label2="Target"
              onFocus={() => clearSrcError(index)}
              onFocus2={() => clearTargetError(index)}
              error={srcError[index]}
              error2={targetError[index]}
              onSrcChange={(e) => mountHandleChange(e, index, "Source")}
              onDestChange={(e) => mountHandleChange(e, index, "Target")}
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
          error={errors["isResourceLimitEmpty"]}
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
          error={errors["isResrcResEmpty"]}
        />
        <h2>Ports</h2>
        <Button onClick={addPort} style={{ alignSelf: "start" }} name="Add" />
        <div className="resource_mount_wrapper">
          {port.map((item, index) => (
            <MountCard
              key={index + 595}
              value={item.PublishedPort}
              value2={item.TargetPort}
              label1="Published Port"
              label2="Target Port"
              onFocus={() => clearPPortError(index)}
              onFocus2={() => clearTPortError(index)}
              error={pPortError[index]}
              error2={tPortError[index]}
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
          error={errors["isDBNameEmpty"]}
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
