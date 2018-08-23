import {createStore, combineReducers, applyMiddleware} from 'redux'
import {users} from '../reducers/userReducers';
import {messages} from "../reducers/messageReducers";
import {currentUser} from "../reducers/currentUserReducers";
import stateData from './state'

const logger = store => next => action => {
    let result;
    console.groupCollapsed("dispatching", action.type);
    console.log('prev state', store.getState());
    console.log('action', action);
    result = next(action);
    console.log('next state', store.getState());
    console.groupEnd();
    return result
};

const saver = store => next => action => {
    let result = next(action);
    localStorage['redux-store'] = JSON.stringify(store.getState());
    return result
};

const storeFactory = (initialState = stateData) =>
    applyMiddleware(logger, saver)(createStore)(
        combineReducers({users, messages, currentUser}),
        (localStorage['redux-store']) ?
            JSON.parse(localStorage['redux-store']) :
            initialState
    );

export default storeFactory