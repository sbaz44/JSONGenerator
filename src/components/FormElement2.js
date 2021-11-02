import React from "react";
import Inputbox from "./Inputbox";

export function TextField(props) {
  const {
    name,
    label,
    value,

    onBlur,
    placeholder,
    isNumber,
    onChange,
    ...rest
  } = props;
  return (
    <Inputbox
      value={value}
      label={label}
      onChange={onChange}
      placeholder={label}
      name={name}
      onBlur={onBlur}
      {...rest}
    />
    // <React.Fragment>
    //   {label && <label for={name}>{label}</label>}
    //   <input
    //     type="text"
    //     name={name}
    //     placeholder={label}
    //     value={value}
    //     onChange={onChange}
    //     {...rest}
    //   />
    // </React.Fragment>
  );
}

export function SelectField(props) {
  const {
    name,
    label,
    options,
    value,
    placeholder,
    isNumber,
    error,
    helperText,
    onChange,
    ...rest
  } = props;
  return (
    <div>
      {label && <label for={name}>{label}</label>}
      <select onChange={onChange} value={value}>
        <option value="" disabled />
        {options.map((optn, index) => (
          <option key={optn} value={optn} label={optn} />
        ))}
      </select>
      {error && (
        <p className="input__error">{helperText ? helperText : "Required"}</p>
      )}
    </div>
  );
}

export function RadioField(props) {
  const {
    name,
    label,
    options,
    value,
    placeholder,
    isNumber,
    onChange,
    error,
    helperText,
    ...rest
  } = props;
  return (
    <div>
      {label && <label for={name}>{label}</label>}
      {options.map((optn, index) => (
        <label>
          <input
            type="radio"
            key={optn}
            name={optn}
            value={optn}
            checked={value === optn}
            onChange={onChange}
          />
          {optn}
        </label>
        //   <option key={optn} value={optn} label={optn} />
      ))}
      {error && (
        <p className="input__error">{helperText ? helperText : "Required"}</p>
      )}
    </div>
  );
}

export function CheckboxField(props) {
  const {
    name,
    label,
    options,
    value,
    error,
    placeholder,
    isNumber,
    onChange,
    helperText,
    ...rest
  } = props;
  return (
    <React.Fragment>
      {label && <label for={name}>{label}</label>}
      {options.map((optn, index) => (
        <label>
          <input
            type="checkbox"
            key={optn}
            name={optn}
            value={optn}
            checked={value.includes(optn)}
            onChange={onChange}
          />
          {optn}
        </label>
        //   <option key={optn} value={optn} label={optn} />
      ))}
      {error && (
        <p className="input__error">{helperText ? helperText : "Required"}</p>
      )}
    </React.Fragment>
  );
}
