import { combineReducers, createStore } from "redux";
import { Actions, jsonformsReducer } from "@jsonforms/core";
import { materialRenderers } from "@jsonforms/material-renderers";

import personSchema from "./schemas/personSchema";
import addressSchema from "./schemas/addressSchema";

// Create store
const store = createStore(combineReducers({ jsonforms: jsonformsReducer() }), {
  jsonforms: { renderers: materialRenderers }
});

// Combine sub-schema to single for intial store
const schema = {
  type: "object",
  properties: {
    person: personSchema,
    address: addressSchema
  }
};

// Initialize store
store.dispatch(Actions.init({}, schema));

export default store;
