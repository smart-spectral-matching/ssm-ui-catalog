import { FC, Suspense, useEffect, useRef, useState } from 'react';
import { observable, toJS } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { KeyboardArrowLeft, KeyboardArrowRight, MultilineChart, People } from '@mui/icons-material';
import { Button, ButtonGroup, Card, Grid, IconButton, styled, SvgIcon, TextField, Typography } from '@mui/material';

import ZoomableLineChart from 'components/graphs/ZoomableLineChart';
import DynamicAccordion from 'components/tree/DynamicAccordion';
import { useStore } from 'store/providers';
import { isNonEmptyArray, isNonEmptyObject, setNestedKey } from 'utils';

import { ReactComponent as AtomIcon } from 'assets/atom.svg';
import { ReactComponent as FlaskIcon } from 'assets/flask.svg';

const AccordionsContainer = styled('section')(({ theme }) => ({
  margin: theme.spacing(3, 0),
}));

const DataseriesDisplay = styled('span')(() => ({
  display: 'inline-flex',
  alignItems: 'center',
}));

const TextFieldEditor: FC<{
  defaultValue: string;
  propPath: Array<string | number>;
  handleFieldUpdate: (newValue: string | number | boolean, path: Array<string | number>) => void;
  allowEditing: boolean;
  textArea?: boolean;
}> = ({ defaultValue, propPath, handleFieldUpdate, allowEditing, textArea }) => {
  // keep editing localized to this component
  const [editing, setEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>(defaultValue);
  const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const focus = () => {
    setEditing(true);
    // timeout removes focus background of "fake" field
    setTimeout(() => {
      fieldRef?.current?.focus();
    }, 0);
  };

  // "useCallback" with editValue as a dependency isn't needed and causes the entire component tree to be rerendered...
  // const blur = useCallback(() => {
  //   setEditing(false);
  //   handleFieldUpdate(editValue, propPath);
  // }, [editValue]);

  const blur = () => {
    setEditing(false);
    if (editValue !== defaultValue) handleFieldUpdate(editValue, propPath);
  };

  // needed to reset input field if dynamically updated (i.e. from "cancel")
  useEffect(() => {
    if (editValue !== defaultValue) setEditValue(defaultValue);
  }, [defaultValue]);

  if (editing) {
    return (
      <span style={{ display: 'flex' }}>
        <TextField
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => blur()}
          multiline={textArea}
          inputProps={{ ref: fieldRef }}
        />
      </span>
    );
  }
  return (
    <span
      style={{ cursor: allowEditing ? 'pointer' : 'inherit' }}
      role="textbox"
      tabIndex={0}
      onFocus={
        allowEditing
          ? () => {
              focus();
            }
          : undefined
      }
    >
      {editValue}
    </span>
  );
};

