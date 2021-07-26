import {Box, IconButton, useTheme} from '@material-ui/core';
import {TablePaginationActionsProps} from '@material-ui/core/TablePagination/TablePaginationActions';
import {FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage} from '@material-ui/icons';
import {FC} from 'react';

const getAriaLabel = (type: string, pageArg: number) => `Go to ${type} page (${pageArg + 1})`;

/**
 * Custom Table pagination actions, with first button and last button support
 *
 * This component is used internally by Material-UI, so remember that pages must be ZERO based.
 * However, pages displayed to people or screen-readers should be ONE based.
 *
 * TODO should be able to use the material-ui default on v5.
 */
const CustomTablePaginationActions: FC<TablePaginationActionsProps> = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  backIconButtonProps,
  nextIconButtonProps,
}) => {
  const theme = useTheme();

  const lastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);
  const previousPage = Math.max(page - 1, 0);
  const nextPage = Math.min(page + 1, lastPage);

  const isFirstPage = page === 0;
  const isLastPage = page === lastPage;

  return (
    <Box display="flex">
      <IconButton
        onClick={(e) => onPageChange(e, 0)}
        disabled={isFirstPage}
        aria-label={getAriaLabel('first', 0)}
        title={getAriaLabel('first', 0)}
      >
        {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
      </IconButton>
      <IconButton
        {...backIconButtonProps}
        onClick={(e) => onPageChange(e, previousPage)}
        disabled={isFirstPage}
        aria-label={getAriaLabel('previous', previousPage)}
        title={getAriaLabel('previous', previousPage)}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        {...nextIconButtonProps}
        onClick={(e) => onPageChange(e, nextPage)}
        disabled={isLastPage}
        aria-label={getAriaLabel('next', nextPage)}
        title={getAriaLabel('next', nextPage)}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, lastPage)}
        disabled={isLastPage}
        aria-label={getAriaLabel('last', lastPage)}
        title={getAriaLabel('last', lastPage)}
      >
        {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
      </IconButton>
    </Box>
  );
};

export default CustomTablePaginationActions;
