/**
 * Enables:
 *
 * 1. Calling 'process.env.ENVIRONMENT' to determine whether this is development, testing, or production
 * 2. Using PUBLIC_URL for several file paths in public/index.html
 * 3. Enables importing several different image types directly, including Component functionality for SVGs.
 */
/// <reference types="react-scripts" />

declare global {
  interface Window {
    config?: ConfigKeys;
  }
}

/**
 * ENV configuration typings (called by 'window.config')
 */
export interface ConfigKeys {
  /**
   * link to the API
   */
  apiUrl: string;
  /**
   * link to the frontend Machine Learning UI
   */
  mlUiUrl: string;
  /**
   * link to the Jupyter Notebooks
   */
  mlNotebooksUrl: string;
  /**
   * authority url for OIDC config. for keycloak, it's the realm url
   */
  oidcAuthUrl: string;
  /**
   * Client ID registered for this app
   */
  oidcClientId: string;
  /**
   * Redirect URL registered for this app. Recommended to just be the root url for this app.
   */
  oidcRedirectUrl: string;
  /**
   * File Converter Service URL
   */
  fileConverterUrl: string;
}
