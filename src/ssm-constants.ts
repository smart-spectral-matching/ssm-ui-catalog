/*
Environment variable constants - provides strong typing,
so typing the custom REACT_APP env variables (which are
weakly typed) only needs to be done here.
*/

/**
 * API URL. If frontend and API are hosted behind same proxy, should just be '/api'
 */
export const API_URL = process.env.REACT_APP_API_URL as string;
/**
 * Title of the dataset we will always query.
 */
export const DATASET = process.env.REACT_APP_DATASET as string;
