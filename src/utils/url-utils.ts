/**
 *
 * Fetch an entry from URL params
 *
 * @param name the param name to fetch
 * @param search the search part from the React Router location
 * @returns the value of the search part, or an empty string if it does not exist.
 */
export const getUrlParameter = (name: string, search: string) => {
  const url = new URL(`http://localhost${search}`); // need to use a dummy URL for parsing
  return url.searchParams.get(name) || '';
};
