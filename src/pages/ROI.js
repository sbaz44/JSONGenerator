import React, { Component } from "react";
import "./roi.scss";
import limits from "./limits.json";
import servicess from "./services.json";
import _ from "lodash";
let Services = servicess["Services"];
let Limits = limits["details"]["Limitations"];
let deepStreamLimit = Limits["Deepstream"];
let usecaseLimit = Limits["Usecase"];
let cameraLimit = Limits["Camera"];
let isAllTimeSelected = false;
let isAllUCSelected = [];
let disabledServices = [];

export default class ROI extends Component {
  state = {
    data: [..._data],
    apiData: { ..._apiData },
    time: [..._time],
    selectedTimeSlot: [],
    Service: [...Services],
    mouseState: false,
    DisabledTS: [],
    isCamerPresent: false,
  };

  //reusable functions
  Loop = (arr, callback) => {
    for (let element of arr) {
      callback(element);
    }
  };

  LoopDataService = (data_, service_, callback) => {
    for (const [data_index, data_value] of data_.entries()) {
      for (const [service_index, service_value] of service_.entries()) {
        callback(data_value, data_index, service_value, service_index);
      }
    }
  };

  intersectionService = (services_AI, _activeAI, item_serviceID, data_) => {
    let intersection = services_AI.filter((x) => !_activeAI.includes(x));
    let add = _activeAI.length + intersection.length;
    if (deepStreamLimit < add) {
      return _.union(data_.disabledService, [item_serviceID]);
    } else {
      let uniqueD = [...new Set(data_.disabledService)];
      var ucIndex = uniqueD.indexOf(item_serviceID);
      if (ucIndex >= 0) {
        uniqueD.splice(ucIndex, 1);
        return uniqueD;
      }
    }
  };

