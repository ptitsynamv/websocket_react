import C from '../constants/constants'
import {fetchThenDispatchLogin} from "../lib/api-helpers";

export const loginUser = (email, password, history) => dispatch =>
    fetchThenDispatchLogin(
        dispatch,
        'http://localhost:4000/api/auth/login',
        'POST',
        JSON.stringify({email, password}),
        history
    );


export const logoutUser = () =>
    ({
        type: C.LOGOUT_USER
    });

