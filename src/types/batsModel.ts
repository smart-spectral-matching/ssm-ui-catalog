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
 *
 */
export interface BatsModel extends BatsModelCondensed {
  // allow for dynamic properties as well
  /**
   * URL to the full path
   */
  full: string;
  scidata: SciData;
}

export interface SciData {
  // dynamic properties
  [key: string]: any;
  property: string;
  description: string;
  methodology: { evaluationMethod: string };
}
