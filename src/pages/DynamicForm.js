import React, { useEffect, useState } from "react";
import {
  CheckboxField,
  RadioField,
  SelectField,
  TextField,
} from "../components/FormElement2";
import "./dynamic.scss";
export default function DynamicForm() {
  const [data, setData] = useState([
    {
      subType: "TRESPASSING",
      isOpen: true,
      elements: [
        {
          elementName: "element10",
          type: "text",
          label: "Name",
          required: true,
          isNumber: true,
          options: [],
        },
        {
          elementName: "element20",
          type: "select",
          label: "Role",
          required: true,
          isNumber: false,
          options: ["Superadmin", "Admin", "Moderator"],
        },
      ],
    },
    {
      subType: "LOITERING",
      isOpen: true,
      elements: [
        {
          elementName: "element11",
          type: "radio",
          label: "Gender",
          required: true,
          isNumber: false,
          options: ["Male", "Female"],
        },
        {
          elementName: "element21",
          type: "checkbox",
          label: "Hobbie",
          required: true,
          isNumber: false,
          options: ["Cricket", "Football", "Hockey"],
        },
        {
          elementName: "element31",
          type: "text",
          label: "Address",
          required: false,
          isNumber: false,
          options: [],
        },
      ],
    },
  ]);

  const [inputData, setinputData] = useState();
  const [activeBtn, setActiveBtn] = useState("");

  const handleTextFieldInput = (e, isNumber, index, ele_index) => {
    let _data = [...data];
    if (isNumber) {
      if (isNaN(e.target.value)) {
        return;
      }
      const onlyNums = e.target.value.replace(/[^0-9]/g, "");
      _data[index].elements[ele_index].value = onlyNums;
    } else {
      _data[index].elements[ele_index].value = e.target.value;
    }
    setData(_data);
  };

  const handleCheckboxInput = (e, isNumber, index, ele_index) => {
    let _data = [...data];
    if (!_data[index].elements[ele_index].value) {
      _data[index].elements[ele_index].value = [];
    }
    if (_data[index].elements[ele_index].value.length >= 0) {
      if (_data[index].elements[ele_index].value.includes(e.target.value)) {
        let indexx = _data[index].elements[ele_index].value.indexOf(
          e.target.value
        );
        _data[index].elements[ele_index].value.splice(indexx, 1);
      } else {
        _data[index].elements[ele_index].value.push(e.target.value);
      }
    }
    if (_data[index].elements[ele_index].value.length === 0) {
      delete _data[index].elements[ele_index].value;
    }
    setData(_data);
  };

  const getFormElement = (element, index, ele_index) => {
    if (element.type === "text") {
      return (
        <TextField
          error={element.error}
          name={element.elementName}
          label={element.label}
          onChange={(e) =>
            handleTextFieldInput(e, element.isNumber, index, ele_index)
          }
          value={element.value?.length > 0 ? element.value : ""}
          onBlur={() => handleBlur(index, ele_index)}
        />
      );
    }
    if (element.type === "select") {
      return (
        <SelectField
          name={element.elementName}
          label={element.label}
          error={element.error}
          onChange={(e) => {
            handleTextFieldInput(e, element.isNumber, index, ele_index);
            handleBlur(index, ele_index);
          }}
          options={element.options}
          value={element.value?.length > 0 ? element.value : ""}
        />
      );
    }
    if (element.type === "radio") {
      return (
        <RadioField
          name={element.elementName}
          error={element.error}
          label={element.label}
          onChange={(e) => {
            handleTextFieldInput(e, element.isNumber, index, ele_index);
            handleBlur(index, ele_index);
          }}
          options={element.options}
          value={element.value?.length > 0 ? element.value : ""}
        />
      );
    }
    if (element.type === "checkbox") {
      return (
        <CheckboxField
          name={element.elementName}
          error={element.error}
          label={element.label}
          onChange={(e) => {
            handleCheckboxInput(e, element.isNumber, index, ele_index);
            handleBlur(index, ele_index);
          }}
          options={element.options}
          value={element.value?.length > 0 ? element.value : ""}
        />
      );
    }
  };

  const handleSubmit = () => {
    let _data = [...data];
    let isError = false;
    for (let i = 0; i < _data.length; i++) {
      if (_data[i].subType === activeBtn) {
        for (let j = 0; j < _data[i].elements.length; j++) {
          if (_data[i].elements[j].required) {
            if (
              _data[i].elements[j].value === "" ||
              _data[i].elements[j].value === undefined
            ) {
              isError = true;
              _data[i].elements[j].error = true;
            } else {
              _data[i].elements[j].error = false;
              isError = false;
            }
          }
        }
      }
    }
    setData(_data);
    console.log(isError);
  };

  const handleBlur = (index, ele_index) => {
    console.log("object");
    let _data = [...data];

    if (_data[index].elements[ele_index].required) {
      if (
        _data[index].elements[ele_index].value === "" ||
        _data[index].elements[ele_index].value === undefined
      ) {
        _data[index].elements[ele_index].error = true;
      } else {
        _data[index].elements[ele_index].error = false;
      }
    }
    setData(_data);
  };

  return (
    <div>
      {console.log(data)}
      <h1>Dynamic Form</h1>
      <div className="btn__container">
        {data.map((item) => (
          <button
            onClick={() => setActiveBtn(item.subType)}
            style={{
              backgroundColor: activeBtn === item.subType ? "#5ff3f8" : "gray",
            }}
            key={item.subType}
          >
            {item.subType}
          </button>
        ))}
      </div>
      {data.map((item, index) => {
        if (activeBtn === item.subType) {
          return (
            <div key={item.subType}>
              {item.elements.map((ele_item, ele_index) =>
                getFormElement(ele_item, index, ele_index)
              )}
            </div>
          );
        }
      })}
      <button onClick={handleSubmit}>SUBMIT</button>
    </div>
  );
}
