import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import App2 from "../App2";
import { axiosApiInstance } from "../helpers/request";
import { useHistory } from "react-router";
import Header from "../components/Header";
import Sidenav from "../components/Sidenav";
import Inputbox from "../components/Inputbox";
import Arrow from "../arrow.png";
import {
  Form,
  TextField,
  SelectField,
  SubmitButton,
  RadioField,
  CheckboxField,
} from "../FormElement";
import * as Yup from "yup";
const InputBox = (data) => {
  return (
    <div className="input-container">
      <label>Key</label>
      <input
        type="text"
        value={data.value}
        onChange={data.onChange}
        onFocus={data.onFocus}
      />
      {data.remove && (
        <input type="button" value="remove" onClick={data.removeInput} />
      )}
      <br />
      {data.remove && (
        <label>
          Required?
          <input
            type="checkbox"
            value={data.required}
            defaultChecked={data.required}
            onChange={data.checkBoxHandle}
          />
        </label>
      )}
      {data.remove && (
        <label>
          Only Number?
          <input
            type="checkbox"
            value={data.isNumber}
            defaultChecked={data.isNumber}
            onChange={data.checkNumberHandle}
          />
        </label>
      )}
    </div>
  );
};

const Dropbox = (data) => {
  const optionHandle = (e, i) => {
    return data.optionHandlee(e, i);
  };
  return (
    <div className="drop-container">
      <label> No of options:</label>
      <select
        // value={this.state.value}
        onChange={data.selectChange}
      >
        <option value="" disabled selected></option>

        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      {data.options.map((item, index) => {
        return (
          <InputBox
            key={index + 458}
            value={item}
            onFocus={data.onFocus}
            onChange={(e) => optionHandle(e, index)}
            remove={false}
          />
        );
      })}
    </div>
  );
};

const Radiobox = (data) => {
  const optionHandle = (e, i) => {
    return data.optionHandlee(e, i);
  };
  return (
    <div className="drop-container">
      {/* <input type="button" value="remove" onClick={data.removeInput} /> */}

      <label> No of options:</label>
      <select
        // value={this.state.value}
        onChange={data.selectChange}
      >
        <option value="" disabled selected></option>

        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      {data.options.map((item, index) => {
        return (
          <InputBox
            key={index + 458}
            value={item}
            onFocus={data.onFocus}
            onChange={(e) => optionHandle(e, index)}
            remove={false}
          />
        );
      })}
    </div>
  );
};

const Checkbox = (data) => {
  const optionHandle = (e, i) => {
    return data.optionHandlee(e, i);
  };
  return (
    <div className="drop-container">
      {/* <input type="button" value="remove" onClick={data.removeInput} /> */}

      <label> No of options:</label>
      <select
        // value={this.state.value}
        onChange={data.selectChange}
      >
        <option value="" disabled selected></option>

        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      {data.options.map((item, index) => {
        return (
          <InputBox
            key={index + 458}
            value={item}
            onFocus={data.onFocus}
            onChange={(e) => optionHandle(e, index)}
            remove={false}
          />
        );
      })}
    </div>
  );
};

const SubType = (data) => {
  return <div className="sub-child">{data.children}</div>;
};

