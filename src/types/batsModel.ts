import { Nullable } from './generics';

/**
 * Condensed response received when querying multiple models at once
 */
export interface BatsModelCondensed {
  created: string;
  modified: string;
  title: string;
  uuid: string;
  url: string;
}

/**
 * Complete model
 */
export interface BatsModel extends BatsModelCondensed {
  /**
   * URL to the full path
   */
  full: string;
  scidata: SciData;
}

export interface SciData {
  description: Nullable<string>;
  property: Nullable<string>;
  /**
   * mostly dynamically generated, but some paths will be consistent.
   */
  dataseries: Nullable<Array<DataSeries>>;
  /**
   * dynamically generated property value, may be null
   */
  methodology: Nullable<Record<string, unknown>>;
  /**
   * dynamically generated property value, may be null
   */
  sources: Nullable<Record<string, unknown>>;
  /**
   * dynamically generated property value, may be null
   */
  system: Nullable<Record<string, unknown>>;
}

export interface DataSeries {
  'x-axis': Axis;
  'y-axis': Axis;
}

export interface Axis {
  /**
   * dynamic values
   */
  [key: string]: any;
  axisType: string;
  label: string;
  parameter: Parameter;
}

export interface Parameter {
  /**
   * dynamic values
   */
  [key: string]: any;
  property: string;
  quantity: string;
  numericValueArray: ValueArray[];
}

export interface ValueArray {
  /**
   * dynamic values
   */
  [key: string]: any;
  unitRef?: string;
  numberArray: number[];
}
