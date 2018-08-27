import fetch from 'isomorphic-fetch';
import C from "../constants/constants";

const parseResponse = response => response.json();

const logError = error => console.error(error);


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

