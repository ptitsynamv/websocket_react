import C from '../../constants/constants';

export const message = (state = {}, action) => {
    switch (action.type) {
        case C.ADD_MESSAGE:
            return {
                "id": action.id,
                "userId": action.userId,
                "userName": action.userName,
                "comment": action.comment,
                "color": action.color,
                "date": action.date
            };
        default:
            return state
    }
};

export const messages = (state = [], action) => {
    switch (action.type) {
        case C.ADD_MESSAGE:
            return [
                ...state.filter(v => v.id !== action.id),
                message({}, action)
            ];
        default:
            return state
    }
};
