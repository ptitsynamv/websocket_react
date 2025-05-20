import {createStore, combineReducers, applyMiddleware} from 'redux'
import {users} from './reducers/userReducers';
import {messages} from "./reducers/messageReducers";
import {currentUser} from "./reducers/currentUserReducers";
import {sort} from "./reducers/sortRedusers";
import {pagination} from "./reducers/paginationReducers";
import {error} from "./reducers/errorRedusers";
//import stateData from './state'
import thunk from 'redux-thunk'

const clientLogger = store => next => action => {
    if (action.type) {
        let result;
        console.groupCollapsed("dispatching", action.type);
        console.log('prev state', store.getState());
        console.log('action', action);
        result = next(action);
        console.log('next state', store.getState());
        console.groupEnd();
        return result
    }
    else {
        return next(action)
    }
};

const serverLogger = store => next => action => {
    console.log('\n  dispatching server action\n');
    console.log(action);
    console.log('\n');
    return next(action)
};

const middleware = server => [
    (server) ? serverLogger : clientLogger,
    thunk
];

const storeFactory = (server = false, initialState = {}) =>
    applyMiddleware(...middleware(server))(createStore)(
        combineReducers({
            users,
            messages,
            currentUser,
            sort,
            pagination,
            error
        }),
        initialState
    );

// const storeFactory = (initialState = stateData) =>
//     applyMiddleware(logger, saver)(createStore)(
//         combineReducers({users, messages, currentUser}),
//         (localStorage['redux-store']) ?
//             JSON.parse(localStorage['redux-store']) :
//             initialState
//     );

export default storeFactory