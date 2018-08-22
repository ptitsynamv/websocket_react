import React from 'react'
import App from './component/App';
import { render } from 'react-dom'
import storeFactory from './store/storeFactory'
import { addUser } from './actions/userActions';
import {addMessage} from "./actions/messageActions";

const store = storeFactory();

store.dispatch(addUser("w@w.com", false, true, true));
store.dispatch(addMessage("w@w.com", "text w@w.com", "blue"));

console.log('current state', store.getState());


render(
    <App/>,
    document.getElementById('root')
);
