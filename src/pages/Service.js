import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Button from "../components/Button";
import Inputbox from "../components/Inputbox";
import Popup from "../components/Popup";
import { axiosApiInstance } from "../helpers/request";
import { useDebouncedEffect } from "../helpers/useDebounce";

export default function Service() {
  let history = useHistory();
  const [errors, setErrors] = useState({
    isAccessEmpty: false,
    isServiceNameEmpty: false,
    isServiceTypeEmpty: false,
    isServiceDEmpty: false,
    isVersionEmpty: false,
    isOutputTypeEmpty: false,
    isOSEmpty: false,
    isHWEmpty: false,
  });

  const [serviceName, setServiceName] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [serviceVersion, setServiceVersion] = useState("");
  const [serviceTypeOptions, setServiceTypeOptions] = useState([
    "Base",
    "Usecase",
    "AI",
    "Firmware",
    "Analytics",
    "Database",
  ]);
  const [serviceOSSelected, setServiceOSSelected] = useState([]);
  const [outputTypeOption, setoutputTypeOption] = useState([
    "Alert",
    "Report",
    "Both",
  ]);
  const [selectedOutputType, setSelectedOutputType] = useState("");
  const [serviceHWSelected, setServiceHWSelected] = useState([]);
  const [HWSelected, setHWSelected] = useState([]);
  const [isServiceNameUnique, setisServiceNameUnique] = useState(true);
  const [isPopOpen, setIsPopOpen] = useState(true);
  const [osData, setOSData] = useState([
    // {
    //   osVersion: "ubuntu_arm64_jp4.4",
    //   compatibleHardwareVersion: ["DN4G", "DX8G"],
    // },
    // {
    //   osVersion: "Windows 10",
    //   compatibleHardwareVersion: ["WinA", "WinB"],
    // },
  ]);
  useDebouncedEffect(() => serviceCheck(), [serviceName], 1000);

  const serviceCheck = async () => {
    if (serviceName) {
      let res = await axiosApiInstance.get(
        "service_mgmt/unique_check?serviceName=" + serviceName,
        {
          headers: {
            accessKey: "7dab8b8af1c9e43086f55be1f491688fbabcb624",
          },
        }
      );
      if (res.data.detail === "service found") setisServiceNameUnique(false);
    }
  };

  const getOS = async () => {
    let res = await axiosApiInstance.get("devices/versions");
    setOSData(res.data.detail);
  };

  useEffect(() => {
    getOS();
  }, []);

  const handleOSClick = (i) => {
    let data = [...osData];
    let selectedOSService = [...serviceOSSelected];
    let serviceHWSelectedd = [...serviceHWSelected];
    let selectedHW = [...HWSelected];
    if (!selectedOSService.includes(data[i].osVersion)) {
      selectedOSService.push(data[i].osVersion);
      serviceHWSelectedd = [
        ...new Set([
          ...data[i].compatibleHardwareVersion,
          ...serviceHWSelectedd,
        ]),
      ];
    } else {
      let fData = selectedOSService.filter(
        (item) => item !== data[i].osVersion
      );
      selectedOSService = fData;
      for (let ele of data[i].compatibleHardwareVersion) {
        var idx = serviceHWSelectedd.findIndex((p) => p === ele);
        var idx2 = selectedHW.findIndex((q) => q === ele);

        var removed = serviceHWSelectedd.splice(idx, 1);
        if (idx2 !== -1) {
          var removed2 = selectedHW.splice(idx2, 1);
        }
      }
    }
    setServiceHWSelected(serviceHWSelectedd);
    setServiceOSSelected(selectedOSService);
    setHWSelected(selectedHW);
  };

  const handleHWClick = (i) => {
    let serviceHWSelectedArr = [...serviceHWSelected];
    let selectedHW = [...HWSelected];

    if (!selectedHW.includes(serviceHWSelectedArr[i])) {
      selectedHW.push(serviceHWSelected[i]);
    } else {
      let fData = selectedHW.filter((item) => item !== serviceHWSelectedArr[i]);
      selectedHW = fData;
    }

    setHWSelected(selectedHW);
  };

  const postData = async () => {
    let _errors = { ...errors };
    if (accessKey === "") {
      _errors["isAccessEmpty"] = true;
    }
    if (serviceName === "") {
      _errors["isServiceNameEmpty"] = true;
    }
    if (serviceDesc === "") {
      _errors["isServiceDEmpty"] = true;
    }
    if (serviceType === "") {
      _errors["isServiceTypeEmpty"] = true;
    }
    if (selectedOutputType === "") {
      _errors["isOutputTypeEmpty"] = true;
    }
    if (serviceVersion === "") {
      _errors["isVersionEmpty"] = true;
    }
    if (HWSelected.length === 0) {
      _errors["isHWEmpty"] = true;
    }
    if (serviceOSSelected.length === 0) {
      _errors["isOSEmpty"] = true;
    }
    setErrors(_errors);

    if (
      accessKey === "" ||
      serviceName === "" ||
      serviceDesc === "" ||
      serviceType === "" ||
      selectedOutputType === "" ||
      HWSelected.length === 0 ||
      serviceOSSelected.length === 0 ||
      serviceVersion === ""
    ) {
      console.log("MISSING VALUE");
      return;
    }

    console.log("HERE!");
    let data = {
      accessKey: accessKey,
      serviceName: serviceName,
      description: serviceDesc,
      serviceType: serviceType,
      version: serviceVersion,
      outputType: selectedOutputType,
      compatibleOsVersions: serviceOSSelected,
      compatibleHardwareVersions: serviceHWSelected,
    };
    let res = await axiosApiInstance.post("service_mgmt/", data);
    console.log(res);
    history.push("/resource");
    localStorage.setItem("serviceID", res.data.serviceId);
  };

  const clearError = (name) => {
    let _errors = { ...errors };
    if (_errors[name] === true) {
      _errors[name] = false;
      setErrors(_errors);
    }
  };
  return (
    <div className="service-wrapper">
      <div className="cardd card-3">
        <h1>Service</h1>
        <div className="service__unique__wrapper">
          <Inputbox
            label="Access Key"
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            autoFocus
            error={errors["isAccessEmpty"]}
            onFocus={() => clearError("isAccessEmpty")}
          />

          <Inputbox
            label="Service Name"
            value={serviceName}
            onChange={(e) => {
              const value = e.target.value;
              setServiceName(value.split(" ").join(""));
            }}
            onFocus={() => {
              setisServiceNameUnique(true);
              clearError("isServiceNameEmpty");
            }}
            error={errors["isServiceNameEmpty"]}
          />
          {!isServiceNameUnique && (
            <p className="error">Service name already present</p>
          )}
        </div>
        <div style={{ marginBottom: "2vw", marginTop: "2vw" }}>
          <label>
            Service Type
            <select
              className={
                errors["isServiceTypeEmpty"]
                  ? "service__select select__error"
                  : "service__select"
              }
              onFocus={() => clearError("isServiceTypeEmpty")}
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
            >
              <option disabled value="">
                Choose One
              </option>
              {serviceTypeOptions.map((item, index) => (
                <option key={index + 22} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div class="form__group">
          <textarea
            class="form__field"
            placeholder="Your Message"
            rows="6"
            value={serviceDesc}
            onChange={(e) => setServiceDesc(e.target.value)}
            onFocus={() => clearError("isServiceDEmpty")}
          ></textarea>
          <label for="message" class="form__label2 form__label">
            Service Description
          </label>
          {errors["isServiceDEmpty"] && (
            <p className="input__error">Required</p>
          )}
        </div>
        <Inputbox
          label="Service Version"
          value={serviceVersion}
          onChange={(e) => setServiceVersion(e.target.value)}
          error={errors["isVersionEmpty"]}
          onFocus={() => clearError("isVersionEmpty")}
        />
        <div style={{ marginBottom: "2vw" }}>
          <label
            style={
              errors["isOSEmpty"] ? { color: "red" } : { color: "inherit" }
            }
          >
            Compatible OS Version
          </label>
          <div className="btn-wrap">
            {osData.map((item, index) => (
              <div
                key={index + item.osVersion}
                // className="os-btn"
                className={
                  serviceOSSelected.includes(item.osVersion)
                    ? "os-btn active-os-btn"
                    : "os-btn"
                }
                onClick={() => {
                  handleOSClick(index);
                  clearError("isOSEmpty");
                }}
              >
                {item.osVersion}
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: "2vw" }}>
          <label
            style={
              errors["isHWEmpty"] ? { color: "red" } : { color: "inherit" }
            }
          >
            Compatible Hardware Version
            <div className="btn-wrap">
              {serviceHWSelected.map((item, index) => (
                <div
                  key={index + item}
                  // className="os-btn"
                  className={
                    HWSelected.includes(item)
                      ? "os-btn active-os-btn"
                      : "os-btn"
                  }
                  onClick={() => {
                    handleHWClick(index);
                    clearError("isHWEmpty");
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </label>
        </div>

        <div style={{ marginBottom: "2vw", marginTop: "2vw" }}>
          <label>
            Output Type
            <select
              className={
                errors["isOutputTypeEmpty"]
                  ? "service__select select__error"
                  : "service__select"
              }
              onFocus={() => clearError("isOutputTypeEmpty")}
              value={selectedOutputType}
              onChange={(e) => setSelectedOutputType(e.target.value)}
            >
              <option disabled value="">
                Choose One
              </option>
              {outputTypeOption.map((item, index) => (
                <option key={index + 22} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
        {/* {isPopOpen && (
          <Popup>
            <div className="service__pop">
              <Inputbox
                label="Access Key"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                autoFocus
              />
              <Button disabled={!accessKey} name="Submit" onClick={postAccess} />
            </div>
          </Popup>
        )} */}
        <Button name="Submit" onClick={postData} />
      </div>
    </div>
  );
}
