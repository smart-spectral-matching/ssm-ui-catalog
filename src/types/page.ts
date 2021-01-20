import {NonEmptyArray} from './generics';

/**
 * Immutable object to create URL query parameters for Spring endpoints which have Pageable as a parameter (for paging and sorting).
 * All parameters are optional.
 */
export interface PageRequest {
  /**
   * Pagination number, the first starting at 0
   */
  readonly page?: number;
  /**
   * Page size: number of results to return
   */
  readonly size?: number;
  /**
   * Sort orders
   */
  readonly sort?: SortOrder[];
}

/**
 * Immutable object representing a sort order in a PageRequest
 */
export interface SortOrder {
  /**
   * API properties name to sort by. Required.
   *
   * If using an array, the first properties take precedence over the others when sorting
   */
  readonly property: string | NonEmptyArray<string>;
  /**
   * Spring parses this as 'ASC' if not specified
   */
  readonly direction?: 'ASC' | 'DESC';
  /**
   * Requires Spring Data Commons 2.3 or later to work.
   * By default Spring sort is case sensitive, provide this value to make it case insensitive
   */
  readonly ignoreCase?: 'IgnoreCase';
}
