import React from 'react'
import App from './components/App';
import { render } from 'react-dom'
import storeFactory from './store/storeFactory'
import { Provider } from 'react-redux'

const store = storeFactory();


console.log('current state', store.getState());



render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
