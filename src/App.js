import { useState } from "react";
import "./App.css";

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
        value={data.value}
        onChange={data.onChange}
        onFocus={data.onFocus}
      />
      <input type="button" value="remove" onClick={data.removeInput} />
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

export default function App() {
  const [elementsList, setElementList] = useState([]);

  const inputClick = () => {
    const data = [...elementsList];
    let obj = {
      type: "text",
      label: "Key name",
      // required: true
    };
    data.push(obj);
    setElementList(data);
  };

  const dropClick = () => {
    const data = [...elementsList];
    let obj = {
      type: "select",
      label: "Label",
      // required: true,
      options: [
        // {
        //   label: "Admin",
        //   value: "admin"
        // },
        // {
        //   label: "User",
        //   value: "user"
        // }
      ],
    };
    data.push(obj);
    setElementList(data);
  };

  const handleChange = (event, i) => {
    const data = [...elementsList];
    data[i].label = event.target.value;
    setElementList(data);
  };

  const selectChange = (event, index) => {
    const data = [...elementsList];
    data[index].options = [];
    for (let i = 0; i < event.target.value; i++) {
      data[index].options.push("");
    }
    setElementList(data);
  };

  const optionChange = (e, i, index) => {
    const data = [...elementsList];
    data[index].options[i] = e.target.value;
    setElementList(data);
  };
  const removeInput = (i) => {
    const array = [...elementsList];
    array.splice(i, 1);
    setElementList(array);
  };

  const downloadJSON = async () => {
    console.log("hi");
    // is an object and I wrote it to file as
    // json
    const fileName = "file";
    const json = JSON.stringify(elementsList);
    const blob = new Blob([json], { type: "application/json" });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="App">
      {console.log(elementsList)}
      <h1>Select Element to add</h1>
      <div className="btn-container">
        <button onClick={inputClick}>Add Inputbox</button>
        <button onClick={dropClick}>Add Dropdown</button>
      </div>
      <div className="container">
        {elementsList.map((item, index) => {
          if (item.type === "text") {
            return (
              <InputBox
                key={index + 22}
                value={item.label}
                onChange={(e) => handleChange(e, index)}
                onFocus={(event) => event.target.select()}
                remove
                removeInput={() => removeInput(index)}
              />
            );
          }
          if (item.type === "select") {
            return (
              <Dropbox
                key={index + 33}
                labelValue={item.label}
                options={item.options}
                onChange={(e) => handleChange(e, index)}
                selectChange={(e) => selectChange(e, index)}
                optionChange={(e) => optionChange(e, index)}
                optionHandlee={(e, value) => {
                  optionChange(e, value, index);
                }}
                removeInput={() => removeInput(index)}
              />
              // <InputBox
              // key={index+22}
              //   value={item.label}
              //   onChange={(e) => handleChange(e, index)}
              //   onFocus={(event) => event.target.select()}
              // />
            );
          }
          return null;
        })}
      </div>
      {elementsList.length > 0 && (
        <button onClick={downloadJSON}>Download JSON</button>
      )}

      <pre>{JSON.stringify(elementsList, null, 4)}</pre>
    </div>
  );
}
