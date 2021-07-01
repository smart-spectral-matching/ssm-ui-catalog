/**
 * Generic interface for a response with paginated results.
 */
export interface PaginatedResponse<T> {
  data: T[];
  first: string;
  previous: string;
  next: string;
  last: string;
}
