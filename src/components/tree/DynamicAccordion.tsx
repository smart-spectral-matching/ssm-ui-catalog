import { FC, PropsWithChildren, ReactElement, ReactNode, useEffect, useRef, useState } from 'react';
// import { FixedSizeList } from 'react-window';
import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, styled, TextField } from '@mui/material';

import NumberField from 'components/NumberField';
import { transientOptions } from 'utils/jss-utils';

type OnFieldChange = (newValue: string | number | boolean, path: Array<string | number>) => void;

const AccordionLabel = styled('span')(() => ({
  marginRight: '1em',
}));

const AccordionList = styled(
  'ul',
  transientOptions,
)<{ $needsScroll?: boolean }>(({ $needsScroll }) => ({
  margin: 0,
  border: '1px solid #e0e0e0',
  borderRadius: '10px',
  maxHeight: $needsScroll ? '25vh' : 'unset',
  overflowY: 'auto',
  position: 'relative',
  '&:not(.browserDefault)': {
    paddingLeft: 0,
    listStyleType: 'none',
    '&>li': {
      borderBottom: '1px solid #dddddd',
      boxShadow: '0 1px 1px -1px #ddd',
      '&:last-child': {
        border: 0,
        boxShadow: 'none',
      },
    },
  },
}));

/**
 * render static value node
 */
const StaticAccordionItem: FC<{
  objKey: string;
  value: ReactNode;
  focus: () => void;
  allowEditing: boolean;
}> = ({ objKey, value, focus, allowEditing }) => (
  <span
    role="textbox"
    tabIndex={0}
    onFocus={
      allowEditing
        ? () => {
            focus();
          }
        : undefined
    }
    style={{
      cursor: allowEditing ? 'pointer' : 'inherit',
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 16px',
    }}
  >
    <b style={{ width: '15rem' }}>{objKey}:</b>
    {/* eslint-disable-next-line sonarjs/no-duplicate-string */}
    <span style={{ width: '100%', display: 'flex', justifyContent: 'center', transform: 'translateX(-1.5rem)' }}>{value}</span>
  </span>
);

const InputWrapper: FC<
  PropsWithChildren<{
    objKey: string;
  }>
> = ({ objKey, children }) => (
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  <label style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '10px 16px' }}>
    <b style={{ width: '15rem' }}>{objKey}:</b>
    {children}
  </label>
);

/**
 * Render string field
 */
export const AccordionListItemString: FC<{
  objKey: string;
  onFieldChange: OnFieldChange;
  path: Array<string | number>;
  value: string;
  allowEditing: boolean;
  isTextArea?: boolean;
}> = ({ objKey, onFieldChange, path, value, allowEditing, isTextArea }) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState<string>(value);
  const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const focus = () => {
    setEditing(true);
    // timeout removes focus background of "fake" field
    setTimeout(() => {
      fieldRef?.current?.focus();
    }, 0);
  };

  const blur = () => {
    setEditing(false);
    // TODO "value" does not seem to update
    if (editValue !== value) onFieldChange(editValue, path);
  };

  // needed to reset input field if dynamically updated (i.e. from "cancel")
  useEffect(() => {
    if (editValue !== value) setEditValue(value);
  }, [value]);

  if (!editing) {
    return <StaticAccordionItem objKey={objKey} value={editValue} focus={focus} allowEditing={allowEditing} />;
  }

  return (
    <InputWrapper objKey={objKey}>
      <TextField
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={() => blur()}
        multiline={isTextArea}
        inputProps={{ ref: fieldRef }}
      />
    </InputWrapper>
  );
};

/**
 * render numerical field
 */
export const AccordionListItemNumber: FC<{
  objKey: string;
  onFieldChange: OnFieldChange;
  path: Array<string | number>;
  value: number;
  allowEditing: boolean;
}> = ({ objKey, onFieldChange, path, value, allowEditing }) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState<number>(value);
  const fieldRef = useRef<HTMLInputElement | null>(null);

  // eslint-disable-next-line sonarjs/no-identical-functions
  const focus = () => {
    setEditing(true);
    // timeout removes focus background of "fake" field
    setTimeout(() => {
      fieldRef?.current?.focus();
    }, 0);
  };

  // eslint-disable-next-line sonarjs/no-identical-functions
  const blur = () => {
    setEditing(false);
    // TODO "value" does not seem to update
    if (editValue !== value) onFieldChange(editValue, path);
  };

  // needed to reset input field if dynamically updated (i.e. from "cancel")
  useEffect(() => {
    if (editValue !== value) setEditValue(value);
  }, [value]);

  if (!editing) {
    return <StaticAccordionItem objKey={objKey} value={editValue} focus={focus} allowEditing={allowEditing} />;
  }

  return (
    <InputWrapper objKey={objKey}>
      <NumberField
        type="text"
        value={editValue}
        onValueChange={(e) => {
          setEditValue(e.value!);
        }}
        disallowEmpty
        onBlur={() => blur()}
        style={{ width: '100%', display: 'flex', justifyContent: 'center', transform: 'translateX(-1.5rem)' }}
        ref={fieldRef}
      />
    </InputWrapper>
  );
};

/**
 * render boolean field
 *
 * TODO Check Me! No boolean values available to test
 */
