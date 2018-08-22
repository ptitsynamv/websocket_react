import C from '../constants/constants'


export const addMessage = (author, text, color) =>
    ({
        type: C.ADD_MESSAGE,
        id: Math.random(),
        author: author,
        text: text,
        color: color,
        time: new Date().toString(),
    });


