import React from "react";

export default function Inputbox(props) {
  return (
    <div class="form__group">
      <input
        onChange={props.onChange}
        value={props.value}
        type="text"
        class="form__field"
        placeholder={props.label}
      />
      <label for="email" class="form__label2 form__label">
        {props.label}
      </label>
    </div>
  );
}
