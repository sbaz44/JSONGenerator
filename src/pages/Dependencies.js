import Multiselect from "multiselect-react-dropdown";
import React, { useEffect, useState } from "react";
import { axiosApiInstance } from "../helpers/request";
import Button from "../components/Button";
import { useHistory } from "react-router-dom";

export default function Dependencies() {
  let history = useHistory();

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
    AI: {
      person: [
        {
          serviceId: "612faf2ffbad2434de32aa95",
          versions: "latest",
        },
        {
          serviceId: "6130856754b96c9e2b743e0c",
          versions: "1.0.1",
        },
      ],
      vehicle: [
        {
          serviceId: "61308658026cfe2b4a89380f",
          versions: "1.0.1",
        },
      ],
    },
    Firmware: {},
    Analytics: {},
    Database: {},
  });
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

  const onLoad = async () => {
    let res = await axiosApiInstance.get("service_mgmt/metadata/service");
    setObj(res.data.detail);
  };

  useEffect(() => {
    onLoad();
  }, []);

  const [Data, setData] = useState([]);

  const [selectedData, setSelectedData] = useState({
    serviceId: localStorage.getItem("serviceID"),
    Base: [],
    AI: [],
    Database: [],
    Usecase: [],
    Analytics: [],
    Firmware: [],
  });

  const [globalData, setGlobalData] = useState([]);

  const onSelect = (selectedList, selectedItem, item) => {
    let object = {
      versions: obj[item][selectedItem],
      type: item,
      subtype: selectedItem,
    };
    let arr = [...globalData];
    arr.push(object);
    setGlobalData(arr);
  };

  const onRemove = (selectedList, selectedItem, item) => {
    let data = [...globalData];
    let selectedDataa = { ...selectedData };

    for (let ele of obj[item][selectedItem]) {
      for (let ele2 of selectedDataa[item]) {
        if (ele.serviceId === ele2) {
          selectedDataa[item] = selectedDataa[item].filter(
            (item) => item != ele.serviceId
          );
        }
      }
    }

    data = data.filter((item) => item.subtype !== selectedItem);
    setGlobalData(data);
    setSelectedData(selectedDataa);
  };

  const onVersionSelect = (selectedList, selectedItem, item, item2) => {
    let selectedDataa = { ...selectedData };
    for (let ele of item2.versions) {
      for (let ele2 of selectedDataa[item]) {
        if (ele.serviceId === ele2) {
          let filteredData = selectedDataa[item].filter((item) => {
            return item != ele2;
          });
          selectedDataa[item] = filteredData;
        }
      }
    }
    selectedDataa[item].push(selectedItem.serviceId);
    setSelectedData(selectedDataa);
  };
  const validateInput = () => {
    let dataObj = {};
    for (let selectedEle of Object.keys(selectedData)) {
      if (selectedEle !== "serviceId") {
        dataObj[selectedEle] = 0;
      }
    }

    for (let globalEle of globalData) {
      for (let objEle of Object.keys(dataObj)) {
        if (globalEle.type === objEle) {
          dataObj[objEle] += 1;
        }
      }
    }
    let result = false;
    for (let selectedEle of Object.keys(selectedData)) {
      if (selectedEle !== "serviceId") {
        if (selectedData[selectedEle].length !== dataObj[selectedEle]) {
          console.log("MISSINGGG VALUE");
          result = true;
          break;
        }
      }
    }
    return result;
    // }
  };
  const onSubmit = async () => {
    if (!validateInput()) {
      let res = await axiosApiInstance.post(
        "service_mgmt/metadata/package",
        selectedData
      );
      console.log(res);
      history.push("/usecase");
    }
  };

  return (
    <div className="card card-4">
      Dependencies
      {Object.keys(obj).map((item, index) => (
        <div key={item + index} className="dependency_container card-5">
          <h2>{item}</h2>
          <div className="multiSelect_wrapper">
            <div className="multiSelect_container">
              <Multiselect
                isObject={false}
                options={Object.keys(obj[item])}
                onSelect={(selectedList, selectedItem) =>
                  onSelect(selectedList, selectedItem, item)
                }
                onRemove={(selectedList, selectedItem) =>
                  onRemove(selectedList, selectedItem, item)
                }
              />
            </div>
            <div className="version_container">
              {globalData.map((item2, index) => {
                if (item2.type === item) {
                  return (
                    <div className="version_children">
                      <p>{item2.subtype}</p>
                      <Multiselect
                        displayValue="versions"
                        singleSelect
                        options={item2.versions}
                        onSelect={(selectedList, selectedItem) =>
                          onVersionSelect(
                            selectedList,
                            selectedItem,
                            item,
                            item2
                          )
                        }
                      />
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      ))}
      <Button
        onClick={onSubmit}
        style={{ alignSelf: "center" }}
        name="Submit"
      />
    </div>
  );
}
