import React from "react";

export default function Inputbox(props) {
  return (
    <div className="form__group">
      <input
        onChange={props.onChange}
        value={props.value}
        name={props.name}
        type="text"
        className="form__field"
        placeholder={props.label}
        autoFocus={props.autoFocus}
        onFocus={props.onFocus}
      />
      <label for="email" className="form__label2 form__label">
        {props.label}
      </label>
      {props.error && (
        <p className="input__error">
          {props.helperText ? props.helperText : "Required"}
        </p>
      )}
    </div>
  );
}
