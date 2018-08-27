import C from '../constants/constants';


const setCurrentUserToLocalStorage = ({id, email, isAdmin, isMute, isBan, token}) => {
    localStorage.setItem('user', JSON.stringify({
        id, email, isAdmin, isMute, isBan, token
    }));
};

const getCurrentUserFromLocalStorage = () => {
    let user = JSON.parse(localStorage.getItem('user'));
    return user ? {...user} : {};
};

const removeCurrentUserFromLocalStorage = () => {
    localStorage.removeItem('user');
};

export const currentUser = (state = getCurrentUserFromLocalStorage(), action) => {
    switch (action.type) {
        case C.LOGIN_USER:
            setCurrentUserToLocalStorage({...action});
            return {
                "id": action.id,
                "email": action.email,
                "isAdmin": action.isAdmin,
                "isMute": action.isMute,
                "isBan": action.isBan,
                "token": action.token
            };
        case C.LOGOUT_USER:
            removeCurrentUserFromLocalStorage();
            return {};
        default:
            return state
    }
};