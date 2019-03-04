import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware , compose} from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import App from './App';

const createStoreWithMiddleware = applyMiddleware()(createStore);
const store = createStoreWithMiddleware(function(state, action) {
  const _state = state == null ? {
    donate: '',
    message: '',
  } : state;

  switch (action.type) {
    case 'UPDATE_TOTAL_DONATE':
      return Object.assign({}, _state, {
        donate: isNaN(_state.donate) ? action.amount : _state.donate + action.amount,
      });
    case 'UPDATE_MESSAGE':
      return Object.assign({}, _state, {
        message: action.message,
      });

    default: return _state;
  }
}, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
