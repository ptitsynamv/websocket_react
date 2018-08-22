import C from '../constants/constants';

export const user = (state = {}, action) => {
    switch (action.type) {
        case C.ADD_USER:
            return {
                "id": action.id,
                "email": action.email,
                "isAdmin": action.isAdmin,
                "isMute": action.isMute,
                "isBan": action.isBan
            };
        default:
            return state
    }
};

export const users = (state = [], action) => {
    switch (action.type) {
        case C.ADD_USER:
            return [
                ...state,
                user({}, action)
            ];
        default:
            return state
    }
};
