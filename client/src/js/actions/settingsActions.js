/* global window, dynamic_locator */
import axios from 'axios';

import ActionType from 'actions/ActionTypes';

// eslint-disable-next-line import/prefer-default-export
export function fetchMapStyle() {
  const { protocol, host } = window.location;
  const path = dynamic_locator.mapStylePath;

  // so we don't try to fetch the home page of the site
  if (path === '') {
    return {
      type: ActionType.FETCH_MAP_STYLE_ERROR,
      payload: ActionType.FETCH_MAP_STYLE_ERROR,
    };
  }

  return {
    type: ActionType.FETCH_MAP_STYLE,
    payload: axios.get(`${protocol}//${host}/${path}`),
  };
}

export function fetchFormSchema() {
  const { protocol, host, pathname } = window.location;
  return {
    type: ActionType.FETCH_FORM_SCHEMA,
    payload: axios.get(`${protocol}//${host}${pathname}/schema`, {
      headers: {
        'X-Formschema-Request': 'auto,schema,state,errors',
      },
      responseType: 'json',
      responseEncoding: 'utf8',
    }),
  };
}
