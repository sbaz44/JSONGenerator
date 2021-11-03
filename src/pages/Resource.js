import React, { useState } from "react";
import Inputbox from "../components/Inputbox";
import Button from "../components/Button";
import { axiosApiInstance } from "../helpers/request";
import { useHistory } from "react-router-dom";
import Header from "../components/Header";
import Sidenav from "../components/Sidenav";

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
      {data.isReadOnly && (
        <label>
          Read Only
          <input
            type="checkbox"
            defaultChecked={data.ReadOnly}
            // defaultChecked={checked}
            onChange={data.onCBChange}
          />
        </label>
      )}
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

  const [resrcLimit, setResrcLimit] = useState("100");
  const [resrcRes, setResrcRes] = useState("50");
  const [DBName, setDBName] = useState("");
  const [DBType, setDBType] = useState("mongo");

  const [mount, setMount] = useState([]);

  const [port, setPort] = useState([]);

  const [env, setEnv] = useState([]);

  const addMount = () => {
    let _mount = [...mount];
    setSrcError([...srcError, false]);
    setTargetError([...targetError, false]);
    let obj = {
      Source: "",
      Target: "",
      ReadOnly: true,
    };
    _mount.push(obj);
    setMount(_mount);
  };

  const addEnv = () => {
    let _env = [...env];
    // setSrcError([...srcError, false]);
    // setTargetError([...targetError, false]);
    _env.push("");
    setEnv(_env);
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
      console.log("Not A Number");
      return;
    } else {
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

    if (_mount.length && _port.length) {
      for (let i = 0; i < _mount.length; i++) {
        if (_mount[i].Source === "") {
          _srcError[i] = true;
        }
        if (_mount[i].Target === "") {
          _targetError[i] = true;
        }
      }

      for (let i = 0; i < _port.length; i++) {
        // if (_port[i].PublishedPort === "") {
        //   _pPortError[i] = true;
        // }
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
      // if (DBName === "") {
      //   _errors["isDBNameEmpty"] = true;
      // }
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
        resrcRes === ""
        // DBName === ""
      ) {
        return true;
      } else return false;
    }
    if (_mount.length) {
      for (let i = 0; i < _mount.length; i++) {
        if (_mount[i].Source === "") {
          _srcError[i] = true;
        }
        if (_mount[i].Target === "") {
          _targetError[i] = true;
        }
      }

      if (resrcLimit === "") {
        _errors["isResourceLimitEmpty"] = true;
      }
      if (resrcRes === "") {
        _errors["isResrcResEmpty"] = true;
      }
      // if (DBName === "") {
      //   _errors["isDBNameEmpty"] = true;
      // }
      setErrors(_errors);
      setSrcError(_srcError);
      setTargetError(_targetError);
      setTPortError(_tPortError);
      setPPortError(_pPortError);
      const __srcError = _srcError.includes(true);
      const __targetError = _targetError.includes(true);

      if (
        __srcError ||
        __targetError ||
        resrcLimit === "" ||
        resrcRes === ""
        // DBName === ""
      ) {
        return true;
      } else return false;
    }
    if (_port.length) {
      for (let i = 0; i < _port.length; i++) {
        // if (_port[i].PublishedPort === "") {
        //   _pPortError[i] = true;
        // }
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
      // if (DBName === "") {
      //   _errors["isDBNameEmpty"] = true;
      // }
      setErrors(_errors);
      setSrcError(_srcError);
      setTargetError(_targetError);
      setTPortError(_tPortError);
      setPPortError(_pPortError);
      const __pPortError = _pPortError.includes(true);
      const __tPortError = _tPortError.includes(true);
      if (
        __pPortError ||
        __tPortError ||
        resrcLimit === "" ||
        resrcRes === ""
        // DBName === ""
      ) {
        return true;
      } else return false;
    }
  };

  const onSubmit = async () => {
    if (!validateDynamicInput()) {
      // if (true) {
      console.log("ALL OK!");

      let data = {
        serviceId: localStorage.getItem("serviceID"),
        mounts: mount,
        ports: port,
        env: env,
        database: {
          databaseName: DBName,
          databaseType: DBType,
        },
      };
      if (resrcLimit) data.requiredRamLimit = Number(resrcLimit * 1048576);

      if (resrcRes) data.requiredRamReservation = Number(resrcRes * 1048576);
      console.log(data);
      let res = await axiosApiInstance.post(
        "service_mgmt/metadata/service",
        data
      );
      console.log(res);
      history.push("/dependencies");
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
      <Header text="Mounts Form" />
      <div className="flex">
        <Sidenav />
        <div className="cardd card-5 card-6">
          <Button
            onClick={addMount}
            style={{ alignSelf: "start" }}
            name="Add Mount"
          />
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
                ReadOnly={item.ReadOnly}
                onSrcChange={(e) => mountHandleChange(e, index, "Source")}
                onDestChange={(e) => mountHandleChange(e, index, "Target")}
                onCBChange={(e) => {
                  let data = [...mount];
                  mount[index].ReadOnly = !mount[index].ReadOnly;
                  console.log(data);
                  setMount(data);
                }}
                isReadOnly
              />
            ))}
          </div>
          <h2>Resources</h2>

          <Inputbox
            label="Resource Limit (in MB)"
            value={resrcLimit}
            onChange={(e) => {
              if (isNaN(e.target.value)) {
                return;
              }
              const onlyNums = e.target.value.replace(/[^0-9]/g, "");
              setResrcLimit(onlyNums);
            }}
            onFocus={() => {
              let data = { ...errors };
              data.isResourceLimitEmpty = false;
              setErrors(data);
            }}
            error={errors["isResourceLimitEmpty"]}
          />
          <Inputbox
            label="Resource Reservation (in MB)"
            value={resrcRes}
            onChange={(e) => {
              if (isNaN(e.target.value)) {
                return;
              }
              const onlyNums = e.target.value.replace(/[^0-9]/g, "");
              setResrcRes(onlyNums);
            }}
            onFocus={() => {
              let data = { ...errors };
              data.isResrcResEmpty = false;
              setErrors(data);
            }}
            error={errors["isResrcResEmpty"]}
          />
          <h2>Ports</h2>
          <Button
            onClick={addPort}
            style={{ alignSelf: "start" }}
            name="Add Port"
          />
          <div className="resource_mount_wrapper">
            {port.map((item, index) => (
              <MountCard
                key={index + 595}
                value={item.PublishedPort}
                value2={item.TargetPort}
                label1="Published Port"
                label2="Target Port"
                // onFocus={() => clearPPortError(index)}
                onFocus2={() => clearTPortError(index)}
                // error={pPortError[index]}
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
            onFocus={() => {
              let data = { ...errors };
              data.isDBNameEmpty = false;
              setErrors(data);
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
          <h2>Environment Variable</h2>
          <Button
            onClick={addEnv}
            style={{ alignSelf: "start" }}
            name="Add Env"
          />
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {env.map((item, index) => (
              <div style={{ margin: "0 1vw" }}>
                <Inputbox
                  label="Variable name"
                  value={item}
                  onChange={(e) => {
                    let _env = [...env];
                    _env[index] = e.target.value;
                    setEnv(_env);
                  }}
                />
              </div>
            ))}
          </div>
          <Button
            onClick={onSubmit}
            style={{ alignSelf: "center" }}
            name="Submit"
          />
        </div>
      </div>
    </div>
  );
}
