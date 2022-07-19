import React, { forwardRef, memo, useEffect, useMemo, useRef } from 'react';
import { Input, InputProps } from '@mui/material';

import mergeRefs from './utils/merge-refs';

interface InputNumberChangeParams {
  originalEvent: React.SyntheticEvent<HTMLInputElement>;
  /**
   * if "props.disallowEmpty" is "true", you can safely force cast this to a number
   */
  value: number | null;
}

interface NumberFieldProps extends Omit<InputProps, 'value'> {
  /**
   * bind this value to your reactive state
   */
  value?: number | null;
  /**
   * INCLUSIVE minimum value, will be set to MIN_SAFE_INTEGER if not set
   * note that entering values smaller than this will automatically set the value to this
   */
  min?: number;
  /**
   * INCLUSIVE maximum value, will be set to MAX_SAFE_INTEGER if not set
   * note that entering values larger than this will automatically set the value to this
   */
  max?: number;
  /**
   * If true - onValueChange will emit the number 0 if there is no number in the input field
   * If false/undefined - onValueChange will emit null if there is no number in the input field
   *
   * If the range of props.min and props.max does not include 0, do not set this to true
   */
  disallowEmpty?: boolean;
  /**
   * true for integers only, false/undefined to allow for floating point values
   */
  disableFloatingPoints?: boolean;
  /**
   * use to update your reactive state
   *
   * @param e event
   */
  onValueChange?(e: InputNumberChangeParams): void;
}

