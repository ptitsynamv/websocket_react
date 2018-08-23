import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import App from './components/App';
import storeFactory from './store/storeFactory'
import { Provider } from 'react-redux'

const store = storeFactory(false, window.__INITIAL_STATE__);

window.React = React;
window.store = store;

console.log('current state', store.getState());

ReactDOM.hydrate(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
