import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root';
import configureStore from './store/store';

document.addEventListener("DOMContentLoaded", () => {
  const preloadedState = {
      map: {
        workplace: null,
      },
    };
  let store = configureStore(preloadedState);

  ReactDOM.render(<Root store={store} />, root);
});
