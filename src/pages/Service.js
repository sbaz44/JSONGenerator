import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Button from "../components/Button";
import Inputbox from "../components/Inputbox";
import Popup from "../components/Popup";
import { axiosApiInstance } from "../helpers/request";
import { useDebouncedEffect } from "../helpers/useDebounce";

export default function Service() {
  let history = useHistory();

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
    {
      osVersion: "ubuntu_arm64_jp4.4",
      compatibleHardwareVersion: ["DN4G", "DX8G"],
    },
    {
      osVersion: "Windows 10",
      compatibleHardwareVersion: ["WinA", "WinB"],
    },
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
    // getOS();
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
        console.log(idx2 + " <=" + 0);
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
  return (
    <div className="service-wrapper">
      {/* {console.log(serviceHWSelected)}
      {console.log(serviceOSSelected)}
      {console.log(HWSelected)} */}
      {console.log(HWSelected)}
      <div className="cardd card-3">
        <h1>Service</h1>
        <div className="service__unique__wrapper">
          <Inputbox
            label="Access Key"
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            autoFocus
          />

          <Inputbox
            label="Service Name"
            value={serviceName}
            onChange={(e) => {
              setServiceName(e.target.value);
            }}
            onFocus={() => setisServiceNameUnique(true)}
          />
          {!isServiceNameUnique && (
            <p className="error">Service name already present</p>
          )}
        </div>
        <div style={{ marginBottom: "2vw", marginTop: "2vw" }}>
          <label>
            Service Type
            <select
              className="service__select"
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
          ></textarea>
          <label for="message" class="form__label2 form__label">
            Service Description
          </label>
        </div>
        <Inputbox
          label="Service Version"
          value={serviceVersion}
          onChange={(e) => setServiceVersion(e.target.value)}
        />
        <div style={{ marginBottom: "2vw" }}>
          <label>Compatible OS Version </label>
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
                onClick={() => handleOSClick(index)}
              >
                {item.osVersion}
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: "2vw" }}>
          <label>
            Compatible Hardware Version
            <div className="btn-wrap">
              {serviceHWSelected.map((item, index) => (
                <div
                  key={index + item}
                  // className="os-btn"
                  className={"os-btn"}
                  className={
                    HWSelected.includes(item)
                      ? "os-btn active-os-btn"
                      : "os-btn"
                  }
                  onClick={() => handleHWClick(index)}
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
              className="service__select"
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
