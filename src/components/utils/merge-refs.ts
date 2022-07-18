/**
 *
 * merge two refs (i.e. local and external) into one ref
 *
 * generally will only need this if using React.forwardRef in a component.
 *
 * source: https://github.com/gregberge/react-merge-refs
 *
 * @param refs array of all refs
 * @returns the ref callback (same as what you'd normally use with one ref)
 */
export default function mergeRefs<T = any>(refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        // eslint-disable-next-line no-param-reassign
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}
