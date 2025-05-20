const User = require('../models/User');
const Message = require('../models/Message');
const helpFunctions = require('../soft/helpFunctions');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');


let allUsers = new Map();
let peers = new Map();


function getLastMessages(limit = 2, skip = 0, currentSocket = false) {
    let messageArray = [];
    Message
        .find({})
        .populate('user')
        .sort({date: -1})
        .limit(limit)
        .skip(skip)
        .exec(function (err, allModels) {
            if (err) {
                helpFunctions.errorSocket(currentSocket, err, 500);
            }
            allModels.forEach((value) => {
                messageArray.push({
                    id: value._id,
                    userId: value.user._id,
                    userName: value.user.email,
                    comment: value.comment,
                    color: value.user.color,
                    date: value.date,
                });
            });

            emitEvent(
                'message',
                {
                    isNewMessage: false,
                    message: messageArray,
                },
                currentSocket
            );
        });
}

function emitEvent(nameEvent, message, currentSocket = false) {
    if (currentSocket) {
        currentSocket.emit(nameEvent, message);
    } else {
        peers.forEach((value) => {
            value.emit(nameEvent, message);
        });
    }
}

function updateUsers(userUpdate = null) {
    if (userUpdate) {
        allUsers.set(userUpdate._id.toString(), {
            id: userUpdate._id,
            email: userUpdate.email,
            isAdmin: userUpdate.isAdmin,
            isBan: userUpdate.isBan,
            isMute: userUpdate.isMute,
        });
    }
    allUsers.forEach((value, key) => {
        allUsers.get(key).isOnline = peers.has(key);
    });
    emitEvent('allUsers', helpFunctions.mapToObj(allUsers));
}

const loginCallback = (socket, data) => {
    return new Promise((resolve, reject) => {
        if (!data) {
            return reject({
                socket,
                message: `Login data is uncorrected : ${data}`,
                code: 404
            })
        }
        resolve(data)
    })
        .then(data => {
            return new Promise((resolve, reject) => {
                return jwt.verify(data, keys.jwt, (err, decodedCurrentUser) => {
                    if (err) {
                        return reject({err})
                    }
                    resolve(decodedCurrentUser)
                })
            })
        })
        .then(decodedCurrentUser => {
            return new Promise((resolve, reject) => {
                if (!decodedCurrentUser) {
                    return reject({
                        socket,
                        message: '[login] The tokens lifetime has expired',
                        code: 401,
                    })
                }
                if (!decodedCurrentUser.userId) {
                    return reject({
                        socket,
                        message: '[login] Login decodedCurrentUser is uncorrected',
                        code: 400,
                    })
                }
                resolve(decodedCurrentUser)
            });
        })
        .then(decodedCurrentUser => {
            //TODO the same user is authorized at the same time from different locations
            peers.set(decodedCurrentUser.userId, socket);
            return decodedCurrentUser;
        })
        .then(decodedCurrentUser => {
            return new Promise((resolve, reject) => {
                User.findById(decodedCurrentUser.userId, (err, currentUser) => {
                    if (err) {
                        return reject({err, socket, code: 500})
                    }

                    if (!currentUser) {
                        return reject({
                            socket,
                            message: `[login] Current user for login with id: ${decodedCurrentUser.userId} is not found`,
                            code: 404
                        });
                    }
                    if (currentUser.isBan) {
                        if (peers.has(decodedCurrentUser.userId)) {
                            (peers.get(decodedCurrentUser.userId)).disconnect();
                            peers.delete(decodedCurrentUser.userId);
                        }
                        return reject({
                            socket,
                            message: `[login] Current user with id: ${decodedCurrentUser.userId} isBan`,
                            code: 403
                        });
                    }
                    resolve();
                })
            })
        })
        .then(_ => {
            return new Promise((resolve, reject) => {
                User.find({}, (err, allModels) => {
                    if (err) {
                        return reject({err, socket, code: 500})
                    }
                    allModels.forEach((value) => {
                        allUsers.set(value._id.toString(), {
                            id: value._id,
                            email: value.email,
                            isAdmin: value.isAdmin,
                            isBan: value.isBan,
                            isMute: value.isMute,
                        });
                    });
                    updateUsers();
                    getLastMessages(2, 0, socket);
                    resolve();
                });
            })
        })
        .catch(({err, socket, message, code}) => {
            if (err) {
                // TODO
            }
            helpFunctions.errorSocket(socket, message, code);
        });
};

