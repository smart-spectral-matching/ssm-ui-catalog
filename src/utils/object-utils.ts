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

// recursive portion of "setNestedKey"
function setNestedKeyPrivate<T extends Record<string | number | symbol, any> | Array<any>>(
  obj: T,
  path: Array<string | number | symbol>,
  value: any,
) {
  if (path.length === 1) {
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    obj[path[0]] = value;
    return;
  }
  // @ts-ignore
  setNestedKeyPrivate(obj[path[0]], path.slice(1), value);
}

/**
 *
 * Sets value of nested key string descriptor inside object. Includes arrays
 * WARNING: mutates object
 *
 * @param obj object to mutate with new value
 * @param path NON-EMPTY array to describe the property path to the value we want to mutate. Numbers can be used to reference an array.
 *   Example input: ['a', 0, 'b']
 * @param value value we want to mutate the key with
 */
export function setNestedKey<T extends Record<string | number | symbol, any> | Array<any>>(
  obj: T,
  path: Array<string | number | symbol>,
  value: any,
) {
  // avoid infinite loop by first checking that "path" is valid
  if (!path?.length) {
    window.console.debug('calling "setNestedKey" without a populated array for "path" parameter');
    return;
  }
  setNestedKeyPrivate(obj, path, value);
}
