import React from "react";
import {
  Formik,
  Form as FormikForm,
  Field,
  ErrorMessage,
  useFormikContext,
} from "formik";

export function Form(props) {
  return (
    <Formik {...props}>
      <FormikForm className="needs-validation" noValidate="">
        {props.children}
      </FormikForm>
    </Formik>
  );
}

export function TextField(props) {
  console.log(props);
  const formikProps = useFormikContext();
  const { name, label, placeholder, isNumber, ...rest } = props;
  return (
    <>
      {label && <label for={name}>{label}</label>}
      <Field
        className="form-control"
        type="text"
        name={name}
        id={name}
        placeholder={label || ""}
        onChange={(e) => {
          if (isNumber) {
            if (isNaN(e.target.value)) {
              return;
            }
            const onlyNums = e.target.value.replace(/[^0-9]/g, "");
            formikProps.setFieldValue(name, onlyNums);
          } else {
            formikProps.setFieldValue(name, e.target.value);
          }
        }}
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
  console.log(name, label, options);
  // return <div>ABC</div>;
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
  console.log(name, label, options);
  return (
    <>
      {label && <label for={name}>{label}</label>}
      <Field component="div" name="myRadioGroup">
        {options.map((optn, index) => (
          <label>
            <input
              type="radio"
              id={"radio-" + index}
              name={name}
              value={optn}
            />
            {optn}
          </label>
        ))}
      </Field>
      <ErrorMessage
        name={name}
        render={(msg) => <div style={{ color: "red" }}>{msg}</div>}
      />
    </>
  );
}

export function CheckboxField(props) {
  const { name, label, options } = props;
  return (
    <>
      {label && <label for={name}>{label}</label>}
      {options.map((optn, index) => (
        <label>
          <Field type="checkbox" value={optn} name={name} />
          {optn}
        </label>
      ))}

      <ErrorMessage
        name={name}
        render={(msg) => <div style={{ color: "red" }}>{msg}</div>}
      />
    </>
  );
}

// function Checkbox(props) {
//   return (
//     <Field name={props.name}>
//       {({ field, form }) => (
//         <label>
//           <input
//             type="checkbox"
//             {...props}
//             checked={field.value.includes(props.value)}
//             onChange={() => {
//               if (field.value.includes(props.value)) {
//                 const nextValue = field.value.filter(
//                   (value) => value !== props.value
//                 );
//                 form.setFieldValue(props.name, nextValue);
//               } else {
//                 const nextValue = field.value.concat(props.value);
//                 form.setFieldValue(props.name, nextValue);
//               }
//             }}
//           />
//           {props.value}
//         </label>
//       )}
//     </Field>
//   );
// }

export function SubmitButton(props) {
  const { title, ...rest } = props;
  const { isSubmitting } = useFormikContext();

  return (
    <button type="submit" {...rest} disabled={isSubmitting}>
      {title}
    </button>
  );
}
