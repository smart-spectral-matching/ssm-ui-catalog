import React from "react";
import { Dropdown } from "semantic-ui-react";

const spectroscopyTypeOptions = [
  { key: "NMR", text: "NMR", value: "NMR" },
  { key: "Neutron", text: "Neutron", value: "Neutron" },
  {
    key: "X-ray (Emission)",
    text: "X-ray (Emission)",
    value: "X-ray (Emission)"
  }
];

export function SpectroscopyTypeDropdown(props) {
  return (
    <Dropdown
      clearable
      options={spectroscopyTypeOptions}
      selection
      onChange={(evt, data) => {
        props.onChange(data.value);
      }}
    />
  );
}
