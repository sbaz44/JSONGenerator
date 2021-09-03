import React from "react";

export default function Inputbox(props) {
  return (
    <div class="form__group">
      <input
        onChange={props.onChange}
        value={props.value}
        name={props.name}
        type="text"
        class="form__field"
        placeholder={props.label}
        autoFocus={props.autoFocus}
        onFocus={props.onFocus}
      />
      <label for="email" class="form__label2 form__label">
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
