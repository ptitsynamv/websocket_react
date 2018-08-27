import C from '../constants/constants';

export const user = (state = {}, action) => {
    switch (action.type) {
        case C.ADD_USER:
            return {
                "id": action.id,
                "email": action.email,
                "isAdmin": action.isAdmin,
                "isMute": action.isMute,
                "isBan": action.isBan,
                "isOnline": action.isOnline
            };
        case C.MUTE_USER:
            return (state.id !== action.id) ?
                state :
                {
                    ...state,
                    isMute: action.isMute
                };
        case C.BAN_USER:
            return (state.id !== action.id) ?
                state :
                {
                    ...state,
                    isBan: action.isBan
                };
        case C.ONLINE_USER:
            return (state.id !== action.id) ?
                state :
                {
                    ...state,
                    isOnline: action.isOnline
                };
        default:
            return state
    }
};

export const users = (state = [], action) => {
    switch (action.type) {
        case C.ADD_USER:
            return [
                ...state.filter(v => v.id !== action.id),
                user({}, action)
            ];
        case C.MUTE_USER:
            return [
                ...state,
                user({}, action)
            ];
        case C.BAN_USER:
            return [
                ...state,
                user({}, action)
            ];
        case C.ONLINE_USER:
            return [
                ...state,
                user({}, action)
            ];
        default:
            return state
    }
};


