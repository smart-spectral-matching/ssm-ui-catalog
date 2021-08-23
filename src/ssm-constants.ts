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
 * Link to Swagger API documentation. If frontend and API are behind same proxy, should be absolute path.
 */
export const API_DOCS_URL = process.env.REACT_APP_API_DOCS_URL as string;
/**
 * Link to the Machine Learning UI Hub. If frontend and ML-hub are behind same proxy, should be absolute path.
 */
export const MACHINE_LEARNING_UI_URL = process.env.REACT_APP_MACHINE_LEARNING_UI_URL as string;
/**
 * Link to the Machine Learning Jupyter Notebooks. If behind same proxy as frontend, should be absolute path.
 */
export const MACHINE_LEARNING_NOTEBOOKS_URL = process.env.REACT_APP_MACHINE_LEARNING_NOTEBOOKS_URL as string;
