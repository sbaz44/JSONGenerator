import React, { useEffect, useState } from "react";
import "./roi.scss";
import limits from "./limits.json";
import servicess from "./services.json";
import _ from "lodash";
let Services = servicess["Services"];
let Limits = limits["details"]["Limitations"];
let deepStreamLimit = Limits["Deepstream"];
let usecaseLimit = Limits["Usecase"];
let isAllTimeSelected = false;
let isAllUCSelected = [];
let disabledServices = [];
export default function ROI() {
  const [data, setData] = useState([..._data]);
  const [apiData, setApiData] = useState({ ..._apiData });
  const [time, setTime] = useState([..._time]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState([]);
  const [Service, setService] = useState([...Services]);
  const [mouseState, setMouseState] = useState(false);
  const [DisabledTS, setDisabledTS] = useState([]);
  const [isCamerPresent, setisCamerPresent] = useState(false);

  //reusable functions
  const Loop = (arr, callback) => {
    for (let element of arr) {
      callback(element);
    }
  };

  const timeslotMouseDown = (i) => {
    let _selectedTimeSlot = _.cloneDeep(selectedTimeSlot);
    let elePresent = _.includes(selectedTimeSlot, i);
    if (!elePresent) {
      _selectedTimeSlot.push(i);
    } else {
      _selectedTimeSlot = _selectedTimeSlot.filter((item) => item != i);
    }
    setSelectedTimeSlot([..._selectedTimeSlot]);
    setMouseState(true);
  };

  const cameraNotPresent = () => {
    console.log("cameraNotPresent()");
    let _data = _.cloneDeep(data);
    let _service = _.cloneDeep(Service);
    for (let servEle of _service) {
      isAllUCSelected.push(false);
      disabledServices.push(servEle.Service_id);
    }
    Loop(_data, (dataEle) => {
      Loop(_service, (servEle) => {
        dataEle.disabledService.push(servEle.Service_id);
      });
    });
    setData([..._data]);
  };
  const onLoad = () => {
    console.count("first");
    let _apiData = { ...apiData };
    let apiDataKeys = Object.keys(_apiData);
    let cameraLength = 0;
    for (let i = 0; i < apiDataKeys.length; i++) {
      if (_apiData[apiDataKeys[i]].global.Cameras.length) {
        cameraLength += 1;
      }
    }
    if (cameraLength > 0) {
      setisCamerPresent(true);
      console.log("CAMERA IS PRESENT!");
    } else {
      cameraNotPresent();
      console.log("CAMERA IS NOT PRESENT!");
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <div className="roiContainer">
      <div className="containerr">
        <div className="timeline-header">
          <p className="h">Time (24 Hrs)</p>
          <div className="timeline">
            <div className="time">
              <p>0</p>
            </div>
            <div className="time">
              <p>2</p>
            </div>
            <div className="time">
              <p>4</p>
            </div>
            <div className="time">
              <p>6</p>
            </div>
            <div className="time">
              <p>8</p>
            </div>
            <div className="time">
              <p>10</p>
            </div>
            <div className="time">
              <p>12</p>
            </div>
            <div className="time">
              <p>14</p>
            </div>
            <div className="time">
              <p>16</p>
            </div>
            <div className="time">
              <p>18</p>
            </div>
            <div className="time">
              <p>20</p>
            </div>
            <div className="time">
              <p>22</p>
            </div>
            <div className="time">
              <span>24</span>
            </div>
          </div>
        </div>
        <div className="timeline_info">
          <p className="select_text">Select All</p>
          <p className="drag_text">Drag & Select Time Range</p>
          <p className="configure_text">Configure</p>
        </div>
        <div className="timeline-header header_adjust">
          <p className="h">Activate Camera Time</p>
          <div
            className={
              isAllTimeSelected ? "select_all all_selected" : "select_all"
            }
            //   style={{
            //     backgroundColor: _.isEqual(
            //       this.state.DisabledTS,
            //       this.state.time
            //     )
            //       ? "gray"
            //       : null,
            //   }}
            onMouseEnter={() => setMouseState(false)}
            onMouseLeave={() => setMouseState(false)}
            onClick={() => {
              // if (!_.isEqual(this.state.DisabledTS, this.state.time)) {
              //   isAllTimeSelected = !isAllTimeSelected;
              //   this.toggleCameraSlot();
              // }
            }}
          />
          <div className="timeline" onMouseLeave={() => setMouseState(false)}>
            {data.map((item) => (
              <div
                key={item.slot + "1020"}
                className={
                  selectedTimeSlot.includes(item.slot)
                    ? "child activeslot"
                    : "child"
                }
                // style={{
                //   backgroundColor: this.state.DisabledTS.includes(item.slot)
                //     ? "gray"
                //     : "",
                //   cursor: this.state.DisabledTS.includes(item.slot)
                //     ? "not-allowed"
                //     : "default",
                // }}
                onMouseDown={() => {
                  //   if (!this.state.DisabledTS.includes(item.slot)) {
                  timeslotMouseDown(item.slot);
                  //   }
                }}
                onMouseEnter={() => {
                  if (mouseState) {
                    // if (!this.state.DisabledTS.includes(item.slot)) {
                    timeslotMouseDown(item.slot);
                    // }
                  }
                }}
                onMouseUp={() => setMouseState(false)}
              >
                <div className="circle" />
              </div>
            ))}
            <div className="circle2 c_adjust" />
          </div>
        </div>
        <div className="data-container">
          <h1>Apps</h1>
          {/* <Scrollbars autoHeight autoHeightMax="49vh"> */}
          <div className="app_fixed">
            {Service.map((service_item, service_index) => (
              <div className="flex" key={service_item.Service_id}>
                <h4 className="name">
                  {service_item.Service_name.replaceAll("_", " ")}
                </h4>
                <div
                  className="select_all"
                  //   className={
                  //     isAllUCSelected[service_index]
                  //       ? "select_all all_selected"
                  //       : "select_all"
                  //   }
                  onMouseEnter={() => setMouseState(false)}
                  onMouseLeave={() => setMouseState(false)}
                  //   style={{
                  //     backgroundColor: disabledServices.includes(
                  //       service_item.Service_id
                  //     )
                  //       ? "gray"
                  //       : null,
                  //     cursor: disabledServices.includes(service_item.Service_id)
                  //       ? "not-allowed"
                  //       : "pointer",
                  //   }}
                  onClick={() => {
                    // if (selectedTimeSlot.length !== 0) {
                    //   if (!disabledServices.includes(service_item.Service_id)) {
                    //     isAllUCSelected[service_index] =
                    //       !isAllUCSelected[service_index];
                    //     this.toggleUCSlot(service_item, service_index);
                    //   }
                    // }
                  }}
                />
                <div
                  className="dummy"
                  onMouseLeave={() => setMouseState(false)}
                  onMouseEnter={() => setMouseState(false)}
                >
                  {data.map((item, index) => (
                    <div
                      key={item.slot + "2"}
                      className={
                        item.Usecases.includes(service_item.Service_id)
                          ? "child activeslot"
                          : "child"
                      }
                      style={{
                        backgroundColor: item.disabledService.includes(
                          service_item.Service_id
                        )
                          ? "gray"
                          : DisabledTS.includes(item.slot)
                          ? "gray"
                          : "",
                      }}
                      onMouseDown={() => {
                        //   if (
                        //     !item.disabledService.includes(
                        //       service_item.Service_id
                        //     )
                        //   ) {
                        //     if (this.state.isCamerPresent) {
                        //       if (
                        //         !this.state.DisabledTS.includes(item.slot)
                        //       ) {
                        //         this.usecaseMouseDown2(
                        //           item,
                        //           service_index,
                        //           service_item,
                        //           index
                        //         );
                        //       }
                        //     } else {
                        //       this.usecaseMouseDown(
                        //         item,
                        //         service_index,
                        //         service_item,
                        //         index
                        //       );
                        //     }
                        //   }
                      }}
                      onMouseEnter={() => {
                        //   if (this.state.mouseState) {
                        //     if (
                        //       !item.disabledService.includes(
                        //         service_item.Service_id
                        //       )
                        //     ) {
                        //       if (this.state.isCamerPresent) {
                        //         this.usecaseMouseDown2(
                        //           item,
                        //           service_index,
                        //           service_item,
                        //           index
                        //         );
                        //       } else {
                        //         this.usecaseMouseDown(
                        //           item,
                        //           service_index,
                        //           service_item,
                        //           index
                        //         );
                        //       }
                        //     }
                        //   }
                      }}
                      onMouseUp={() => setMouseState(false)}
                    >
                      <div className="circle" />
                    </div>
                  ))}
                  <div className="circle2" />
                </div>
                <i
                  // style={{
                  //   display: this.toggleSetting(service_item.Service_name)
                  //     ? "block"
                  //     : "none",
                  // }}
                  onClick={() => {
                    //   if (this.toggleSetting(service_item.Service_name)) {
                    //     // this.props.handleHistory("App Configuration");
                    //     this.setState({ ActiveTab: "Configuration" });
                    //     clearTimeout(counterTimeout);
                    //     sessionStorage.removeItem("timer");
                    //     var url = new URL(window.location.href);
                    //     url.searchParams.append(
                    //       "service",
                    //       service_item.Service_name
                    //     );
                    //     window.history.pushState(null, null, url);
                    //   }
                  }}
                  className="material-icons setting_icon"
                >
                  settings
                </i>
              </div>
            ))}
          </div>
          {/* </Scrollbars> */}
        </div>
      </div>
    </div>
  );
}

const _data = [
  {
    slot: "0-2",
    Usecases: [],
    AI: [],
    staticAI: [],
    staticUC: [],
    staticDependent: [],
    disabledService: [],
    Dependent: [],
  },
  {
    slot: "2-4",
    Usecases: [],
    AI: [],
    staticAI: [],
    staticUC: [],
    staticDependent: [],
    disabledService: [],
    Dependent: [],
  },
  {
    slot: "4-6",
    Usecases: [],
    AI: [],
    staticAI: [],
    staticUC: [],
    staticDependent: [],
    disabledService: [],
    Dependent: [],
  },
  {
    slot: "6-8",
    Usecases: [],
    AI: [],
    staticAI: [],
    staticUC: [],
    staticDependent: [],
    disabledService: [],
    Dependent: [],
  },
  {
    slot: "8-10",
    Usecases: [],
    AI: [],
    staticAI: [],
    staticUC: [],
    staticDependent: [],
    disabledService: [],
    Dependent: [],
  },
  {
    slot: "10-12",
    Usecases: [],
    AI: [],
    staticAI: [],
    staticUC: [],
    staticDependent: [],
    disabledService: [],
    Dependent: [],
  },
  {
    slot: "12-14",
    Usecases: [],
    AI: [],
    staticAI: [],
    staticUC: [],
    staticDependent: [],
    disabledService: [],
    Dependent: [],
  },
  {
    slot: "14-16",
    Usecases: [],
    AI: [],
    staticAI: [],
    staticUC: [],
    staticDependent: [],
    disabledService: [],
    Dependent: [],
  },
  {
    slot: "16-18",
    Usecases: [],
    AI: [],
    staticAI: [],
    staticUC: [],
    staticDependent: [],
    disabledService: [],
    Dependent: [],
  },
  {
    slot: "18-20",
    Usecases: [],
    AI: [],
    staticAI: [],
    staticUC: [],
    staticDependent: [],
    disabledService: [],
    Dependent: [],
  },
  {
    slot: "20-22",
    Usecases: [],
    AI: [],
    staticAI: [],
    staticUC: [],
    staticDependent: [],
    disabledService: [],
    Dependent: [],
  },
  {
    slot: "22-24",
    Usecases: [],
    AI: [],
    staticAI: [],
    staticUC: [],
    staticDependent: [],
    disabledService: [],
    Dependent: [],
  },
];

const _time = [
  "0-2",
  "2-4",
  "4-6",
  "6-8",
  "8-10",
  "10-12",
  "12-14",
  "14-16",
  "16-18",
  "18-20",
  "20-22",
  "22-24",
];

const _apiData = {
  // "0-2": {
  //   global: {
  //     Cameras: ["1"],
  //     Usecases: ["Weapon_Detection"],
  //     Dependent: [],
  //     AI: ["Weapon_Detection_AI"],
  //   },
  //   local: {
  //     1: {
  //       Usecases: ["Weapon_Detection"],
  //       AI: ["Weapon_Detection_AI"],
  //       Dependent: [],
  //     },
  //   },
  // },
  "0-2": {
    global: {
      Cameras: [],
      Usecases: [],
      Dependent: [],
      AI: [],
    },
    local: {},
  },
  "2-4": {
    global: {
      Cameras: [],
      Usecases: [],
      Dependent: [],
      AI: [],
    },
    local: {},
  },
  "4-6": {
    global: {
      Cameras: [],
      Usecases: [],
      Dependent: [],
      AI: [],
    },
    local: {},
  },
  "6-8": {
    global: {
      Cameras: [],
      Usecases: [],
      Dependent: [],
      AI: [],
    },
    local: {},
  },
  "8-10": {
    global: {
      Cameras: [],
      Usecases: [],
      Dependent: [],
      AI: [],
    },
    local: {},
  },
  "10-12": {
    global: {
      Cameras: [],
      Usecases: [],
      Dependent: [],
      AI: [],
    },
    local: {},
  },
  "12-14": {
    global: {
      Cameras: [],
      Usecases: [],
      Dependent: [],
      AI: [],
    },
    local: {},
  },
  "14-16": {
    global: {
      Cameras: [],
      Usecases: [],
      Dependent: [],
      AI: [],
    },
    local: {},
  },
  "16-18": {
    global: {
      Cameras: [],
      Usecases: [],
      Dependent: [],
      AI: [],
    },
    local: {},
  },
  "18-20": {
    global: {
      Cameras: [],
      Usecases: [],
      Dependent: [],
      AI: [],
    },
    local: {},
  },
  "20-22": {
    global: {
      Cameras: [],
      Usecases: [],
      Dependent: [],
      AI: [],
    },
    local: {},
  },
  "22-24": {
    global: {
      Cameras: [],
      Usecases: [],
      Dependent: [],
      AI: [],
    },
    local: {},
  },
};
