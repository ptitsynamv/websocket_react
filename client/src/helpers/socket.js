import io from 'socket.io-client'

let socket;

export const socketClose = () => {
    console.log('socketClose');
    socket.close();
};

export const emitLogin = (token) => {
    return new Promise((resolve, reject) =>{
        if(!socket) {
            socket = io(`http://localhost:4000`);
        }
        resolve(socket.emit('login', token));
    })
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
    return new Promise((resolve, reject) => {
        socket.on('allUsers', (data) => {
            resolve(callback(data))
        })
    })
};

export const subscribeMessage = (callback) => {
    return new Promise((resolve, reject) => {
        socket.on('message', (data) => {
            resolve(callback(data));
        })
    })
};

export const subscribeError = (callback) => {
    socket.on('serverError', (data) => {
        callback(data);
    })
};

export const subscribeDisconnect = (callback) => {
    socket.on("disconnect", (data) => {
        callback(data);
    })
};


