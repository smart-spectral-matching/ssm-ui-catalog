import personSchema from "../schemas/personSchema";
import addressSchema from "../schemas/addressSchema";
import personUISchema from "../schemas/personUISchema";
import addressUISchema from "../schemas/addressUISchema";

// Initial data
export const DatasetOne = {
  name: "dataset1",
  title: "Dataset 1",
  schema: personSchema,
  uischema: personUISchema,
  path: "person"
};

export const DatasetTwo = {
  name: "dataset2",
  title: "Dataset 2",
  schema: addressSchema,
  uischema: addressUISchema,
  path: "address"
};

export const DatasetThree = {
  name: "dataset3",
  title: "Dataset 3",
  schema: personSchema,
  uischema: personUISchema,
  path: "person"
};

export const initialDatasets = [DatasetOne, DatasetTwo];