  timeslotMouseDown = (i, idx, selectedTimeSlot_) => {
    const { selectedTimeSlot, data, Service, isCamerPresent } = this.state;
    let _selectedTimeSlot = selectedTimeSlot_
      ? _.cloneDeep(selectedTimeSlot_)
      : _.cloneDeep(selectedTimeSlot);
    let _data = _.cloneDeep(data);
    let _service = _.cloneDeep(Service);
    let elePresent = _.includes(_selectedTimeSlot, i);
    console.log(JSON.stringify(_selectedTimeSlot));
    console.log(elePresent, i, idx);
    // console.log(JSON.stringify(_data));
    // push/remove time from selectedTimeSlot array
    if (!elePresent) {
      _selectedTimeSlot.push(i);
    } else {
      _selectedTimeSlot = _selectedTimeSlot.filter((item) => item != i);
      this.Loop(_data, (data_ele) => {
        this.Loop(_service, (_service_ele) => {
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
    if (!elePresent) {
      if (!isCamerPresent) {
        let popData = [];
        this.Loop(_service, (serEle) => {
          if (serEle.Dependent_services.AI.length > deepStreamLimit) {
            popData.push(serEle.Service_id);
          }
        });
        this.Loop(_data, (data_ele) => {
          if (data_ele.slot === i) {
            data_ele.disabledService = [...popData];
          }
        });
        this.setState({
          data: [..._data],
        });
      } else {
        console.log(_data);
        this.cameraPresent(_data, i, idx);
      }
    } else {
      this.setState({
        data: [..._data],
      });
    }
    this.setState({
      mouseState: true,
      selectedTimeSlot: [..._selectedTimeSlot],
    });
  };

  usecaseMouseDown = (
    data_item,
    data_index,
    service_item,
    service_index,
    isIgnore
  ) => {
    console.log("usecaseMouseDown()");
    let _data = _.cloneDeep(this.state.data);
    let elePresent = _.includes(data_item.Usecases, service_item.Service_id);
    console.log(elePresent);
    if (!elePresent) {
      _data[data_index].Usecases.push(service_item.Service_id);
      _data[data_index].Usecases = [...new Set(_data[data_index].Usecases)];
      _data[data_index].AI = [
        ..._data[data_index].AI,
        ...service_item.Dependent_services.AI,
      ];
      if (service_item.Category === "Analytics") {
        console.log("first");
        const _res = _.union(
          _data[data_index].Dependent,
          service_item.Dependent_services.Usecase
        );
        _data[data_index].Dependent = [..._res];
      }
    } else {
      if (isIgnore) {
        return;
      }
      console.log("else");
      //removing UC
      const ucIndex = _data[data_index].Usecases.indexOf(
        service_item.Service_id
      );
      _data[data_index].Usecases.splice(ucIndex, 1);

      //removing AI
      this.Loop(service_item.Dependent_services.AI, (serEle) => {
        let aiIndex = _data[data_index].AI.indexOf(serEle);
        console.log(aiIndex);
        if (aiIndex >= 0) {
          _data[data_index].AI.splice(aiIndex, 1);
        }
      });

      //removing dependent if ANALYTICS
      if (service_item.Category === "Analytics") {
        let dArr = _data[data_index].Dependent;
        this.Loop(service_item.Dependent_services.Usecase, (u_ele) => {
          if (dArr.includes(u_ele)) {
            let depIndex = _data[data_index].Dependent.indexOf(u_ele);
            console.log(depIndex);
            if (depIndex >= 0) {
              _data[data_index].Dependent.splice(depIndex, 1);
            }
          }
        });
      }
    }
    console.table(_data);
    this.setState({
      data: [..._data],
      mouseState: true,
    });

    this.verifyLimits(
      data_item,
      data_index,
      service_item,
      service_index,
      _data
    );
  };
  verifyLimits = (
    data_item,
    data_index,
    service_item,
    service_index,
    data_
  ) => {
    const { isCamerPresent } = this.state;

    let _data = _.cloneDeep(data_);
    let unique_UC_Dependent = _.union(
      _data[data_index].Dependent,
      _data[data_index].Usecases
    );
    let unique_AI = [...new Set(_data[data_index].AI)];

    if (isCamerPresent) {
      unique_UC_Dependent = _.union(
        unique_UC_Dependent,
        _data[data_index].staticDependent,
        _data[data_index].staticUC
      );
      unique_AI = _.union(unique_AI, _data[data_index].staticAI);
    }

    console.log(unique_UC_Dependent);
    console.log(unique_AI);
    if (unique_UC_Dependent.length === usecaseLimit) {
      console.log("Usecase limit reached");
      this.usecaseLimitReached(
        data_item,
        data_index,
        service_item,
        service_index,
        data_
      );
    } else if (unique_AI.length === deepStreamLimit) {
      console.log("DS limit reached");
      this.deepstreamLimitReached(
        data_item,
        data_index,
        service_item,
        service_index,
        data_
      );
    } else {
      console.log(_data);
      console.log("verifyLimits ELSE");
      this.toggleUsecases(
        data_item,
        data_index,
        service_item,
        service_index,
        data_
      );
    }
  };

  usecaseLimitReached = (
    data_item,
    data_index,
    service_item,
    service_index,
    data_
  ) => {
    console.log("usecaseLimitReached()");
    const { selectedTimeSlot, data, Service, isCamerPresent } = this.state;

    let _data = _.cloneDeep(data_);
    let _service = _.cloneDeep(Service);
    let _usecases = _.cloneDeep(_data[data_index].Usecases);
    console.log(data_);
    Array.prototype.push.apply(_usecases, data_item.Dependent);
    console.log(_usecases);
    if (isCamerPresent) {
      Array.prototype.push.apply(_usecases, data_item.staticUC);
      Array.prototype.push.apply(_usecases, data_item.staticDependent);
    }
    this.Loop(_service, (ele) => {
      if (!_usecases.includes(ele.Service_id)) {
        _data[data_index].disabledService.push(ele.Service_id);
      }
    });
    _data[data_index].disabledService = [
      ...new Set(_data[data_index].disabledService),
    ];
    _data[data_index].Usecases = [...new Set(_data[data_index].Usecases)];
    console.log(_data);
    this.setState({ data: [..._data] });
  };

  deepstreamLimitReached = (
    data_item,
    data_index,
    service_item,
    service_index,
    data_
  ) => {
    const { selectedTimeSlot, data, Service, isCamerPresent } = this.state;

    console.log("deepstreamLimitReached()");
    let _data = _.cloneDeep(data_);
    let _service = _.cloneDeep(Service);
    let _AI = _.clone(_data[data_index].AI);
    console.log(_data);

    if (isCamerPresent) {
      _AI = _.union(_AI, _data[data_index].staticAI);
    }
    console.log(_AI);

    this.Loop(_service, (serv_ele) => {
      //checking if Services is not greater than DS Limit
      if (serv_ele.Dependent_services.AI.length <= deepStreamLimit) {
        let arr = _.union(_AI, serv_ele.Dependent_services.AI);
        console.log(arr);
        if (arr.length > deepStreamLimit) {
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
          } else {
            console.log("ELSE2");
            console.log(serv_ele.Service_id);
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
    this.setState({ data: [..._data] });
  };

  toggleUsecases = (
    data_item,
    data_index,
    service_item,
    service_index,
    data_
  ) => {
    const { selectedTimeSlot, data, Service, isCamerPresent } = this.state;
    console.log("toggleUsecases()");
    let _data = _.cloneDeep(data_);
    let _service = _.cloneDeep(Service);
    let unique_AI = _.union(_data[data_index].AI);

    if (isCamerPresent) {
      unique_AI = _.union(unique_AI, _data[data_index].staticAI);
    }
    console.log(unique_AI);
    if (!unique_AI.length) {
      _data[data_index].AI.length = 0;
      _data[data_index].Dependent.length = 0;
      _data[data_index].Usecases.length = 0;
      let popData = [];
      this.Loop(_service, (serEle) => {
        if (serEle.Dependent_services.AI.length > deepStreamLimit) {
          popData.push(serEle.Service_id);
        }
      });
      _data[data_index].disabledService = [...popData];
    } else {
      let popData = [];
      this.Loop(_service, (serEle) => {
        // console.log(serEle.Dependent_services.AI, unique_AI);
        const intersection = serEle.Dependent_services.AI.filter(
          (value) => !unique_AI.includes(value)
        );
        // console.log(intersection);
        let add = unique_AI.length + intersection.length;
        if (add > deepStreamLimit) {
          console.log(serEle.Service_id);
          popData.push(serEle.Service_id);
        } else {
          if (serEle.Category === "Analytics") {
            if (
              serEle.Dependent_services.Usecase.length +
                _data[data_index].Usecases.length +
                1 >
              usecaseLimit
            ) {
              popData.push(serEle.Service_id);
            }
          }
        }
      });
      _data[data_index].disabledService = [...popData];
      console.log("else");
    }
    _data[data_index].disabledService = _.union(
      _data[data_index].disabledService
    );
    console.log(_data);
    this.setState({ data: [..._data] });
  };

  onLoad = () => {
    const { apiData, data, Service, isCamerPresent } = this.state;
    let _apiData = { ...apiData };
    let apiDataKeys = Object.keys(_apiData);
    let cameraLength = 0;
    let _data = _.cloneDeep(data);
    let _service = _.cloneDeep(Service);

    let _DisabledTS = [];
    for (let i = 0; i < apiDataKeys.length; i++) {
      if (_apiData[apiDataKeys[i]].global.Cameras.length) {
        cameraLength += 1;
        Array.prototype.push.apply(
          _data[i].staticUC,
          _apiData[apiDataKeys[i]].global.Usecases
        );
        Array.prototype.push.apply(
          _data[i].staticAI,
          _apiData[apiDataKeys[i]].global.AI
        );
        Array.prototype.push.apply(
          _data[i].staticDependent,
          _apiData[apiDataKeys[i]].global.Dependent
        );
        if (_apiData[apiDataKeys[i]].global.Cameras.length >= cameraLimit) {
          _DisabledTS.push(apiDataKeys[i]);
        }
      }
    }
    console.log(_data);
    if (cameraLength > 0) {
      this.LoopDataService(
        _data,
        _service,
        (dataEle, dataIndex, servEle, serIndex) => {
          dataEle.disabledService.push(servEle.Service_id);
        }
      );
      this.setState({
        data: [..._data],
        isCamerPresent: true,
        DisabledTS: [..._DisabledTS],
      });
      console.log("CAMERA IS PRESENT!");
    } else {
      this.cameraNotPresent();
      console.log("CAMERA IS NOT PRESENT!");
    }
  };

  cameraNotPresent = () => {
    console.log("cameraNotPresent()");
    let _data = _.cloneDeep(this.state.data);
    let _service = _.cloneDeep(this.state.Service);
    for (let servEle of _service) {
      isAllUCSelected.push(false);
      disabledServices.push(servEle.Service_id);
    }

    this.LoopDataService(
      _data,
      _service,
      (dataEle, dataIndex, servEle, serIndex) => {
        dataEle.disabledService.push(servEle.Service_id);
      }
    );
    this.setState({
      data: [..._data],
    });
  };
  cameraPresent = (data_, slot, idx) => {
    console.log("cameraPresent()");
    console.log(data_, slot, idx);

    let _data = _.cloneDeep(data_);
    let _service = [...this.state.Service];
    let _uniqueUCnD = _.union(_data[idx].staticUC, _data[idx].staticDependent);
    let _activeAI = [..._data[idx].staticAI];
    console.log(_uniqueUCnD, _activeAI);
    console.log(_uniqueUCnD.length, usecaseLimit);
    if (_uniqueUCnD.length >= usecaseLimit) {
      this.Loop(_service, (item) => {
        //disable other usecase and DS
        if (!_uniqueUCnD.includes(item.Service_id)) {
          _data[idx].disabledService.push(item.Service_id);
        }
      });
    } else {
      if (deepStreamLimit === _activeAI.length) {
        console.log("deepStreamLimit === _activeAI");
      } else {
        this.Loop(_service, (item) => {
          if (item.Dependent_services.AI.length <= deepStreamLimit) {
            let result = [];
            this.Loop(item.Dependent_services.AI, (ele) => {
              this.Loop(_activeAI, (ele2) => {
                if (ele2 === ele) result.push(true);
                else result.push(false);
              });
            });

            if (!result.includes(true)) {
              if (item.Category === "Analytics") {
                console.log("Analytics");
                //console.log("CATEGORY IS ANALYTIC " + item.Service_id);
                // this.toggleAnalytics2(data_ele, item);
              } else {
                _data[idx].disabledService = [
                  ...this.intersectionService(
                    item.Dependent_services.AI,
                    _activeAI,
                    item.Service_id,
                    _data[idx]
                  ),
                ];
              }
            } else {
              console.log("object2");
              if (item.Category === "Analytics") {
                //console.log("CATEGORY IS ANALYTIC " + item.Service_id);
                // this.toggleAnalytics2(data_ele, item);
              } else {
                _data[idx].disabledService = [
                  ...this.intersectionService(
                    item.Dependent_services.AI,
                    _activeAI,
                    item.Service_id,
                    _data[idx]
                  ),
                ];
                if (item.Service_id === "Safety_Gear_Missing_Alert") {
                  console.table(_data[idx].disabledService);
                }
              }
            }
          } else {
            _data[idx].disabledService = [
              ..._.union(_data[idx].disabledService, [item.Service_id]),
            ];
          }
        });
      }
    }
    console.log(_data);
    this.setState({
      data: [..._data],
    });
  };

  toggleTimeSlot = async () => {
    const { time } = this.state;
    let _data = _.cloneDeep(this.state.data);
    let _selectedTimeSlot = _.cloneDeep(this.state.selectedTimeSlot);
    if (this.state.isCamerPresent) {
      console.log(isAllTimeSelected);
      if (isAllTimeSelected) {
        isAllUCSelected = [];
        _selectedTimeSlot = [];
        for (let i = 0; i < time.length; i++) {
          await this.setState({ selectedTimeSlot: _selectedTimeSlot });
          if (!this.state.DisabledTS.includes(time[i])) {
            this.timeslotMouseDown(time[i], i, _selectedTimeSlot);
            _selectedTimeSlot.push(time[i]);
          }
        }
      } else {
        isAllUCSelected = [];
        this.Loop(this.state.Service, (servEle) => {
          isAllUCSelected.push(false);
          disabledServices.push(servEle.Service_id);
        });

        this.Loop(_data, (data_ele) => {
          this.Loop(this.state.Service, (_service_ele) => {
            data_ele.disabledService.push(_service_ele.Service_id);
            data_ele.disabledService = [...new Set(data_ele.disabledService)];
          });
          data_ele.AI.length = 0;
          data_ele.Dependent.length = 0;
          data_ele.Usecases.length = 0;
        });

        this.setState({ selectedTimeSlot: [], data: [..._data] });
      }
    } else {
    }
    console.log(_selectedTimeSlot);
    // setSelectedTimeSlot([..._selectedTimeSlot]);
  };

  toggleUCSlot = async (service_item, service_index) => {
    let _data = _.cloneDeep(this.state.data);
    let _selectedTimeSlot = _.cloneDeep(this.state.selectedTimeSlot);
    console.log(
      isAllUCSelected,
      disabledServices,
      _selectedTimeSlot,
      isAllTimeSelected
    );
    for (let i = 0; i < _data.length; i++) {
      for (let j = 0; j < _selectedTimeSlot.length; j++) {
        if (_selectedTimeSlot[j] === _data[i].slot) {
          if (this.state.isCamerPresent) {
            if (this.state.DisabledTS.length > 0) {
              if (this.state.DisabledTS.includes(_selectedTimeSlot[j])) {
                _data[i].disabledService.push(service_item.Service_name);
              } else {
                this.usecaseMouseDown(_data[i], i, service_item, service_index);
              }
            } else {
              if (isAllUCSelected[service_index]) {
                if (_data[i].Usecases.includes(service_item.Service_id)) {
                  if (
                    service_item.Dependent_services.AI.length <= deepStreamLimit
                  ) {
                    this.setState({ data: _data }, () =>
                      this.usecaseMouseDown(
                        _data[i],
                        i,
                        service_item,
                        service_index,
                        true
                      )
                    );
                  }
                } else {
                  if (
                    !_data[i].disabledService.includes(service_item.Service_id)
                  ) {
                    let indexx = _data[i].disabledService.indexOf(
                      service_item.Service_id
                    );
                    if (indexx >= 0) {
                      _data[i].disabledService.splice(indexx, 1);
                    }
                    this.setState({ data: _data }, () =>
                      this.usecaseMouseDown(
                        _data[i],
                        i,
                        service_item,
                        service_index,
                        false
                      )
                    );
                  }
                }
              } else {
                if (
                  !_data[i].disabledService.includes(service_item.Service_id)
                ) {
                  this.setState({ data: _data }, () =>
                    this.usecaseMouseDown(
                      _data[i],
                      i,
                      service_item,
                      service_index,
                      false
                    )
                  );
                } else {
                }
              }

              // this.usecaseMouseDown2(_data[i], service_index, service_item, i);
            }
          } else {
            if (isAllUCSelected[service_index]) {
              if (_data[i].Usecases.includes(service_item.Service_id)) {
                // if (
                //   service_item.Dependent_services.AI.length <= deepStreamLimit
                // ) { // extra added for testing[31/1]
                this.setState({ data: _data }, () =>
                  this.usecaseMouseDown(
                    _data[i],
                    i,
                    service_item,
                    service_index,
                    true
                  )
                );
                // }
              } else {
                if (
                  !_data[i].disabledService.includes(service_item.Service_id)
                ) {
                  let indexx = _data[i].disabledService.indexOf(
                    service_item.Service_id
                  );
                  if (indexx >= 0) {
                    _data[i].disabledService.splice(indexx, 1);
                  }

                  this.setState({ data: [..._data] }, () =>
                    this.usecaseMouseDown(
                      _data[i],
                      i,
                      service_item,
                      service_index,
                      false
                    )
                  );
                }
              }
            } else {
              if (!_data[i].disabledService.includes(service_item.Service_id)) {
                this.setState({ data: _data }, () =>
                  this.usecaseMouseDown(
                    _data[i],
                    i,
                    service_item,
                    service_index,
                    false
                  )
                );
              }
            }
          }
        }
      }
    }
  };

  componentDidMount() {
    this.onLoad();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.data !== this.state.data) {
      this.renderIsAllSelected();
    }
  }
  renderIsAllSelected = () => {
    let _data = _.cloneDeep(this.state.data);
    let _service = [...this.state.Service];
    let _selectedTimeSlot = _.cloneDeep(this.state.selectedTimeSlot);
    let _DisabledTS = _.cloneDeep(this.state.DisabledTS);
    let _add = [];
    Array.prototype.push.apply(_add, _DisabledTS);
    Array.prototype.push.apply(_add, _selectedTimeSlot);
    if (_add.length === 12) {
      isAllTimeSelected = true;
    } else {
      isAllTimeSelected = false;
    }
    let _i = 0;
    for (let servEle of _service) {
      let count = 0;
      let count2 = 0;
      for (let dataEle of _data) {
        if (dataEle.disabledService.includes(servEle.Service_id)) {
          count += 1;
        }
        if (dataEle.Usecases.includes(servEle.Service_id)) {
          count2 += 1;
        }
      }
      if (count2 === 12) {
        isAllUCSelected[_i] = true;
      } else isAllUCSelected[_i] = false;
      if (count === 12) {
        disabledServices.push(servEle.Service_id);
        disabledServices = [...new Set(disabledServices)];
      } else {
        if (count === 0) {
          let indexx = disabledServices.indexOf(servEle.Service_id);
          if (indexx >= 0) {
            disabledServices.splice(indexx, 1);
          }
        } else {
          let _count = 0;
          for (let i = 0; i < _data.length; i++) {
            if (_data[i].disabledService.includes(servEle.Service_id)) {
              _count += 1;
            }
            if (_data[i].Usecases.includes(servEle.Service_id)) {
              _count += 1;
            }
          }
          if (_count === 12) {
            isAllUCSelected[_i] = true;
          } else {
            let indexx = disabledServices.indexOf(servEle.Service_id);
            if (indexx >= 0) {
              disabledServices.splice(indexx, 1);
            }
            isAllUCSelected[_i] = false;
          }
        }
      }
      _i++;
    }

    this.setState({ dummy: "" });
  };
  render() {
    const {
      data,
      mouseState,
      DisabledTS,
      time,
      Service,
      selectedTimeSlot,
      isCamerPresent,
    } = this.state;
    return (
      <div className="roiContainer">
        {console.log("MOUSE STATE: " + mouseState)}
        <div className="containerr">
          <div className="timeline-header">
            <p className="h">Time (24 Hrs)</p>
            <div className="timeline">
              {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22].map((item) => (
                <div key={item} className="time">
                  <p>{item}</p>
                </div>
              ))}
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
              style={{
                backgroundColor: _.isEqual(DisabledTS, time) ? "gray" : null,
              }}
              onMouseEnter={() => this.setState({ mouseState: false })}
              onMouseLeave={() => this.setState({ mouseState: false })}
              onClick={() => {
                if (!_.isEqual(DisabledTS, time)) {
                  isAllTimeSelected = !isAllTimeSelected;
                  this.toggleTimeSlot();
                }
              }}
            />
            <div
              className="timeline"
              onMouseLeave={() => this.setState({ mouseState: false })}
            >
              {data.map((item, idx) => (
                <div
                  key={item.slot + "1020"}
                  className={
                    selectedTimeSlot.includes(item.slot)
                      ? "child activeslot"
                      : "child"
                  }
                  style={{
                    backgroundColor: DisabledTS.includes(item.slot)
                      ? "gray"
                      : "",
                    cursor: DisabledTS.includes(item.slot)
                      ? "not-allowed"
                      : "default",
                  }}
                  onMouseDown={() => {
                    if (!DisabledTS.includes(item.slot)) {
                      this.timeslotMouseDown(item.slot, idx);
                    }
                  }}
                  onMouseEnter={() => {
                    if (mouseState) {
                      if (!DisabledTS.includes(item.slot)) {
                        this.timeslotMouseDown(item.slot, idx);
                      }
                    }
                  }}
                  onMouseUp={() => this.setState({ mouseState: false })}
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
                    className={
                      isAllUCSelected[service_index]
                        ? "select_all all_selected"
                        : "select_all"
                    }
                    onMouseEnter={() => this.setState({ mouseState: false })}
                    onMouseLeave={() => this.setState({ mouseState: false })}
                    style={{
                      backgroundColor: disabledServices.includes(
                        service_item.Service_id
                      )
                        ? "gray"
                        : null,
                      cursor: disabledServices.includes(service_item.Service_id)
                        ? "not-allowed"
                        : "pointer",
                    }}
                    onClick={() => {
                      if (selectedTimeSlot.length !== 0) {
                        if (
                          !disabledServices.includes(service_item.Service_id)
                        ) {
                          isAllUCSelected[service_index] =
                            !isAllUCSelected[service_index];
                          this.toggleUCSlot(service_item, service_index);
                        }
                      }
                    }}
                  />
                  <div
                    className="dummy"
                    onMouseLeave={() => this.setState({ mouseState: false })}
                    onMouseEnter={() => this.setState({ mouseState: false })}
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
                              this.usecaseMouseDown(
                                item,
                                index,
                                service_item,
                                service_index
                              );
                            } else {
                              this.usecaseMouseDown(
                                item,
                                index,
                                service_item,
                                service_index
                              );
                            }
                          }
                        }}
                        onMouseEnter={() => {
                          if (mouseState) {
                            if (
                              !item.disabledService.includes(
                                service_item.Service_id
                              )
                            ) {
                              this.usecaseMouseDown(
                                item,
                                service_index,
                                service_item,
                                index
                              );
                              // if (isCamerPresent) {
                              //   this.usecaseMouseDown(
                              //     item,
                              //     service_index,
                              //     service_item,
                              //     index
                              //   );
                              // } else {
                              //   this.usecaseMouseDown(
                              //     item,
                              //     service_index,
                              //     service_item,
                              //     index
                              //   );
                              // }
                            }
                          }
                        }}
                        onMouseUp={() => this.setState({ mouseState: false })}
                      >
                        <div className="circle" />
                      </div>
                    ))}
                    <div className="circle2" />
                  </div>
                  {settingIcon(() => {})}
                  {/* <i
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
                  </i> */}
                </div>
              ))}
            </div>
            {/* </Scrollbars> */}
          </div>
        </div>
      </div>
    );
  }
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
  "0-2": {
    global: {
      Cameras: ["1"],
      Usecases: ["Weapon_Detection"],
      Dependent: [],
      AI: ["Weapon_Detection_AI"],
    },
    local: {
      1: {
        Usecases: ["Weapon_Detection"],
        AI: ["Weapon_Detection_AI"],
        Dependent: [],
      },
    },
  },
  "2-4": {
    global: {
      Cameras: ["1"],
      Usecases: ["Weapon_Detection"],
      Dependent: [],
      AI: ["Weapon_Detection_AI"],
    },
    local: {
      1: {
        Usecases: ["Weapon_Detection"],
        AI: ["Weapon_Detection_AI"],
        Dependent: [],
      },
    },
  },
  // "0-2": {
  //   global: {
  //     Cameras: [],
  //     Usecases: [],
  //     Dependent: [],
  //     AI: [],
  //   },
  //   local: {},
  // },
  // "2-4": {
  //   global: {
  //     Cameras: [],
  //     Usecases: [],
  //     Dependent: [],
  //     AI: [],
  //   },
  //   local: {},
  // },
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

const settingIcon = (onClick) => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="setting_icon"
    onClick={onClick}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.0028 9.63158C10.6438 9.63158 9.54209 10.692 9.54209 12C9.54209 13.308 10.6438 14.3684 12.0028 14.3684C13.3618 14.3684 14.4635 13.308 14.4635 12C14.4635 10.692 13.3618 9.63158 12.0028 9.63158ZM7.90162 12C7.90162 9.81993 9.73778 8.05263 12.0028 8.05263C14.2678 8.05263 16.104 9.81993 16.104 12C16.104 14.1801 14.2678 15.9474 12.0028 15.9474C9.73778 15.9474 7.90162 14.1801 7.90162 12Z"
      fill="#030D45"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.4013 12L20.6372 12.1317C21.9353 12.8564 22.384 14.4527 21.6424 15.7085L20.1373 18.2571C19.3866 19.5284 17.7029 19.9668 16.3886 19.2331L16.1861 19.12V19.3684C16.1861 20.8218 14.962 22 13.452 22H10.4674C8.95737 22 7.73326 20.8218 7.73326 19.3684V19.1537L7.63601 19.2093C6.32014 19.9618 4.61882 19.5281 3.86247 18.2473L2.35757 15.699C1.62153 14.4526 2.05745 12.8685 3.33798 12.1362L3.57614 12L3.33798 11.8638C2.05745 11.1315 1.62153 9.5474 2.35756 8.30102L3.86247 5.75268C4.61882 4.47192 6.32014 4.0382 7.63601 4.79069L7.73326 4.84631V4.63158C7.73326 3.17819 8.95737 2 10.4674 2H13.452C14.962 2 16.1861 3.1782 16.1861 4.63158V4.87996L16.3886 4.76691C17.7029 4.03322 19.3866 4.47158 20.1373 5.74292L21.6424 8.29153C22.384 9.54727 21.9353 11.1436 20.6372 11.8683L20.4013 12ZM18.7627 12.9106C18.0361 12.5049 18.0361 11.4951 18.7627 11.0894L19.8141 10.5025C20.3334 10.2126 20.5129 9.57406 20.2162 9.07176L18.7112 6.52315C18.4108 6.01462 17.7374 5.83928 17.2117 6.13275L16.188 6.70421C15.4589 7.11123 14.5457 6.6049 14.5457 5.79366V4.63158C14.5457 4.05023 14.056 3.57895 13.452 3.57895H10.4674C9.86337 3.57895 9.37373 4.05023 9.37373 4.63158V5.77123C9.37373 6.5874 8.45047 7.09307 7.72146 6.67618L6.79807 6.14812C6.27172 5.84713 5.5912 6.02061 5.28866 6.53292L3.78375 9.08126C3.48933 9.57981 3.6637 10.2135 4.17591 10.5064L5.20531 11.095C5.91867 11.503 5.91867 12.497 5.20531 12.905L4.17591 13.4936C3.6637 13.7865 3.48933 14.4202 3.78375 14.9187L5.28866 17.4671C5.5912 17.9794 6.27172 18.1529 6.79807 17.8519L7.72146 17.3238C8.45047 16.9069 9.37373 17.4126 9.37373 18.2288V19.3684C9.37373 19.9498 9.86337 20.4211 10.4674 20.4211H13.452C14.056 20.4211 14.5457 19.9498 14.5457 19.3684V18.2063C14.5457 17.3951 15.4589 16.8888 16.188 17.2958L17.2117 17.8672C17.7374 18.1607 18.4108 17.9854 18.7112 17.4768L20.2162 14.9282C20.5129 14.4259 20.3334 13.7874 19.8141 13.4975L18.7627 12.9106Z"
      fill="#030D45"
    />
  </svg>
);
