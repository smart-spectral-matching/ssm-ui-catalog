/**
 * Generic interface for a response with paginated results.
 */
export interface PaginatedResponse<T> {
  /**
   * Paged content data
   */
  data: T[];
  /**
   * URL link to get the first page
   */
  first: string;
  /**
   * URL link to get the previous page
   */
  previous: string;
  /**
   * URL link to get the next page
   */
  next: string;
  /**
   * URL link to get the last page
   */
  last: string;
  /**
   * total number of items queried from the database
   */
  total: number;
}

/**
 * Consistent JSON format of 400-level responses
 */
export interface ApiProblem {
  /**
   * brief description of error (usually just the HTTP status code title)
   */
  title: string;
  /**
   * HTTP status code
   */
  status: number;
  /**
   * in-depth description of error, telling you why the error was thrown
   */
  detail: string;
}
