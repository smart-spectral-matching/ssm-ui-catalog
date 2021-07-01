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
  // static properties - TODO add later
  // allow for dynamic properties as well
  [key: string]: any;
}
