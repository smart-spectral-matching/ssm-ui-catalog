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
/**
 * Authority url for OIDC config. For keycloak, it's the realm url.
 */
export const OIDC_AUTH_URL = window.config?.oidcAuthUrl || (process.env.REACT_APP_OIDC_AUTH_URL as string);
/**
 * Client ID registered for this app
 */
export const OIDC_CLIENT_ID = window.config?.oidcClientId || (process.env.REACT_APP_OIDC_CLIENT_ID as string);
/**
 * Redirect URL registered for this app. Recommended to just be the root url for this app.
 */
export const OIDC_REDIRECT_URL = window.config?.oidcRedirectUrl || (process.env.REACT_APP_OIDC_REDIRECT_URL as string);
