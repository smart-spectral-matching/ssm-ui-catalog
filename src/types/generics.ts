/**
 * An array which requires at least one value.
 *
 * I would really only suggest that you use this as a readonly parameter to an immutable function, because Typescript will throw an error the instant the array's size changes to 0.
 */
export type NonEmptyArray<T> = [T, ...T[]];
