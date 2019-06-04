import React from "react";
import { Dropdown } from "semantic-ui-react";

const experimentalTechniqueOptions = [
  { key: "Spectroscopy", text: "Spectroscopy", value: "Spectroscopy" },
  { key: "Diffraction", text: "Diffraction", value: "Diffraction" },
  { key: "Microscopy", text: "Microscopy", value: "Microscopy" }
];

export function ExperimentalTechniqueDropdown(props) {
  return (
    <Dropdown
      clearable
      options={experimentalTechniqueOptions}
      selection
      onChange={(evt, data) => {
        props.onChange(data.value);
      }}
    />
  );
}
