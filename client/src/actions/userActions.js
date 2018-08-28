import C from '../constants/constants'


export const addUser = ({id, email, isAdmin, isMute, isBan, isOnline}) =>
    ({
        type: C.ADD_USER,
        id,
        email,
        isAdmin,
        isMute,
        isBan,
        isOnline
    });


export const muteUser = (id, isMute) =>
    ({
        type: C.MUTE_USER,
        id,
        isMute
    });

export const banUser = (id, isBan) =>
    ({
        type: C.BAN_USER,
        id,
        isBan
    });

export const onlineUser = (id, isOnline) =>
    ({
        type: C.ONLINE_USER,
        id,
        isOnline
    });
