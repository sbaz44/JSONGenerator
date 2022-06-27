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

  const LoopDataService = (data_, service_, callback) => {
    for (const [data_index, data_value] of data_.entries()) {
      for (const [service_index, service_value] of service_.entries()) {
        callback(data_value, data_index, service_value, service_index);
      }
    }
  };

  const timeslotMouseDown = (i) => {
    let _selectedTimeSlot = _.cloneDeep(selectedTimeSlot);
    let _data = _.cloneDeep(data);
    let _service = _.cloneDeep(Services);
    let elePresent = _.includes(selectedTimeSlot, i);

    // push/remove time from selectedTimeSlot array
    if (!elePresent) {
      _selectedTimeSlot.push(i);
    } else {
      _selectedTimeSlot = _selectedTimeSlot.filter((item) => item != i);
      Loop(_data, (data_ele) => {
        Loop(_service, (_service_ele) => {
          if (data_ele.slot === i) {
            data_ele.disabledService.push(_service_ele.Service_id);
            data_ele.AI.length = 0;
            data_ele.Dependent.length = 0;
            data_ele.Usecases.length = 0;
          }
        });
      });
    }

    //disable Usecases which are out of limits
    if (elePresent) {
    } else {
      let popData = [];
      Loop(_service, (serEle) => {
        if (serEle.Dependent_services.AI.length > deepStreamLimit) {
          popData.push(serEle.Service_id);
        }
      });
      Loop(_data, (data_ele) => {
        if (data_ele.slot === i) {
          data_ele.disabledService = [...popData];
        }
      });
    }
    setData(_data);
    setSelectedTimeSlot([..._selectedTimeSlot]);
    setMouseState(true);
  };

  const usecaseMouseDown = (
    data_item,
    data_index,
    service_item,
    service_index
  ) => {
    let _data = _.cloneDeep(data);
    let _service = _.cloneDeep(Service);
    let dataUC = data_item.Usecases;
    let elePresent = _.includes(data_item.Usecases, service_item.Service_id);

    console.log(elePresent);
    if (!elePresent) {
      _data[data_index].Usecases.push(service_item.Service_id);
      _data[data_index].Usecases = [...new Set(_data[data_index].Usecases)];
      console.log(_data);
      // const result = _.union(
      //   _data[data_index].AI,
      //   service_item.Dependent_services.AI
      // );
      _data[data_index].AI = [
        ..._data[data_index].AI,
        ...service_item.Dependent_services.AI,
      ];
      if (service_item.Category === "Analytics") {
        const _res = _.union(
          _data[data_index].Dependent,
          service_item.Dependent_services.Usecase
        );
        _data[data_index].Dependent = [..._res];
      }
    } else {
      console.log("else");
      const ucIndex = _data[data_index].Usecases.indexOf(
        service_item.Service_id
      );
      _data[data_index].Usecases.splice(ucIndex, 1);
      console.log(ucIndex);
      // LoopDataService(
      //   _data,
      //   _service,
      //   (dataEle, dataIndex, servEle, serIndex) => {
      //     dataEle.disabledService.push(servEle.Service_id);
      //   }
      // );
      console.log(_data[data_index].AI, service_item.Dependent_services.AI);
      LoopDataService(
        _data[data_index].AI,
        service_item.Dependent_services.AI,
        (dataEle, dataIndex, servEle, serIndex) => {
          console.log(dataEle, dataIndex, servEle, serIndex);
          if (dataEle === servEle) {
            const aiIndex = _data[data_index].AI.indexOf(servEle);
            console.log(aiIndex);
            if (aiIndex >= 0) {
              _data[data_index].AI.splice(aiIndex, 1);
            }
          }
          // dataEle.disabledService.push(servEle.Service_id);
        }
      );

      if (service_item.Category === "Analytics") {
        let dArr = _data[data_index].Dependent;
        Loop(service_item.Dependent_services.Usecase, (u_ele) => {
          if (dArr.includes(u_ele)) {
            let index = _data[data_index].Dependent.indexOf(u_ele);
            console.log(index);
            if (index >= 0) {
              _data[data_index].Dependent.splice(index, 1);
            }
          }
        });
      }
    }
    console.log(_data);
    setData([..._data]);
    setMouseState(true);
    verifyLimits(data_item, data_index, service_item, service_index, _data);
  };

  const verifyLimits = (
    data_item,
    data_index,
    service_item,
    service_index,
    data_
  ) => {
    let _data = _.cloneDeep(data_);
    let unique_UC_Dependent = _.union(
      _data[data_index].Dependent,
      _data[data_index].Usecases
    );
    let unique_AI = [...new Set(_data[data_index].AI)];
    console.log(unique_UC_Dependent);
    console.log(unique_AI);
    if (unique_UC_Dependent.length === usecaseLimit) {
      console.log("Usecase limit reached");
      usecaseLimitReached(
        data_item,
        data_index,
        service_item,
        service_index,
        data_
      );
    } else if (unique_AI.length === deepStreamLimit) {
      console.log("DS limit reached");
      deepstreamLimitReached(
        data_item,
        data_index,
        service_item,
        service_index,
        data_
      );
    } else {
      console.log(_data);
      console.log("verifyLimits ELSE");
    }
  };

  const usecaseLimitReached = (
    data_item,
    data_index,
    service_item,
    service_index,
    data_
  ) => {
    console.log("usecaseLimitReached()");
    let _data = _.cloneDeep(data_);
    let _service = _.cloneDeep(Service);
    let _usecases = _.cloneDeep(_data[data_index].Usecases);
    let _AI = _data[data_index].AI;
    console.log(data_);
    Array.prototype.push.apply(_usecases, data_item.Dependent);
    // _usecases = [...new Set(_usecases)];
    Loop(_service, (ele) => {
      if (!_usecases.includes(ele.Service_id)) {
        _data[data_index].disabledService.push(ele.Service_id);
      }
    });
    _data[data_index].disabledService = [
      ...new Set(_data[data_index].disabledService),
    ];
    _data[data_index].Usecases = [...new Set(_data[data_index].Usecases)];
    console.log(_data);
    setData([..._data]);
  };

  const deepstreamLimitReached = (
    data_item,
    data_index,
    service_item,
    service_index,
    data_
  ) => {
    console.log("deepstreamLimitReached()");
    let _data = _.cloneDeep(data_);
    let _service = _.cloneDeep(Service);
    let _usecases = _data[data_index].Usecases;
    let _AI = _data[data_index].AI;

    Loop(_service, (serv_ele) => {
      //checking if Services is not greater than DS Limit
      if (serv_ele.Dependent_services.AI.length <= deepStreamLimit) {
        let arr = _.union(_AI, serv_ele.Dependent_services.AI);
        // console.log(arr);
        if (arr.length > deepStreamLimit) {
          console.log("IF");
          _data[data_index].disabledService.push(serv_ele.Service_id);
          _data[data_index].disabledService = [
            ...new Set(_data[data_index].disabledService),
          ];
        } else {
          console.log("ELSE");

          if (_data[data_index].disabledService.includes(serv_ele.Service_id)) {
            var index = _data[data_index].disabledService.indexOf(
              serv_ele.Service_id
            );
            _data[data_index].disabledService.splice(index, 1);
            _data[data_index].disabledService = [
              ...new Set(_data[data_index].disabledService),
            ];
          }
          // console.log(serv_ele.Service_id);
        }
      } else {
        _data[data_index].disabledService.push(serv_ele.Service_id);
        _data[data_index].disabledService = [
          ...new Set(_data[data_index].disabledService),
        ];
      }
    });
    console.log(_data);
    setData([..._data]);
  };

  const onLoad = () => {
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

  const cameraNotPresent = () => {
    console.log("cameraNotPresent()");
    let _data = _.cloneDeep(data);
    let _service = _.cloneDeep(Service);
    for (let servEle of _service) {
      isAllUCSelected.push(false);
      disabledServices.push(servEle.Service_id);
    }

    LoopDataService(
      _data,
      _service,
      (dataEle, dataIndex, servEle, serIndex) => {
        dataEle.disabledService.push(servEle.Service_id);
      }
    );

    setData([..._data]);
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
                  {service_index + 1}{" "}
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
                        if (
                          !item.disabledService.includes(
                            service_item.Service_id
                          )
                        ) {
                          if (isCamerPresent) {
                          } else {
                            usecaseMouseDown(
                              item,
                              index,
                              service_item,
                              service_index
                            );
                          }
                        }
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
