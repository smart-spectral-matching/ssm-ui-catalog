import React from "react";
import { Dropdown } from "semantic-ui-react";

const methodOptions = [
  { key: "Experimental", text: "Experimental", value: "Experimental" },
  { key: "Calculation", text: "Calculation", value: "Calculation" }
];

export function MethodDropdown(props) {
  return (
    <Dropdown
      clearable
      options={methodOptions}
      selection
      onChange={(evt, data) => {
        props.onChange(data.value);
      }}
    />
  );
}