function asyncFlowWithThunks(generatorFunction) {
    function callback(err) {
        if (err) {
            return generator.throw(err);
        }
        const results = [].slice.call(arguments, 1);
        const thunk = generator.next(results.length > 1 ? results : results[0]).value;
        thunk && thunk(callback);
    }

    // first start
    const generator = generatorFunction();
    const thunk = generator.next().value;
    thunk && thunk(callback);
}

function* messageCallback(message) {
    const decodedCurrentUser = yield jwt.verify(
        message.sender,
        keys.jwt,
        (err, decodedCurrentUser) => ({
            err,
            decodedCurrentUser
        }));
    const user = yield User
        .findOne({_id: decodedCurrentUser.userId})
        .exec()
        .then(currentUser => currentUser)
        .catch(err => err);

    return 'finish';
}


module.exports = function (wss) {
    wss.on('connection', (socket) => {

        socket.on('login', data => loginCallback(socket, data));

        socket.on('logout', (data) => {
            if (!data) {
                helpFunctions.errorSocket(socket, `[logout] Logout data is uncorrected : ${data}`, 400);
                return;
            }
            let decodedCurrentUser = jwt.decode(data);

            if (!decodedCurrentUser || !decodedCurrentUser.userId) {
                helpFunctions.errorSocket(socket, `[logout] Logout data is uncorrected : ${data}`, 400);
                return;
            }

            if (peers.has(decodedCurrentUser.userId)) {
                peers.delete(decodedCurrentUser.userId);
                updateUsers();
            }
        });

        socket.on('disconnect', (data) => {
            console.log('disconnect', data);
        });

        socket.on('message', (message) => {
            if (!message || !message.sender) {
                return helpFunctions.errorSocket(socket, `[message] message data is uncorrected : ${message}`, 400);
            }

            const gen = messageCallback(message);
            const valueDecoded = gen.next().value;
            if (valueDecoded.err) {
                return helpFunctions.errorSocket(socket, '[message] The tokens lifetime has expired', 401);
            }
            const valueUser = gen.next(valueDecoded).value;
            console.log('valueUser', valueUser);
            return
            if (valueUser.err) {
                return helpFunctions.errorSocket(socket, valueUser.err, 500);
            }

            console.log('valueUser', valueUser.currentUser);


            jwt.verify(message.sender, keys.jwt, function (err, decodedCurrentUser) {
                if (!decodedCurrentUser) {
                    helpFunctions.errorSocket(socket, '[message] The tokens lifetime has expired', 401);
                    return;
                }

                User.findOne({_id: decodedCurrentUser.userId}, (err, currentUser) => {
                    if (err) {
                        helpFunctions.errorSocket(socket, err, 500);
                        return;
                    }
                    if (!currentUser) {
                        helpFunctions.errorSocket(socket, `[message] Current user with id: ${decodedCurrentUser.userId} is not found`, 404);
                        return;
                    }
                    if (currentUser.isMute) {
                        helpFunctions.errorSocket(socket, `[message] Current user with id: ${decodedCurrentUser.userId} is mute`, 403);
                        return;
                    }


                    Message
                        .findOne({user: decodedCurrentUser.userId})
                        .sort({date: -1})
                        .exec((err, lastUsersMessage) => {
                            if (err) {
                                helpFunctions.errorSocket(socket, err, 500);
                                return;
                            }
                            if (lastUsersMessage && (Date.now() - Date.parse(lastUsersMessage.date)) / 1000 < 15) {
                                helpFunctions.errorSocket(socket, `[message] Last users with id: ${decodedCurrentUser.userId} message was send less then 15 seconds`, 400);
                                return;
                            }

                            new Message({
                                user: decodedCurrentUser.userId,
                                comment: message.comment
                            }).save(err => {
                                if (err) {
                                    helpFunctions.errorSocket(socket, err, 500);
                                }
                            });

                            emitEvent('message', {
                                isNewMessage: true,
                                message: [{
                                    userId: currentUser._id,
                                    userName: currentUser.email,
                                    comment: message.comment,
                                    color: currentUser.color,
                                    date: new Date(),
                                }]
                            });
                        });
                });
            });
        });

        socket.on('mute', (message) => {

            if (!message || !message.sender) {
                helpFunctions.errorSocket(socket, `[mute] mute data is uncorrected : ${message}`, 400);
                return;
            }
            jwt.verify(message.sender, keys.jwt, function (err, decodedCurrentUser) {
                if (!decodedCurrentUser) {
                    helpFunctions.errorSocket(socket, '[mute] The tokens lifetime has expired', 401);
                    return;
                }
                User.findOne({_id: decodedCurrentUser.userId}, (err, currentUser) => {
                    if (err) {
                        helpFunctions.errorSocket(socket, err, 500);
                        return;
                    }
                    if (!currentUser) {
                        helpFunctions.errorSocket(socket, `[mute] Current user with id: ${decodedCurrentUser.userId} is not found`, 404);
                        return;
                    }
                    if (!currentUser.isAdmin) {
                        helpFunctions.errorSocket(socket, `[mute] Current user with id: ${decodedCurrentUser.userId} is not admin`, 403);
                        return;
                    }

                    User.findOne({_id: message.userForMuteId}, (err, userMute) => {
                        if (err) {
                            helpFunctions.errorSocket(socket, err, 500);
                            return;
                        }
                        if (!userMute) {
                            helpFunctions.errorSocket(socket, `[mute] User for mute with id: ${decodedCurrentUser.userId} not found`, 404);
                            return;
                        }
                        if (userMute.isAdmin) {
                            helpFunctions.errorSocket(socket, `[mute] User for mute with id: ${decodedCurrentUser.userId} is admin`, 400);
                            return;
                        }

                        userMute.isMute = !userMute.isMute;
                        userMute.save((err) => {
                            if (err) {
                                helpFunctions.errorSocket(socket, err, 500);
                                return;
                            }
                            updateUsers(userMute);
                        });
                    });
                });
            });
        });

        socket.on('ban', (message) => {
            if (!message || !message.sender) {
                helpFunctions.errorSocket(socket, `[Ban] Ban data is uncorrected : ${message}`, 400);
                return;
            }
            jwt.verify(message.sender, keys.jwt, function (err, decodedCurrentUser) {
                if (!decodedCurrentUser) {
                    helpFunctions.errorSocket(socket, '[Ban] The tokens lifetime has expired', 401);
                    return;
                }

                User.findOne({_id: decodedCurrentUser.userId}, (err, currentUser) => {
                    if (err) {
                        helpFunctions.errorSocket(socket, err, 500);
                        return;
                    }
                    if (!currentUser) {
                        helpFunctions.errorSocket(socket, `[Ban] Current user with id: ${decodedCurrentUser.userId} is not found`, 404);
                        return;
                    }
                    if (!currentUser.isAdmin) {
                        helpFunctions.errorSocket(socket, `[Ban] Current user with id: ${decodedCurrentUser.userId} is not admin`, 403);
                        return;
                    }

                    User.findOne({_id: message.userForBanId}, function (err, userBan) {
                        if (err) {
                            helpFunctions.errorSocket(socket, err, 500);
                            return;
                        }
                        if (!userBan) {
                            helpFunctions.errorSocket(socket, `[Ban] User for ban with id: ${decodedCurrentUser.userId} is not found`, 404);
                            return;
                        }
                        if (userBan.isAdmin) {
                            helpFunctions.errorSocket(socket, `[Ban] User for ban with id: ${decodedCurrentUser.userId} is admin`, 400);
                            return;
                        }

                        if (!userBan.isBan) {
                            if (peers.has(message.userForBanId)) {
                                (peers.get(message.userForBanId)).disconnect();
                                peers.delete(message.userForBanId);
                            }
                        }

                        userBan.isBan = !userBan.isBan;
                        userBan.save(function (err) {
                            if (err) {
                                helpFunctions.errorSocket(socket, err, 500);
                                return;
                            }
                            updateUsers(userBan);
                        });
                    });
                });
            });
        });

        socket.on('getPreviousMessage', (message) => {

            if (!message || !message.paginationLimit) {
                helpFunctions.errorSocket(socket, `[getPreviousMessage] data is uncorrected : ${message}`, 400);
                return;
            }

            getLastMessages(message.paginationLimit, message.paginationSkip, socket)
        });
    })
};


