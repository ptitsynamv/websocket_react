import C from '../constants/constants'
import {fetchThenDispatch} from "../lib/api-helpers";

export const loginUser = (email, password) => dispatch =>
    fetchThenDispatch(
        dispatch,
        'http://localhost:4000/api/auth/login',
        'POST',
        JSON.stringify({email, password}),
        C.LOGIN_USER
    );


export const logoutUser = () =>
    ({
        type: C.LOGOUT_USER
    });