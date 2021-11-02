import React, { useEffect, useState } from "react";
import {
  CheckboxField,
  RadioField,
  SelectField,
  TextField,
} from "../components/FormElement2";

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

  const handleTextFieldInput = (e, isNumber, index, ele_index) => {
    let _data = [...data];
    console.log(isNumber);
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

  const handleRadioFieldInput = (e, isNumber, index, ele_index) => {
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

    setData(_data);
  };

  const getFormElement = (element, index, ele_index) => {
    if (element.type === "text") {
      return (
        <TextField
          name={element.elementName}
          label={element.label}
          onChange={(e) =>
            handleTextFieldInput(e, element.isNumber, index, ele_index)
          }
          value={element.value?.length > 0 ? element.value : ""}
        />
      );
    }
    if (element.type === "select") {
      return (
        <SelectField
          name={element.elementName}
          label={element.label}
          onChange={(e) =>
            handleTextFieldInput(e, element.isNumber, index, ele_index)
          }
          options={element.options}
          value={element.value?.length > 0 ? element.value : ""}
        />
      );
    }
    if (element.type === "radio") {
      return (
        <RadioField
          name={element.elementName}
          label={element.label}
          onChange={(e) =>
            handleTextFieldInput(e, element.isNumber, index, ele_index)
          }
          options={element.options}
          value={element.value?.length > 0 ? element.value : ""}
        />
      );
    }
    if (element.type === "checkbox") {
      return (
        <CheckboxField
          name={element.elementName}
          label={element.label}
          onChange={(e) =>
            handleRadioFieldInput(e, element.isNumber, index, ele_index)
          }
          options={element.options}
          value={element.value?.length > 0 ? element.value : ""}
        />
      );
    }
  };

  const handleSubmit = () => {};

  useEffect(() => {}, []);
  return (
    <div>
      {console.log(data)}
      <h1>Dynamic Form</h1>
      {data.map((item, index) => (
        <div key={item.subType}>
          {item.elements.map((ele_item, ele_index) =>
            getFormElement(ele_item, index, ele_index)
          )}
        </div>
      ))}
      <button>SUBMIT</button>
    </div>
  );
}
