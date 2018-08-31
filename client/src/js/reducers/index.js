import { combineReducers } from 'redux';
import { reducer as ReduxFormReducer } from 'redux-form';

import SchemaReducer from 'state/schema/SchemaReducer';
import search from 'reducers/searchReducer';
import map from 'reducers/mapReducer';
import settings from 'reducers/settingsReducer';
import locations from 'reducers/locationReducer';
import list from 'reducers/listReducer';

const FormReducer = combineReducers({
  formState: ReduxFormReducer,
  formSchemas: SchemaReducer,
});


/**
 * Combines the reducers.
 *
 * uses shorthand to set key/values
 * "search" is short for "search: search"
 *
 * @type {Reducer<any>}
 */
const reducers = combineReducers({
  search,
  map,
  settings,
  locations,
  list,
  form: FormReducer,
});

export default reducers;
