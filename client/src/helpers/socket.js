import io from 'socket.io-client'

let socket;

export const socketClose = () => {
    console.log('socketClose');
    socket.close();
};

export const emitLogin = (token) => {
    console.log('emitLogin');
    socket = io(`http://localhost:4000`);
    socket.emit('login', token);
};

export const emitLogout = (token) => {
    socket.emit('logout', token);
};

export const emitMessage = ({sender, comment}) => {
    socket.emit('message', {sender, comment});
};

export const emitGetPreviousMessage = (skip, limit) => {
    socket.emit('getPreviousMessage', {
        paginationSkip: skip,
        paginationLimit: limit
    });
};

export const emitBan = ({userForBanId, sender}) => {
    socket.emit("ban", {userForBanId, sender});
};

export const emitMute = ({userForMuteId, sender}) => {
    socket.emit("mute", {userForMuteId, sender});
};


export const subscribeAllUsers = (callback) => {
    socket.on('allUsers', (data) => {
        callback(data);
    }, (data) => {
        console.log('subscribeAllUsers callback', data);
    })
};

export const subscribeMessage = (callback) => {
    socket.on('message', (data) => {
        callback(data);
    })
};

export const subscribeError = (callback) => {
    socket.on('serverError', (data) => {
        console.log('serverError', data);
        callback(data);
    })
};

export const subscribeDisconnect = (callback) => {
    socket.on("disconnect", (data) => {
        console.log('disconnect', data);
        callback(data);
    })
};


