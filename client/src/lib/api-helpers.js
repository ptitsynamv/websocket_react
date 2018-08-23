import fetch from 'isomorphic-fetch';
import {history} from "../helpers/history";

const parseResponse = response => response.json();

const logError = error => console.error(error);


export const fetchThenDispatch = (dispatch, url, method, body, actionType) =>
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
                ...jsonData, type: actionType
            }
        })
        .then(dispatch)
        .then(history.push('/chat'))
        .catch(logError);

