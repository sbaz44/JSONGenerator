import React from "react";

export function TextField(props) {
  const { name, label, value, placeholder, isNumber, onChange, ...rest } =
    props;
  return (
    <React.Fragment>
      {label && <label for={name}>{label}</label>}
      <input
        type="text"
        name={name}
        placeholder={label}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </React.Fragment>
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
    onChange,
    ...rest
  } = props;
  return (
    <React.Fragment>
      {label && <label for={name}>{label}</label>}
      <select onChange={onChange}>
        {options.map((optn, index) => (
          <option key={optn} value={optn} label={optn} />
        ))}
      </select>
    </React.Fragment>
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
    ...rest
  } = props;
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}

export function CheckboxField(props) {
  const {
    name,
    label,
    options,
    value,
    placeholder,
    isNumber,
    onChange,
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
            // checked={value === optn}
            onChange={onChange}
          />
          {optn}
        </label>
        //   <option key={optn} value={optn} label={optn} />
      ))}
    </React.Fragment>
  );
}
