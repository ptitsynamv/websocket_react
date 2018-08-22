import C from '../constants/constants'


export const addUser = (email, isAdmin, isMute, isBan) =>
    ({
        type: C.ADD_USER,
        id: Math.random(),
        email,
        isAdmin,
        isMute,
        isBan
    });


