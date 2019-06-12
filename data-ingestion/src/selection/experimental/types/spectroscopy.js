import React from "react";
import { Dropdown } from "semantic-ui-react";

import NmrSchema from "../../../schemas/nmrSchema";
import NmrUISchema from "../../../schemas/nmrUISchema";
import NeutronSchema from "../../../schemas/neutronSchema";
import NeutronUISchema from "../../../schemas/neutronUISchema";
import XrayEmissionSchema from "../../../schemas/xrayEmissionSchema";
import XrayEmissionUISchema from "../../../schemas/xrayEmissionUISchema";

const spectroscopyTypeOptions = [
  {
    key: "NMR",
    text: "NMR",
    value: "NMR",
    schema: NmrSchema,
    uischema: NmrUISchema
  },
  {
    key: "Neutron",
    text: "Neutron",
    value: "Neutron",
    schema: NeutronSchema,
    uischema: NeutronUISchema
  },
  {
    key: "X-ray (Emission)",
    text: "X-ray (Emission)",
    value: "X-ray (Emission)",
    schema: XrayEmissionSchema,
    uischema: XrayEmissionUISchema
  }
];

export function SpectroscopyTypeDropdown(props) {
  return (
    <Dropdown
      clearable
      options={spectroscopyTypeOptions}
      selection
      onChange={(evt, data) => {
        props.onChange(data.value, data.options);
      }}
    />
  );
}
