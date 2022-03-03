/*
 * Environment variable constants- provides strong typing and environment resolution
 *
 * - If "window.config" exists (indicating a production environment), use that
 * - Otherwise (indicating a development/testing environment), read the most relevant .env file to get the variables
 *
 */

/**
 * API URL. If frontend and API are hosted behind same proxy, should just be '/api'
 */
export const API_URL = window.config?.apiUrl || (process.env.REACT_APP_API_URL as string);
/**
 * Link to the Machine Learning UI Hub. If frontend and ML-hub are behind same proxy, should be absolute path.
 */
export const ML_UI_URL = window.config?.mlUiUrl || (process.env.REACT_APP_ML_UI_URL as string);
/**
 * Link to the Machine Learning Jupyter Notebooks. If behind same proxy as frontend, should be absolute path.
 */
export const ML_NOTEBOOKS_URL = window.config?.mlNotebooksUrl || (process.env.REACT_APP_ML_NOTEBOOKS_URL as string);
