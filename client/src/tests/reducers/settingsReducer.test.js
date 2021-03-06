/* global window */
import handlebars from 'handlebars';

import ActionType from '../../../src/js/actions/ActionTypes';
import reducer from '../../../src/js/reducers/settingsReducer';

const compile = jest.fn();
compile.mockReturnValue('template');

// setup fetchLocations to use mock function (so it can be checked against later)
handlebars.compile = compile;
jest.setMock('handlebars', handlebars);

/**
 * Tests the default state
 */
test('Settings reducer has a default state', () => {
  expect(reducer(undefined, {
    type: 'invalid-type',
  })).toEqual({
    infoWindowTemplate: null,
    listTemplate: null,
    loadedListTemplate: false,
    loadedSettings: false,
    loadedWindowTemplate: false,
    unit: 'm',
  });
});

/**
 * Tests FETCH_INFO_WINDOW_SUCCESS
 */
test('Settings reducer has a valid state when a fetch info window action is called', () => {
  window.dynamic_locator = {
    unit: 'm',
    clusters: false,
    limit: 0,
    radii: [],
    categories: [],
    listTemplate: '',
    listTemplatePath: '',
    infoWindowTemplate: '',
    infoWindowTemplatePath: '',
  };

  // so settings are loaded
  const state = reducer(undefined, {
    type: ActionType.FETCH_LIST_SUCCESS,
    payload: '',
  });

  expect(reducer(state, {
    type: ActionType.FETCH_INFO_WINDOW_SUCCESS,
    payload: '',
  })).toEqual({
    categories: [],
    clusters: false,
    limit: 0,
    infoWindowTemplate: 'template',
    listTemplate: 'template',
    loadedSettings: true,
    loadedListTemplate: true,
    loadedWindowTemplate: true,
    radii: [],
    unit: 'm',
  });
});

/**
 * Tests FETCH_LIST_SUCCESS with everything is defined
 */
test('Settings reducer has a valid state when a fetch list action is called', () => {
  window.dynamic_locator = {
    unit: 'm',
    clusters: false,
    limit: 0,
    radii: [],
    categories: [],
    listTemplate: '',
    listTemplatePath: '',
    infoWindowTemplate: '',
    infoWindowTemplatePath: '',
  };

  // so settings are loaded
  const state = reducer(undefined, {
    type: ActionType.FETCH_INFO_WINDOW_SUCCESS,
    payload: '',
  });

  expect(reducer(state, {
    type: ActionType.FETCH_LIST_SUCCESS,
    payload: {
      data: '',
    },
  })).toEqual({
    categories: [],
    clusters: false,
    limit: 0,
    infoWindowTemplate: 'template',
    listTemplate: 'template',
    loadedSettings: true,
    loadedListTemplate: true,
    loadedWindowTemplate: true,
    radii: [],
    unit: 'm',
  });
});
