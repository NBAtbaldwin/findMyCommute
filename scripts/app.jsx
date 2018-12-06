import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root';
import configureStore from './store/store';

document.addEventListener("DOMContentLoaded", () => {
  const preloadedState = {
      map: {
        workplace: null,
        time: null,
        subwayStops: [],
        nbhdPolygons: {},
        boroughPolygon: [],
        borough: 'Brooklyn'
      },
    };
  let store = configureStore(preloadedState);

  ReactDOM.render(<Root store={store} />, root);
});
