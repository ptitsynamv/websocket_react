import { combineReducers } from 'redux'
import * as c from "../constants/ActionTypes";

const users = (state, action) => {
    switch (action.type) {
        case c.LOGIN_REQUEST:
            return {
                ...state,
                inventory: state.inventory - 1
            };
        default:
            return state
    }
};