import C from '../constants/constants';

export const currentUser = (state = {}, action) => {
    switch (action.type) {
        case C.LOGIN_USER:
            return {
                "id": action.id,
                "email": action.email,
                "isAdmin": action.isAdmin,
                "isMute": action.isMute,
                "isBan": action.isBan,
                "token": action.token
            };
        case C.LOGOUT_USER:
            return {};
        default:
            return state
    }
};