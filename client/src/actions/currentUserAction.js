import C from '../constants/constants'

// export const loginUser = (id, email, isAdmin, isMute, isBan, isOnline) =>
//     ({
//         type: C.LOGIN_USER,
//         id,
//         email,
//         isAdmin,
//         isMute,
//         isBan,
//         isOnline
//     });

//TODO заглушка
export const loginUser = (email, password) =>
    ({
        type: C.LOGIN_USER,
        id:1,
        email,
        isAdmin: true,
        isMute: true,
        isBan: true,
        isOnline: true
    });


export const logoutUser = () =>
    ({
        type: C.LOGOUT_USER
    });