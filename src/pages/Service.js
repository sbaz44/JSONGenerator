import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import Inputbox from "../components/Inputbox";
import { axiosApiInstance } from "../helpers/request";

export default function Service() {
  const [serviceName, setServiceName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [serviceVersion, setServiceVersion] = useState("");
  const [serviceOS, setServiceOS] = useState(["A", "B", "C", "D"]);
  const [serviceHW, setServiceHW] = useState(["A", "B", "C", "D"]);
  const [serviceOSSelected, setServiceOSSelected] = useState("");
  const [serviceHWSelected, setServiceHWSelected] = useState("");

  useEffect(async () => {
    serviceCheck();
  }, []);

  const serviceCheck = async () => {
    let res = await axiosApiInstance.get(
      "service_mgmt/unique_check?serviceName=aca"
    );
    console.log(res.data.detail);
  };

  return (
    <div className="service-wrapper">
      <div className="card card-3">
        <h1>Service</h1>
        <Inputbox
          label="Service Name"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
        />
        <Inputbox
          label="Service Type"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
        />
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
          <label>
            Compatible Hardware Version
            <select
              className="service__select"
              value={serviceHWSelected}
              onChange={(e) => setServiceHWSelected(e.target.value)}
            >
              <option disabled value="">
                Choose One
              </option>
              {serviceOS.map((item, index) => (
                <option key={index + 22} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ marginBottom: "2vw" }}>
          <label>
            Compatible OS Version
            <select
              className="service__select"
              value={serviceOSSelected}
              onChange={(e) => setServiceOSSelected(e.target.value)}
            >
              <option disabled value="">
                Choose One
              </option>
              {serviceOS.map((item, index) => (
                <option key={index + 22} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Button name="Submit" />
      </div>
    </div>
  );
}
