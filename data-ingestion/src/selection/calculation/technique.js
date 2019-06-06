import React from "react";
import { Dropdown } from "semantic-ui-react";

const calculationTechniqueOptions = [
  {
    key: "Atomistic (Quantum)",
    text: "Atomistic (Quantum)",
    value: "Atomistic (Quantum)"
  },
  {
    key: "Atomistic (Classical)",
    text: "Atomistic (Classical)",
    value: "Atomistic (Classical)"
  },
  { key: "Coarse-Grained", text: "Coarse-Grained", value: "Coarse-Grained" },
  { key: "Continuum", text: "Continuum", value: "Continuum" }
];

export function CalculationTechniqueDropdown(props) {
  return (
    <Dropdown
      clearable
      options={calculationTechniqueOptions}
      selection
      onChange={(evt, data) => {
        props.onChange(data.value);
      }}
    />
  );
}
