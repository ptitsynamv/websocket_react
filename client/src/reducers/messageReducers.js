import C from '../constants/constants';

export const message = (state = {}, action) => {
    switch (action.type) {
        case C.ADD_MESSAGE:
            return {
                "userId":action.userId,
                "userName":action.userName,
                "comment":action.comment,
                "color":action.color,
                "date":action.date
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
