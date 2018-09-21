/* global window, document */
import React from 'react';
import ReactDom from 'react-dom';

import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux';
import { Provider } from 'react-redux';

import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import Injector from 'lib/Injector';

import registerComponents from 'boot/registerComponents';
import registerReducers from 'reducers';
import renderComponent from 'renderComponent';

import Loading from 'containers/Loading';

const finalCreateStore = compose(
  applyMiddleware(thunk, promise({
    // new suffixes
    promiseTypeSuffixes: ['LOADING', 'SUCCESS', 'ERROR'],
  }))
)(createStore);

document.addEventListener('DOMContentLoaded', () => {
  registerComponents();
  registerReducers();

  Injector.ready(() => {
    window.setTimeout(() =>
      // renders the locator
      renderComponent(<Loading store={window.ss.store}/>, window.ss.store, '.locator-loading'),
      0
    );
  });
});
