/**
 *
 * @param object JSON object, null, or undefined
 * @returns true if object exists and has at least 1 key
 */
export const isNonEmptyObject = (object: Record<string, unknown> | null | undefined) => !!object && !!Object.keys(object).length;
/**
 *
 * @param object array, null, or undefined
 * @returns true if array exists and has at least 1 entry
 */
export const isNonEmptyArray = (array: Array<unknown> | null | undefined) => !!array?.length;
