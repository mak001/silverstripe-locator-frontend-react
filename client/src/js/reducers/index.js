import {combineReducers} from 'redux';
import {reducer as ReduxFormReducer} from 'redux-form';
import Injector from 'lib/Injector';

import search from 'reducers/searchReducer';
import map from 'reducers/mapReducer';
import settings from 'reducers/settingsReducer';
import locations from 'reducers/locationReducer';
import list from 'reducers/listReducer';

const registerReducers = () => {
  Injector.reducer.register('locator', combineReducers({
      search,
      map,
      settings,
      locations,
      list,
    })
  );
};

export default registerReducers;
