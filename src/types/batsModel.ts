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
  description: string | null;
  property: string | null;
  /**
   * mostly dynamically generated, but some paths will be consistent.
   */
  dataseries: Array<DataSeries>;
  /**
   * dynamically generated property value, may be null
   */
  methodology: Record<string, any> | null;
  /**
   * dynamically generated property value, may be null
   */
  sources: Record<string, any> | null;
  /**
   * dynamically generated property value, may be null
   */
  system: Record<string, any> | null;
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
  axisType?: string | null;
  label?: string | null;
  parameter?: Parameter | null;
}

export interface Parameter {
  /**
   * dynamic values
   */
  [key: string]: any;
  property?: string | null;
  quantity?: string | null;
  numericValueArray?: ValueArray | null;
}

export interface ValueArray {
  /**
   * dynamic values
   */
  [key: string]: any;
  unitRef?: string | null;
  numberArray?: number[] | null;
}
