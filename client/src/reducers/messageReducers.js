import C from '../constants/constants';

export const message = (state = {}, action) => {
    switch (action.type) {
        case C.ADD_MESSAGE:
            return {
                "id": action.id,
                "author": action.author,
                "text": action.text,
                "color": action.color,
                "time": action.time,
            };
        default:
            return state
    }
};

export const messages = (state = [], action) => {
    switch (action.type) {
        case C.ADD_MESSAGE:
            return [
                ...state,
                message({}, action)
            ];
        default:
            return state
    }
};
