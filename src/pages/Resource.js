import React from "react";
import Inputbox from "../components/Inputbox";

export default function Resource() {
  return (
    <div className="service-wrapper">
      <div className="cardd card-4">
        <h2>Mounts</h2>
        <div className="service__unique__wrapper">
          <Inputbox
            label="Access Key"
            // value={accessKey}
            // onChange={(e) => setAccessKey(e.target.value)}
            autoFocus
          />

          <Inputbox
            label="Service Name"
            // value={serviceName}
            // onChange={(e) => {
            //   setServiceName(e.target.value);
            // }}
            // onFocus={() => setisServiceNameUnique(true)}
          />
          {/* {!isServiceNameUnique && (
            <p className="error">Service name already present</p>
          )} */}
        </div>
        <Inputbox
          label="Resource Limit"
          // value={serviceName}
          // onChange={(e) => {
          //   setServiceName(e.target.value);
          // }}
          // onFocus={() => setisServiceNameUnique(true)}
        />
        <Inputbox
          label="Resource Reservation"
          // value={serviceName}
          // onChange={(e) => {
          //   setServiceName(e.target.value);
          // }}
          // onFocus={() => setisServiceNameUnique(true)}
        />
        <h2>Ports</h2>
        <Inputbox
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
        />
        <h2>Database</h2>
        <Inputbox
          label="Database Name"
          // value={serviceName}
          // onChange={(e) => {
          //   setServiceName(e.target.value);
          // }}
          // onFocus={() => setisServiceNameUnique(true)}
        />
      </div>
    </div>
  );
}
