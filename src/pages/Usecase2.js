import { useState } from "react";
import Button from "../components/Button";
import App2 from "../App2";
import { axiosApiInstance } from "../helpers/request";
import { useHistory } from "react-router";
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
      <label>Dropdown label</label>
      <input
        type="text"
        value={data.labelValue}
        onChange={data.onChange}
        onFocus={data.onFocus}
      />
      <input type="button" value="remove" onClick={data.removeInput} />
      <br />
      <label>
        Required?
        <input
          type="checkbox"
          value={data.required}
          defaultChecked={data.required}
          onChange={data.checkBoxHandle}
        />
      </label>
      <br />
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
      <label>Radio label</label>
      <input
        type="text"
        value={data.labelValue}
        onChange={data.onChange}
        onFocus={data.onFocus}
      />
      <input type="button" value="remove" onClick={data.removeInput} />
      <br />
      <label>
        Required?
        <input
          type="checkbox"
          value={data.required}
          defaultChecked={data.required}
          onChange={data.checkBoxHandle}
        />
      </label>
      <br />

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
      <label>Checkbox label</label>
      <input
        type="text"
        value={data.labelValue}
        onChange={data.onChange}
        onFocus={data.onFocus}
      />
      <input type="button" value="remove" onClick={data.removeInput} />
      <br />
      <label>
        Required?
        <input
          type="checkbox"
          value={data.required}
          defaultChecked={data.required}
          onChange={data.checkBoxHandle}
        />
      </label>
      <br />
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

export default function Usecase2() {
  let history = useHistory();

  const [elementsList, setElementList] = useState([]);
  const [isAdded, setIsAdded] = useState(false);

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
    const data = [...elementsList];
    data[index].label = event.target.value;
    setElementList(data);
  };

  const selectChange = (event, index) => {
    const data = [...elementsList];
    data[index].options.labels = [];
    for (let i = 0; i < event.target.value; i++) {
      data[index].options.labels.push("");
    }
    setElementList(data);
  };

  const checkBoxHandle = (i) => {
    const data = [...elementsList];
    let required = data[i].required;
    data[i].required = !required;
    setElementList(data);
  };

  const checkNumberHandle = (i) => {
    const data = [...elementsList];
    let required = data[i].options.isNumber;
    data[i].options.isNumber = !required;
    setElementList(data);
  };

  const optionChange = (e, i, index) => {
    const data = [...elementsList];
    data[index].options.labels[i] = e.target.value;
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
  return (
    <div className="App">
      {console.log(elementsList)}
      <h1>Select Element</h1>
      <div className="btn-container">
        <button onClick={inputClick}>Add Inputbox</button>
        <button onClick={dropClick}>Add Dropdown</button>
        <button onClick={radioClick}>Add Radio Button</button>
        <button onClick={checkboxClick}>Add Checkbox</button>
      </div>
      <div className="container">
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
      </div>
      {elementsList.length > 0 && (
        <button onClick={downloadJSON}>Download JSON</button>
      )}

      <pre>{JSON.stringify(elementsList, null, 4)}</pre>
      {isAdded && <App2 data={elementsList} />}

      {/* <Button name="Submit" onClick={postData} /> */}
    </div>
  );
}
