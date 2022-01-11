import { CreateStyled } from '@emotion/styled';

/**
 * Useful shorthand for any Styled Components with custom attributes
 * - use this to prevent the attributes from being forwarded to the DOM.
 *
 * (Note that this does not work with certain MUI components.)
 */
export const transientOptions: Parameters<CreateStyled>[1] = {
  shouldForwardProp: (propName: string) => !propName.startsWith('$'),
};
