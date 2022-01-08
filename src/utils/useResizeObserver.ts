import { MutableRefObject, useEffect, useState } from 'react';

/**
 * Hook that returns the current dimensions of an HTML element.
 * Doesn't play well with SVG.
 */
const useResizeObserver = (ref: MutableRefObject<any>) => {
  const [dimensions, setDimensions] = useState<DOMRectReadOnly | null>(null);
  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });
    resizeObserver.observe(observeTarget);
    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);
  return dimensions;
};

export default useResizeObserver;