export const AccordionListItemBoolean: FC<{
  objKey: string;
  value: boolean;
  onFieldChange: OnFieldChange;
  path: Array<string | number>;
  allowEditing: boolean;
}> = ({ objKey, onFieldChange, path, value, allowEditing }) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState<boolean>(value);
  const fieldRef = useRef<HTMLButtonElement | null>(null);

  // eslint-disable-next-line sonarjs/no-identical-functions
  const focus = () => {
    setEditing(true);
    // timeout removes focus background of "fake" field
    setTimeout(() => {
      fieldRef?.current?.focus();
    }, 0);
  };

  // unlike a text-field, we trigger the update immediately on change
  // so blurring is only there to mask the checkbox itself, not to update
  const blur = () => {
    setEditing(false);
  };

  // needed to reset input field if dynamically updated (i.e. from "cancel")
  useEffect(() => {
    if (editValue !== value) setEditValue(value);
  }, [value]);

  if (!editing) {
    return <StaticAccordionItem objKey={objKey} value={`${editValue}`} focus={focus} allowEditing={allowEditing} />;
  }

  return (
    // not sure why it's complaining here, the input is properly wrapped in the label
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <InputWrapper objKey={objKey}>
      <Checkbox
        sx={{ width: '100%', display: 'flex', justifyContent: 'center', transform: 'translateX(-1.5rem)' }}
        checked={value}
        onChange={(e) => onFieldChange(e.target.checked, path)}
        onBlur={() => {
          blur();
        }}
        ref={fieldRef}
      />
    </InputWrapper>
  );
};

/**
 *
 * Creates an accordion
 *
 */
export const TopLevelAccordion: FC<
  PropsWithChildren<{
    label: string;
    icon?: ReactElement<any, any>;
  }>
> = ({ label, icon, children }) => (
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMore />}>
      <AccordionLabel>{label}</AccordionLabel>
      {icon}
    </AccordionSummary>
    <AccordionDetails sx={{ flexDirection: 'column' }}>
      <AccordionList>{children}</AccordionList>
    </AccordionDetails>
  </Accordion>
);

/**
 *
 * Dynamically generate a component based on the type of "value" . Recursive function, assumes valid JSON type for "value".
 *
 * Icon is an optional property, but it will not be passed recursively down the tree. If "icon" is defined, it assumes the highest-level accordion.
 *
 * TODO: explore creating virtualized lists with react-window library
 */
const DynamicAccordion: FC<{
  label: string;
  value: unknown;
  icon?: ReactElement<any, any>;
  onFieldChange: OnFieldChange;
  path: Array<string | number>;
  allowEditing: boolean;
}> = ({ label, value, icon, onFieldChange, path, allowEditing }) => {
  if (Array.isArray(value)) {
    const arrayChildren = value.map((arrayValue, idx) => (
      // eslint-disable-next-line react/no-array-index-key
      <li key={`${idx}-${arrayValue}`}>
        <DynamicAccordion
          label={`${label} (${idx + 1})`}
          value={arrayValue}
          onFieldChange={onFieldChange}
          path={[...path, idx]}
          allowEditing={allowEditing}
        />
      </li>
    ));
    return icon ? (
      <TopLevelAccordion label={label} icon={icon}>
        {arrayChildren}
      </TopLevelAccordion>
    ) : (
      <AccordionList $needsScroll={arrayChildren.length > 10}>{arrayChildren}</AccordionList>
      // <AccordionList>
      //   <FixedSizeList
      //     height={400}
      //     width="100%"
      //     itemSize={45}
      //     itemData={value}
      //     itemCount={value.length}
      //     overscanCount={5}
      //   >
      //     {(vProps) => (
      //       <li style={vProps.style} key={vProps.index}>
      //         <DynamicAccordionProps
      //           label={`${label} (${vProps.index + 1})`}
      //           value={vProps.data}
      //           onFieldChange={onFieldChange}
      //           path={[...path, vProps.index]}
      //         />
      //       </li>
      //     )}
      //     {/* {VirtualizedRow} */}
      //   </FixedSizeList>
      // </AccordionList>
    );
  }
  // MUST check array before object, as arrays are objects
  if (typeof value === 'object') {
    // "null" is also an object and should be handled separately
    if (value !== null) {
      return (
        <TopLevelAccordion label={label} icon={icon}>
          {Object.entries(value)
            .sort((a, b) => a[0].toLowerCase().localeCompare(b[0].toLowerCase(), 'en'))
            .map(([objLabel, objValue]) => (
              <li key={objLabel}>
                <DynamicAccordion
                  label={objLabel}
                  value={objValue}
                  onFieldChange={onFieldChange}
                  path={[...path, objLabel]}
                  allowEditing={allowEditing}
                />
              </li>
            ))}
        </TopLevelAccordion>
      );
    }
    return <StaticAccordionItem objKey={label} value={null} focus={() => {}} allowEditing={false} />;
  }
  if (typeof value === 'boolean') {
    return <AccordionListItemBoolean objKey={label} onFieldChange={onFieldChange} path={path} value={value} allowEditing={allowEditing} />;
  }
  if (typeof value === 'number') {
    return <AccordionListItemNumber objKey={label} onFieldChange={onFieldChange} path={path} value={value} allowEditing={allowEditing} />;
  }
  // indicates string
  return (
    <AccordionListItemString objKey={label} onFieldChange={onFieldChange} path={path} value={value as string} allowEditing={allowEditing} />
  );
};

export default DynamicAccordion;