export default function Usecase() {
  let history = useHistory();

  const [elementsList, setElementList] = useState([]);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [formData, setFormData] = useState({});
  const [validationSchema, setValidationSchema] = useState({});

  const inputClick = () => {
    const data = [...elementsList];
    let obj = {
      elementName: "element" + data.length + 1,
      type: "text",
      label: "Key name",
      required: true,
      options: {
        isNumber: false,
      },
    };
    // let key = "element" + Object.keys(elementsList).length;
    // data[key] = obj;
    data.push(obj);
    setElementList(data);
  };

  const dropClick = () => {
    const data = [...elementsList];
    let obj = {
      elementName: "element" + data.length + 1,
      type: "select",
      label: "Label",
      required: true,
      options: {
        labels: [],
      },
    };
    // let key = "element" + Object.keys(elementsList).length;
    data.push(obj);
    setElementList(data);
  };

  const radioClick = () => {
    const data = [...elementsList];
    let obj = {
      elementName: "element" + data.length + 1,
      type: "radio",
      label: "Label",
      required: true,
      options: {
        labels: [],
      },
    };
    // let key = "element" + Object.keys(elementsList).length;
    data.push(obj);
    setElementList(data);
  };

  const checkboxClick = () => {
    const data = [...elementsList];
    let obj = {
      elementName: "element" + data.length + 1,
      type: "checkbox",
      label: "Label",
      required: true,
      options: [],
    };
    // let key = "element" + Object.keys(elementsList).length;
    data.push(obj);
    setElementList(data);
  };

  const handleChange = (event, index) => {
    let _elementList = [...elementsList];
    _elementList[index].subType = event.target.value;
    setElementList(_elementList);
  };

  const checkBoxHandle = (i) => {
    const data = [...elementsList];
    let required = data[i].required;
    data[i].required = !required;
    setElementList(data);
  };

  const removeInput = (i) => {
    const data = [...elementsList];
    data.splice(i, 1);
    setElementList(data);
  };

  const downloadJSON = async () => {
    // const elementData = {...elementsList};
    // let data = {
    //   data: elementData,
    // };
    // console.log(data);
    // const fileName = "file";
    // const json = JSON.stringify(data);
    // const blob = new Blob([json], { type: "application/json" });
    // const href = await URL.createObjectURL(blob);
    // const link = document.createElement("a");
    // link.href = href;
    // link.download = fileName + ".json";
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    setIsAdded(true);
    // console.log(elementsList.data);
  };

  const postData = async () => {
    let data = {
      serviceId: localStorage.getItem("serviceID"),
      details: elementsList,
    };
    let res = await axiosApiInstance.post(
      "service_mgmt/metadata/usecase",
      data
    );
    console.log(res);
    history.push("/analytics");
  };

  // ----XXX----

  const addSubtype = () => {
    let _elementList = [...elementsList];
    let obj = {
      subType: "",
      isOpen: true,
      elements: [],
    };

    _elementList.push(obj);
    setElementList(_elementList);
  };

  const addtype = (i) => {
    let _elementList = [...elementsList];
    let obj = {
      elementName: "element" + (_elementList[i].elements.length + 1) + i,
      type: "text",
      label: "Key name",
      required: false,
      isNumber: false,
      options: [],
    };
    _elementList[i].elements.push(obj);
    setElementList(_elementList);
  };

  const handleTypeDD = (e, item_i, ele_i) => {
    let _elementList = [...elementsList];
    _elementList[item_i].elements[ele_i].type = e.target.value;
    setElementList(_elementList);
  };

  const handleRequired = (item_i, ele_i) => {
    let _elementList = [...elementsList];
    let required = _elementList[item_i].elements[ele_i].required;
    _elementList[item_i].elements[ele_i].required = !required;
    setElementList(_elementList);
  };

  const handleIsNumber = (item_i, ele_i) => {
    let _elementList = [...elementsList];
    let isNumber = _elementList[item_i].elements[ele_i].isNumber;
    _elementList[item_i].elements[ele_i].isNumber = !isNumber;
    setElementList(_elementList);
  };

  const handleKeyChange = (e, item_i, ele_i) => {
    let _elementList = [...elementsList];
    _elementList[item_i].elements[ele_i].label = e.target.value;
    setElementList(_elementList);
  };

  const selectChange = (event, index, ele_i) => {
    const _elementList = [...elementsList];
    _elementList[index].elements[ele_i].options = [];
    for (let i = 0; i < event.target.value; i++) {
      _elementList[index].elements[ele_i].options.push("");
    }
    setElementList(_elementList);
  };

  const optionChange = (e, option_i, index, ele_i) => {
    const _elementList = [...elementsList];
    _elementList[index].elements[ele_i].options[option_i] = e.target.value;
    setElementList(_elementList);
  };

  const getFormElement = (elementName, elementSchema) => {
    console.log({ elementName, elementSchema });
    const props = {
      name: elementName,
      label: elementSchema.label,
      options: elementSchema.options,
      isNumber: elementSchema.isNumber,
    };

    if (elementSchema.type === "text" || elementSchema.type === "email") {
      return <TextField {...props} />;
    }

    if (elementSchema.type === "select") {
      return <SelectField {...props} />;
    }

    if (elementSchema.type === "radio") {
      return <RadioField {...props} />;
    }

    if (elementSchema.type === "checkbox") {
      return <CheckboxField {...props} />;
    }
  };

  const initForm = () => {
    let __formData = {};
    let _validationSchema = {};
    if (activeTab === "") {
      return;
    }
    for (var elementItem of elementsList) {
      console.log(elementItem);
      if (elementItem.subtime) {
        for (let item of elementItem.elements) {
          console.log(item);
          __formData[item.elementName] = "";
          __formData[item.label] = "";
          if (item.type === "text") {
            if (item.isNumber) {
              _validationSchema[item.elementName] = Yup.number();
            } else {
              _validationSchema[item.elementName] = Yup.string();
            }
          } else if (item.type === "email") {
            _validationSchema[item.elementName] = Yup.string().email();
          } else if (item.type === "select") {
            _validationSchema[item.elementName] = Yup.string().oneOf(
              item.options.map((o) => o)
            );
          } else if (item.type === "radio") {
            _validationSchema[item.elementName] = Yup.string().oneOf(
              item.options.map((o) => o)
            );
          } else if (item.type === "checkbox") {
            _validationSchema[item.elementName] = Yup.array()
              .required()
              .min(1, "Please select atleast one option");
          }
          if (item.required) {
            _validationSchema[item.elementName] =
              _validationSchema[item.elementName].required("Required");
          }
        }
      }
    }
    console.log({ __formData, _validationSchema });

    setFormData(__formData);
    setValidationSchema(Yup.object().shape({ ..._validationSchema }));
  };

  useEffect(() => {
    initForm(elementsList);
  }, [elementsList, activeTab]);

  const onSubmit = (values, { setSubmitting, resetForm, setStatus }) => {
    console.log("SUBMIT!!");
    console.log(values);
    // setSubmitting(false);
  };
  return (
    <div className="service-wrapper">
      {console.log(elementsList)}
      <Header />
      <div className="flex">
        <Sidenav />
        <div className="service-preview">
          <Form
            enableReinitialize
            initialValues={formData}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {elementsList.length > 0 && (
              <div className="subTContainer">
                <div className="sub-item-container">
                  {elementsList.map((item, index) => (
                    <p
                      className="sub-item"
                      style={{
                        backgroundColor:
                          item.subType === activeTab && "rgb(95, 243, 248)",
                        color: item.subType === activeTab && "#fff",
                        border:
                          item.subType === activeTab &&
                          "2px solid rgb(95, 243, 248)",
                      }}
                      key={item.subType}
                      onClick={() => setActiveTab(item.subType)}
                    >
                      {item.subType}
                    </p>
                  ))}
                </div>
                <div className="active-sub-item-container">
                  {elementsList.map((item, index) => {
                    if (item.subType === activeTab) {
                      return (
                        <div className="element-preview">
                          {item.elements.map((ele_item, ele_index) => (
                            <div
                              className="sub-input"
                              key={ele_item.elementName}
                            >
                              {getFormElement(ele_item.elementName, ele_item)}
                            </div>
                          ))}
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            )}

            <SubmitButton title="Submit" />
          </Form>
        </div>
        <div className="service-subType">
          <div
            className="flex"
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              margin: "10px 0",
            }}
          >
            <h4>Service Subtype</h4>
            <div className="btn-blue" onClick={addSubtype}>
              +
            </div>
          </div>
          <div className="subType-Container">
            {elementsList.map((item, index) => (
              <SubType
                key={index + 12}
                onaddType={() => addtype(index)}
                handleChange={(e) => handleChange(e, index)}
                key={"id" + index}
              >
                <div
                  className="flex"
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Inputbox
                    label="Name"
                    onChange={(e) => handleChange(e, index)}
                    value={elementsList[index].subType}
                    // onFocus={() => {
                    //   let data = { ...errors };
                    //   data.isResrcResEmpty = false;
                    //   setErrors(data);
                    // }}
                    // error={errors["isResrcResEmpty"]}
                  />
                  <img src={Arrow} className="arrow" />
                </div>
                {item.elements.length > 0 &&
                  item.elements.map((elements_item, elements_i) => (
                    <React.Fragment>
                      <div className="elements-primary">
                        <label>
                          Required?
                          <input
                            type="checkbox"
                            value={elements_item.required}
                            defaultChecked={elements_item.required}
                            onChange={() => handleRequired(index, elements_i)}
                          />
                        </label>
                        <select
                          value={elements_item.type}
                          onChange={(e) => handleTypeDD(e, index, elements_i)}
                        >
                          <option value="text">text</option>
                          <option value="select">dropdown</option>
                          <option value="radio">radio</option>
                          <option value="checkbox">checkbox</option>
                        </select>
                        <input
                          type="text"
                          className="ele_key"
                          placeholder="Key Name"
                          value={elements_item.label}
                          onFocus={(event) => event.target.select()}
                          onChange={(e) =>
                            handleKeyChange(e, index, elements_i)
                          }
                        />
                      </div>
                      <div className="element-dynamic">
                        {elements_item.type === "text" && (
                          <label>
                            Only Number?
                            <input
                              type="checkbox"
                              value={elements_item.isNumber}
                              defaultChecked={elements_item.isNumber}
                              onChange={() => handleIsNumber(index, elements_i)}
                            />
                          </label>
                        )}
                        {elements_item.type === "select" && (
                          <Dropbox
                            key={index + 98}
                            options={elements_item.options}
                            onFocus={(event) => event.target.select()}
                            // onChange={(e) => handleChange(e, index)}
                            selectChange={(e) =>
                              selectChange(e, index, elements_i)
                            }
                            optionHandlee={(e, option_i) => {
                              optionChange(e, option_i, index, elements_i);
                            }}
                            removeInput={() => removeInput(index)}
                          />
                        )}

                        {elements_item.type === "radio" && (
                          <Radiobox
                            key={index + 36}
                            options={elements_item.options}
                            onChange={(e) => handleChange(e, index)}
                            selectChange={(e) =>
                              selectChange(e, index, elements_i)
                            }
                            onFocus={(event) => event.target.select()}
                            optionHandlee={(e, option_i) => {
                              optionChange(e, option_i, index, elements_i);
                            }}
                            removeInput={() => removeInput(index)}
                          />
                        )}

                        {elements_item.type === "checkbox" && (
                          <Checkbox
                            key={index + 48}
                            options={elements_item.options}
                            onFocus={(event) => event.target.select()}
                            selectChange={(e) =>
                              selectChange(e, index, elements_i)
                            }
                            optionHandlee={(e, option_i) => {
                              optionChange(e, option_i, index, elements_i);
                            }}
                            removeInput={() => removeInput(index)}
                          />
                        )}
                      </div>
                    </React.Fragment>
                  ))}
                <div className="btn-container2">
                  <div className="btn-blue2" onClick={() => addtype(index)}>
                    +
                  </div>
                </div>
              </SubType>
            ))}
          </div>
        </div>
      </div>
      {/* <div className="btn-container">
        <button onClick={inputClick}>Add Inputbox</button>
        <button onClick={dropClick}>Add Dropdown</button>
        <button onClick={radioClick}>Add Radio Button</button>
        <button onClick={checkboxClick}>Add Checkbox</button>
      </div> */}
      {/* <div className="container">
        {elementsList.map((item, index) => {
          if (item.type === "text") {
            return (
              <InputBox
                key={index + 122}
                value={item.label}
                required={item.required}
                isNumber={item.isNumber}
                onChange={(e) => handleChange(e, index)}
                onFocus={(event) => event.target.select()}
                remove
                removeInput={() => removeInput(index)}
                checkBoxHandle={() => checkBoxHandle(index)}
                checkNumberHandle={() => checkNumberHandle(index)}
              />
            );
          }
          if (item.type === "select") {
            return (
              <Dropbox
                key={index + 98}
                labelValue={item.label}
                required={item.required}
                options={item.options.labels}
                onFocus={(event) => event.target.select()}
                onChange={(e) => handleChange(e, index)}
                selectChange={(e) => selectChange(e, index)}
                optionHandlee={(e, value) => {
                  optionChange(e, value, index);
                }}
                removeInput={() => removeInput(index)}
                checkBoxHandle={() => checkBoxHandle(index)}
              />
            );
          }
          if (item.type === "radio") {
            return (
              <Radiobox
                key={index + 36}
                labelValue={item.label}
                options={item.options.labels}
                required={item.required}
                onChange={(e) => handleChange(e, index)}
                selectChange={(e) => selectChange(e, index)}
                onFocus={(event) => event.target.select()}
                optionHandlee={(e, value) => {
                  optionChange(e, value, index);
                }}
                removeInput={() => removeInput(index)}
                checkBoxHandle={() => checkBoxHandle(index)}
              />
            );
          }
          if (item.type === "checkbox") {
            return (
              <Checkbox
                key={index + 48}
                labelValue={item.label}
                required={item.required}
                options={item.options.labels}
                onFocus={(event) => event.target.select()}
                onChange={(e) => handleChange(e, index)}
                selectChange={(e) => selectChange(e, index)}
                optionHandlee={(e, value) => {
                  optionChange(e, value, index);
                }}
                removeInput={() => removeInput(index)}
                checkBoxHandle={() => checkBoxHandle(index)}
              />
            );
          } else return null;
        })}
      </div> */}
      {/* {elementsList.length > 0 && (
        <button onClick={downloadJSON}>Download JSON</button>
      )} */}

      {/* <pre>{JSON.stringify(elementsList, null, 4)}</pre>
      {isAdded && <App2 data={elementsList} />} */}

      {/* <Button name="Submit" onClick={postData} /> */}
    </div>
  );
}