// eslint-disable-next-line complexity
const Detail: FC = () => {
  const store = useStore();
  const state = useLocalObservable(() => ({
    /**
     * Clone of the provided BatsModel, used when users are editing fields in EditMode
     */
    workingData: observable.object(toJS(store.model.cachedModel!)),
    /**
     * did user modify form
     */
    dirty: false,
    /**
     * selected dataseries index for chart
     */
    activeDataseriesIdx: 0,
    /**
     * selected dataseries for chart
     *
     * Note that this will NOT be changed as the user edits the form (ONLY once the form is actually saved)
     */
    get selectedDataseries() {
      const dataseries = store.model.cachedModel!.scidata.dataseries;
      if (!isNonEmptyArray(dataseries)) return null;
      return dataseries![state.activeDataseriesIdx];
    },
    /**
     * user wishes to persist their changes
     */
    save: () => {
      // TODO
      // validate, probably needs to be done on the backend
      window.console.log('save');
      // if successful, update the model in the store to equal what we already have and switch back to View Mode
      store.model.syncCacheAndUpdate(observable.object(toJS(state.workingData)));
      state.dirty = false;
    },
    /**
     * user cancels from edit mode
     */
    cancel: () => {
      // reset "editable" model back to initial saved state
      state.workingData = observable.object(toJS(store.model.cachedModel!));
      state.dirty = false;
    },
    /**
     * User has blurred from editable field, so working data needs to be updated.
     *
     * @param newValue
     * @param path path from the root of the BatsModel to the value which will be changed (as an array of object keys or array indexes)
     */
    handleFieldUpdate: (newValue: string | number | boolean, path: Array<string | number>) => {
      if (!path.length) return;
      setNestedKey(state.workingData, path, newValue);
      state.dirty = true;
    },
  }));

  return (
    <>
      <Grid container spacing={4}>
        <Grid item sm={12} component="section" sx={{ width: '100%' }}>
          <Typography variant="h3" align="center">
            <TextFieldEditor
              defaultValue={state.workingData.title ?? ''}
              propPath={['title']}
              handleFieldUpdate={state.handleFieldUpdate}
              allowEditing={store.model.allowEdits}
            />
          </Typography>
        </Grid>
        <Grid
          item
          md={4}
          component="section"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            width: '100%',
          }}
        >
          <Typography variant="h4">Property</Typography>
          <Typography variant="body1">
            <TextFieldEditor
              defaultValue={state.workingData.scidata.property ?? ''}
              propPath={['scidata', 'property']}
              handleFieldUpdate={state.handleFieldUpdate}
              allowEditing={store.model.allowEdits}
            />
          </Typography>
          <Typography variant="h4">Description</Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            <TextFieldEditor
              defaultValue={state.workingData.scidata.description ?? ''}
              propPath={['scidata', 'description']}
              handleFieldUpdate={state.handleFieldUpdate}
              allowEditing={store.model.allowEdits}
              textArea
            />
          </Typography>
        </Grid>
        <Grid item md={8} component="section" sx={{ width: '100%' }}>
          <Card>
            <Suspense fallback={<div>Loading chart...</div>}>
              {state.selectedDataseries ? (
                <ZoomableLineChart dataseries={state.selectedDataseries}>
                  <ButtonGroup variant="outlined" aria-label="Switch Dataset">
                    <IconButton
                      aria-label="previous"
                      title="Go to previous dataset"
                      disabled={state.activeDataseriesIdx === 0}
                      onClick={() => (state.activeDataseriesIdx -= 1)}
                    >
                      <KeyboardArrowLeft />
                    </IconButton>
                    <DataseriesDisplay>
                      {`Dataseries ${state.activeDataseriesIdx + 1} of ${store.model.cachedModel!.scidata.dataseries!.length}`}
                    </DataseriesDisplay>
                    <IconButton
                      aria-label="next"
                      title="Go to next dataset"
                      disabled={state.activeDataseriesIdx === store.model.cachedModel!.scidata.dataseries!.length - 1}
                      onClick={() => (state.activeDataseriesIdx += 1)}
                    >
                      <KeyboardArrowRight />
                    </IconButton>
                  </ButtonGroup>
                </ZoomableLineChart>
              ) : (
                <div>No data available for chart</div>
              )}
            </Suspense>
          </Card>
        </Grid>
      </Grid>
      <AccordionsContainer>
        {isNonEmptyArray(state.workingData.scidata.dataseries) && (
          <DynamicAccordion
            label="Dataseries"
            value={state.workingData.scidata.dataseries}
            icon={<MultilineChart />}
            onFieldChange={state.handleFieldUpdate}
            path={['scidata', 'dataseries']}
            allowEditing={store.model.allowEdits}
          />
        )}
        {isNonEmptyObject(state.workingData.scidata.methodology) && (
          <DynamicAccordion
            label="Method"
            value={state.workingData.scidata.methodology}
            icon={<SvgIcon component={FlaskIcon} viewBox="0 0 512 512" />}
            onFieldChange={state.handleFieldUpdate}
            path={['scidata', 'methodology']}
            allowEditing={store.model.allowEdits}
          />
        )}
        {isNonEmptyObject(state.workingData.scidata.system) && (
          <DynamicAccordion
            label="System"
            value={state.workingData.scidata.system}
            icon={<SvgIcon component={AtomIcon} viewBox="0 0 512 512" />}
            onFieldChange={state.handleFieldUpdate}
            path={['scidata', 'system']}
            allowEditing={store.model.allowEdits}
          />
        )}
        {isNonEmptyObject(state.workingData.scidata.sources) && (
          <DynamicAccordion
            label="Authors"
            value={state.workingData.scidata.sources}
            icon={<People />}
            onFieldChange={state.handleFieldUpdate}
            path={['scidata', 'sources']}
            allowEditing={store.model.allowEdits}
          />
        )}
      </AccordionsContainer>
      {store.model.allowEdits && (
        <ButtonGroup sx={{ width: '100%', justifyContent: 'space-evenly', marginBottom: '1rem' }}>
          <Button
            disabled={!state.dirty}
            variant="contained"
            color="secondary"
            onClick={() => state.cancel()}
            title="Reset your data changes back to their original state on page load."
          >
            Reset Changes
          </Button>
          <Button
            disabled={!state.dirty}
            variant="contained"
            color="success"
            onClick={() => state.save()}
            title="Permanently save your data changes and update the plot chart."
          >
            Save Changes
          </Button>
        </ButtonGroup>
      )}
    </>
  );
};

export default observer(Detail);
