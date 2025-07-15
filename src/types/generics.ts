/**
 * An array which requires at least one value.
 *
 * I would really only suggest that you use this as a readonly parameter to an immutable function, because Typescript will throw an error the instant the array's size changes to 0.
 */
export type NonEmptyArray<T> = [T, ...T[]];

export type Nullable<T> = T | null;
/**
 * allow for all properties of an object to be nullable (shallow)
 */
export type ShallowNullableObject<T> = { [K in keyof T]: T[K] | null };
/**
 * allow for all properties of an object to be nullable (deep)
 */
export type DeepNullableObject<T> = { [K in keyof T]: DeepNullableObject<T[K]> | null };

export enum LoadState {
  LOADING,
  LOADED,
  ERROR,
}

export class HttpError extends Error {
  statusCode?: number;

  body: string;

  constructor(message: string, body: string, statusCode?: number) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.body = body;
    Error.captureStackTrace(this, HttpError);
  }
}
