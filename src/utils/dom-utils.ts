/**
 * Sanitize and encode all HTML in a user-provided/API-provided string. This does not allow for any HTML nodes.
 *
 * NOTE: this function is only needed if rendering nodes outside of React (i.e. through D3), as React will automatically sanitize its own nodes
 *
 * @param  {String} str  The provided string (from the user or an API)
 * @return {String} The sanitized string
 */
export function sanitizeHTML(str: string): string {
  return str.replace(/[^\w-. ]/gi, (s) => `&#${s.charCodeAt(0)};`);
}