/**
 * Component for enforcing numerical input into a text field, and allowing users to bind that value to a number type instead of a string.
 *
 * This component exposes an external ref for the input element (who cares about the div wrapper?), but you should generally only use it
 * to programatically focus/blur from the element. Don't update the value or the selection-state from the external ref, that's managed internally.
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
const NumberField = forwardRef((props: NumberFieldProps, externalRef: React.ForwardedRef<HTMLInputElement>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const emptyValue = useMemo(() => (props.disallowEmpty ? 0 : null), [props.disallowEmpty]);
  const maxValue = props.max ?? Number.MAX_SAFE_INTEGER;
  const minValue = props.min ?? Number.MIN_SAFE_INTEGER;

  if (maxValue < minValue) throw new Error(`NumberField: props.maxValue (${maxValue}) is less than props.minValue (${minValue})`);

  const isCharValid = (char: string) => {
    if (!Number.isNaN(Number.parseFloat(char))) return true;
    if (!props.disableFloatingPoints && (char === '.' || char === '-')) return true;
    return false;
  };

  // the update function guarantees that the state will be updated
  const update = (
    event: React.SyntheticEvent<HTMLInputElement>,
    inputValue: string,
    numberValue: number | null,
    selectionIndex: number,
  ) => {
    // validate the number for safety purposes
    // this has some problems with enormous values
    // other alternatives:
    //   A) store any Javascript values as a string (tricky with JSON schema or JSON-LD, may need to use special JSON parsing logic)
    //   B) use a BigInt library (expensive wrt memory, not supported before ES2020...)
    let finalNumberValue = numberValue;
    let finalStringValue = inputValue;
    if (finalNumberValue != null) {
      if (finalNumberValue < minValue) {
        finalNumberValue = minValue;
        finalStringValue = `${finalNumberValue}`;
      } else if (finalNumberValue > maxValue) {
        finalNumberValue = maxValue;
        finalStringValue = `${finalNumberValue}`;
      }
    }
    // update state binding
    props.onValueChange?.({
      originalEvent: event,
      value: finalNumberValue,
    });
    window.console.log(finalStringValue, finalNumberValue);
    // update input
    inputRef.current!.value = finalStringValue;
    // update input cursor
    inputRef.current!.setSelectionRange(selectionIndex, selectionIndex);
  };

  /**
   * @param text value inserted from user (either on key press or on paste)
   * @returns
   *   object.result the value the input field would have if we weren't performing validation
   *   object.cursorPosition the cursor position the input field would have if we weren't performing validation
   */
  const getProposedInsertValue = (text: string) => {
    const inputValue = inputRef.current!.value;
    const fullLength = inputValue.length;
    const start = inputRef.current!.selectionStart ?? 0;
    const end = inputRef.current!.selectionEnd ?? fullLength;

    let result!: string;
    let cursorPosition!: number;
    if (end - start === inputValue.length) {
      // replace entire text
      result = text;
      cursorPosition = text.length;
    } else if (start === 0) {
      // append to beginning
      result = `${text}${inputValue.slice(end)}`;
      cursorPosition = text.length;
    } else if (end === fullLength) {
      // append to end
      result = `${inputValue.slice(0, start)}${text}`;
      cursorPosition = end + text.length;
    } else {
      // append between two points
      result = `${inputValue.slice(0, start)}${text}${inputValue.slice(end)}`;
      cursorPosition = start + text.length;
    }

    return { result, cursorPosition };
  };

  const tryInsert = (event: React.SyntheticEvent<HTMLInputElement>, textToInsert: string) => {
    // at this point, we have validated that the string will only contain
    // numbers / hyphens (if floating point not disabled) / decimals (if floating point not disabled)
    const { result, cursorPosition } = getProposedInsertValue(textToInsert);
    event.preventDefault();

    const numberValue = Number.parseFloat(result);
    const isNumber = !Number.isNaN(numberValue) && result !== '';

    // handle possibility of more than one decimal sign
    const decimals = result.split('.');
    if (decimals.length > 2) {
      return false;
    }

    // handle possibility of more than one minus sign, or a minus sign being after a numerical value
    const hyphens = result.split('-');
    if (hyphens.length > 2 || (hyphens.length === 2 && hyphens[0] !== '' && hyphens[0] !== '-')) {
      return false;
    }

    // handle update
    update(event, result, isNumber ? numberValue : emptyValue, cursorPosition);

    return true;
  };

  const deleteRange = (value: string, start: number, end: number) => {
    if (end - start === value.length)
      // delete entire value
      return '';
    if (start === 0)
      // delete from start
      return value.slice(end);
    if (end === value.length)
      // delete from end
      return value.slice(0, start);
    // delete between two points
    return value.slice(0, start) + value.slice(end);
  };

  const deleteChars = (event: React.KeyboardEvent<HTMLInputElement>, backspace: boolean) => {
    const inputValue = inputRef.current!.value;
    const selectionStart = inputRef.current!.selectionStart ?? 0;
    const selectionEnd = inputRef.current!.selectionEnd ?? inputValue.length;

    let strValue!: string;
    let cursorPosition!: number;
    if (selectionStart === selectionEnd) {
      if (backspace) {
        if (!selectionStart) {
          // backspace at beginning of input field must be ignored
          event.preventDefault();
          return;
        }
        strValue = inputValue.slice(0, selectionStart - 1) + inputValue.slice(selectionStart);
        cursorPosition = selectionStart - 1;
      } else {
        strValue = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 1);
        cursorPosition = selectionStart;
      }
    } else {
      strValue = deleteRange(inputValue, selectionStart, selectionEnd);
      cursorPosition = selectionStart;
    }
    event.preventDefault();

    const numberValue = Number.parseFloat(strValue);
    const isNumber = !Number.isNaN(numberValue) && strValue !== '';

    update(event, strValue, isNumber ? numberValue : emptyValue, cursorPosition);
  };

  /**
   * Manage keyboard events for Del and Backspace
   */
  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (props.disabled || props.readOnly) {
      return;
    }
    // never override browser/OS defaults
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    switch (event.key) {
      case 'Backspace':
        event.preventDefault();
        // it's not possible to transform a valid value to an invalid value, so just update
        deleteChars(event, true);
        break;
      case 'Delete':
        event.preventDefault();
        // it's not possible to transform a valid value to an invalid value, so just update
        deleteChars(event, false);
        break;
      default:
        break;
    }

    props.onKeyDown?.(event);
  };

  /**
   * manage *most* keyboard inputs, except for "Delete" and "Backspace"
   */
  const onInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (props.disabled || props.readOnly) return;

    const char = event.key;

    // length > 1 means character is not an input character, so return early
    if (char.length !== 1) return;

    if (!isCharValid(char)) {
      event.preventDefault();
      return;
    }

    if (tryInsert(event, char)) props.onKeyPress?.(event);
  };

  /**
   * Manage paste attempts into the text input
   *
   * Note: this does NOT fire in Firefox if "dom.event.clipboardevents.enabled" is set to "false" from about:config
   * It will instead go into the InputKeyDown function, then exit out immediately (since ctrl key input is ignored)
   */
  const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    if (props.disabled || props.readOnly) return;
    const clipboard = event.clipboardData.getData('Text');
    if (!clipboard) {
      event.preventDefault();
      return;
    }

    // loop over each letter pasted and if any fail prevent the paste
    for (let i = 0; i < clipboard.length; i++) {
      const char = clipboard.charAt(i);
      if (!isCharValid(char)) {
        event.preventDefault();
        return;
      }
    }

    if (tryInsert(event, clipboard)) props.onPaste?.(event);
  };

  // update input value if model state is changed from props
  useEffect(() => {
    const stringValue = inputRef.current!.value;
    const parsedValue = Number.parseFloat(stringValue);
    const numberValue = Number.isNaN(parsedValue) || stringValue === '' ? emptyValue : parsedValue;
    if (props.value !== numberValue) {
      inputRef.current!.value = `${props.value ?? ''}`;
    }
  }, [props.value]);

  return (
    <Input
      {...props}
      value={undefined} // don't manage value in a reactive state
      inputProps={{
        ref: mergeRefs([inputRef, externalRef]),
        inputMode: props.disableFloatingPoints ? 'numeric' : 'decimal',
        onPaste,
        onKeyPress: onInputKeyPress,
        onKeyDown: onInputKeyDown,
      }}
    />
  );
});

export default memo(NumberField);
