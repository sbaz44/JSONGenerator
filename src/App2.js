import React, { useState, useEffect } from "react";
import {
  Form,
  TextField,
  SelectField,
  SubmitButton,
  RadioField,
  CheckboxField,
} from "./FormElement";
import * as Yup from "yup";
const formSchema = {
  element0: { type: "text", label: "Name", required: true },
  element3: { type: "text", label: "Email", required: true },
  element1: {
    type: "select",
    label: "Role",
    required: true,
    options: ["Superadmin", "Admin"],
  },
  element2: {
    type: "radio",
    label: "Gender",
    required: true,
    options: ["Male", "Female"],
  },
};

export default function App2({ data }) {
  const [formData, setFormData] = useState({});
  const [validationSchema, setValidationSchema] = useState({});

  useEffect(() => {
    initForm(data);
  }, []);

  const initForm = (formSchema) => {
    let __formData = {};
    let _formData = {};
    let _validationSchema = {};

    for (var item of data) {
      console.log({ item });
      __formData[item.elementName] = "";
      // if (formSchema[key].type === "text") {
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
    console.log({ __formData, _validationSchema });
    // for (var key of Object.keys(formSchema)) {
    //   _formData[key] = "";

    //   if (formSchema[key].type === "text") {
    //     if (formSchema[key].isNumber) {
    //       _validationSchema[key] = Yup.number();
    //     } else {
    //       _validationSchema[key] = Yup.string();
    //     }
    //   } else if (formSchema[key].type === "email") {
    //     _validationSchema[key] = Yup.string().email();
    //   } else if (formSchema[key].type === "select") {
    //     _validationSchema[key] = Yup.string().oneOf(
    //       formSchema[key].options.map((o) => o)
    //     );
    //   } else if (formSchema[key].type === "radio") {
    //     _validationSchema[key] = Yup.string().oneOf(
    //       formSchema[key].options.map((o) => o)
    //     );
    //   } else if (formSchema[key].type === "checkbox") {
    //     _validationSchema[key] = Yup.array()
    //       .required()
    //       .min(1, "Please select atleast one option");
    //   }
    //   if (formSchema[key].required) {
    //     _validationSchema[key] = _validationSchema[key].required("Required");
    //   }
    // }
    // console.log("key");

    // console.log({ _formData, _validationSchema });
    setFormData(__formData);
    setValidationSchema(Yup.object().shape({ ..._validationSchema }));
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

  const onSubmit = (values, { setSubmitting, resetForm, setStatus }) => {
    console.log(values);
    setSubmitting(false);
  };

  return (
    <div>
      {/* {console.log("validationSchema")}
      {console.log(validationSchema)} */}
      <Form
        enableReinitialize
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {data.map((item, index) => (
          <div key={item.elementName}>
            {getFormElement(item.elementName, item)}
          </div>
        ))}
        {/* {Object.keys(data).map((key, ind) => (
          <div key={key}>{getFormElement(key, data[key])}</div>
        ))} */}
        <SubmitButton title="Submit" />
      </Form>
    </div>
  );
}
