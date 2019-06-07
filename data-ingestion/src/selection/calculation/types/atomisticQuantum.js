import React from "react";
import { Dropdown } from "semantic-ui-react";

const atomisticQuantumTypeOptions = [
  { key: "Mechanics", text: "Mechanics", value: "Mechanics" },
  { key: "Dynamics", text: "Dynamics", value: "Dynamics" },
  { key: "Phonon", text: "Phonon", value: "Phonon" },
  {
    key: "Minimum Energy Path",
    text: "Minimum Energy Path",
    value: "Minimum Energy Path"
  }
];

export function AtomisticQuantumTypeDropdown(props) {
  return (
    <Dropdown
      clearable
      options={atomisticQuantumTypeOptions}
      selection
      onChange={(evt, data) => {
        props.onChange(data.value);
      }}
    />
  );
}
