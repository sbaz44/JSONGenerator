import React from "react";
import {
  Formik,
  Form as FormikForm,
  Field,
  ErrorMessage,
  useFormikContext,
  useField,
  useFormik
} from "formik";

export function Form(props) {
  return (
    <Formik {...props}>
      <FormikForm className="needs-validation" novalidate="">
        {props.children}
      </FormikForm>
    </Formik>
  );
}

export function TextField(props) {
  const { name, label, placeholder, ...rest } = props;
  return (
    <>
      {label && <label for={name}>{label}</label>}
      <Field
        className="form-control"
        type="text"
        name={name}
        id={name}
        placeholder={placeholder || ""}
        {...rest}
      />
      <ErrorMessage
        name={name}
        render={(msg) => <div style={{ color: "red" }}>{msg}</div>}
      />
    </>
  );
}

export function SelectField(props) {
  const { name, label, options } = props;
  return (
    <>
      {label && <label for={name}>{label}</label>}
      <Field as="select" id={name} name={name}>
        <option value="">Choose...</option>
        {options.map((optn, index) => (
          <option value={optn} label={optn} />
        ))}
      </Field>
      <ErrorMessage
        name={name}
        render={(msg) => <div style={{ color: "red" }}>{msg}</div>}
      />
    </>
  );
}

export function RadioField(props) {
  const { name, label, options } = props;
  console.log(name, label, options)
  return (
    <>
      {label && <label for={name}>{label}</label>}
      <Field component="div" name="myRadioGroup">
      {options.map((optn, index) => (
          // <option value={optn} label={optn} />
         <label> <input
          type="radio"
          id="radioOne"
          // defaultChecked={values.myRadioGroup === "one"}
          name={name}
          value={optn}
        />
        {optn}
        </label>
        ))}

        {/* <input
          type="radio"
          id="radioOne"
          defaultChecked={values.myRadioGroup === "one"}
          name="myRadioGroup"
          value="one"
        />
        <label htmlFor="radioOne">One</label>

        <input
          type="radio"
          id="radioTwo"
          defaultChecked={values.myRadioGroup === "two"}
          name="myRadioGroup"
          value="two"
        /> */}
       
      </Field>
      <ErrorMessage
        name={name}
        render={(msg) => <div style={{ color: "red" }}>{msg}</div>}
      />
    </>
  );
}


export function SubmitButton(props) {
  const { title, ...rest } = props;
  const { isSubmitting } = useFormikContext();

  return (
    <button type="submit" {...rest} disabled={isSubmitting}>
      {title}
    </button>
  );
}
