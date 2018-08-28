import fetch from 'isomorphic-fetch';
import C from "../constants/constants";
import {addError} from "../actions/errorAction";

const parseResponse = response => response.json();

const logError = error => {
    console.error(error);
    window.store.dispatch(addError({code: 500, error}));
};

const authHeader = () => {
    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
        return {'Authorization': 'Bearer ' + user.token};
    }
    return {};
};

export const fetchThenDispatchLogin = (dispatch, url, method, body, history) =>
    fetch(url,
        {
            method,
            body,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }
    )
        .then(parseResponse)
        .then(jsonData => {
            return {
                ...jsonData, type: C.LOGIN_USER
            }
        })
        .then(dispatch)
        .then(() => history.push('/chat'))
        .catch(logError);


export const getAbout = () => {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`http://localhost:4000/api/about/service`, requestOptions)
        .then(parseResponse)
        .then(jsonData => jsonData.text)
        .catch(logError);
};

