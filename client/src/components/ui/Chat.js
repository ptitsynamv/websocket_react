import React from 'react';
import PropTypes from 'prop-types'
import {
    emitLogin,
    subscribeAllUsers,
    emitLogout,
    subscribeMessage,
    emitGetPreviousMessage,
    emitMessage,
    subscribeError,
    emitBan,
    emitMute,
    subscribeDisconnect,
    socketClose
} from "../../helpers/socket";
import C from '../../constants/constants'

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isExistPreviousMessage: true,
            isCanSendMessage: true
        };
        console.log('currentUser', this.props.currentUser);

        this.submit = this.submit.bind(this);
        this.showPreviousMessage = this.showPreviousMessage.bind(this);
        this.onBan = this.onBan.bind(this);
        this.onMute = this.onMute.bind(this);
    }

    componentDidMount() {
        emitLogin(this.props.currentUser.token);

        subscribeAllUsers(data => {
            Object.values(data).forEach((value, i) => {
                this.props.onAllUser(value);
            });
        });

        subscribeMessage(data => {
            if (data.message.length < this.props.pagination[C.PAGINATION_LIMIT] && !data.isNewMessage) {
                this.setState({isExistPreviousMessage: false});
            }
            data.message.forEach(value => this.props.onMessage(value));
        });

        subscribeError(data => {

        });

        subscribeDisconnect(data => {

        });
    }

    componentWillUnmount() {
        emitLogout(this.props.currentUser.token);
        socketClose();
    }

    submit(e) {
        e.preventDefault();
        if (this.props.currentUser.isMute || this.props.currentUser.isBan || !this.state.isCanSendMessage) {
            return;
        }

        this.setState({isCanSendMessage: false});
        const {_message} = this.refs;

        emitMessage({
            sender: this.props.currentUser.token,
            comment: _message.value
        });

        _message.value = 'masha';
        setTimeout(() => {
            this.setState({isCanSendMessage: true});
        }, 15000);
    }

    showPreviousMessage(e) {
        e.preventDefault();
        this.props.onGetPreviousMessage()
            .then(result => {
                emitGetPreviousMessage(this.props.pagination[C.PAGINATION_SKIP], this.props.pagination[C.PAGINATION_LIMIT])
            });
    }

    onBan(userId) {
        if (!this.props.currentUser.isAdmin) {
            return;
        }
        emitBan({
            userForBanId: userId,
            sender: this.props.currentUser.token
        })
    }

    onMute(userId) {
        if (!this.props.currentUser.isAdmin) {
            return;
        }
        emitMute({
            userForMuteId: userId,
            sender: this.props.currentUser.token
        })
    }


    render() {
        const {currentUser, users, sortMessages} = this.props;
        const {isExistPreviousMessage, isCanSendMessage} = this.state;

        return (
            <div className="row">
                <div className="col-md-4">
                    {currentUser.email}

                    {users && <ul className="list-group">
                        {users
                            .filter(v => v.id !== currentUser.id)
                            .map((user, i) =>
                                <li
                                    className="list-group-item"
                                    key={i}
                                >{user.isOnline && 'Online'} {user.email}
                                    {currentUser.isAdmin &&
                                    <div className="d-flex flex-column bd-highlight mb-2">
                                        <div className="p-2 bd-highlight">
                                            <button
                                                type="button"
                                                className="btn btn-warning btn-sm"
                                                onClick={this.onMute.bind(this, user.id)}
                                            >
                                                {user.isMute ? 'UnMute' : 'Mute'}
                                            </button>
                                        </div>
                                        <div className="p-2 bd-highlight">
                                            <button
                                                type="button"
                                                className="btn btn btn-danger btn-sm"
                                                onClick={this.onBan.bind(this, user.id)}
                                            >
                                                {user.isBan ? 'UnBan' : 'Ban'}
                                            </button>
                                        </div>
                                    </div>
                                    }
                                </li>
                            )}
                    </ul>}

                </div>
                <div className="col-md-8">
                    <div className="col">
                        {isExistPreviousMessage &&
                        <div className="text-center">
                            <button type="button" className="btn btn-info" onClick={this.showPreviousMessage}>
                                Show Previous Message!
                            </button>
                        </div>
                        }

                        {sortMessages && sortMessages.length !== 0 &&
                        sortMessages.map((message, i) =>
                            <div className={message.userId !== currentUser.id ? 'sender rounded' : 'receiver rounded'}>

                                <div
                                    className={message.userId !== currentUser.id ? 'd-flex flex-row bd-highlight mb-3' : 'd-flex flex-row-reverse bd-highlight mb-3'}>

                                    <div className="p-2 bd-highlight" style={{backgroundColor: message.color}}>
                                        <div>{message.userName}:</div>
                                        {message.comment}
                                    </div>
                                </div>
                            </div>
                        )
                        }
                    </div>

                    <div className="w-100"></div>
                    <div className="col">
                        <form onSubmit={this.submit}>
                            <textarea ref="_message" required defaultValue="masha"/>
                            <button disabled={!isCanSendMessage && currentUser.isMute}>
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

Chat.propTypes = {
    currentUser: PropTypes.object,
    users: PropTypes.array,
    sortMessages: PropTypes.array,
    pagination: PropTypes.object,
    onAllUser: PropTypes.func,
    onMessage: PropTypes.func,
    onGetPreviousMessage: PropTypes.func
};

Chat.defaultProps = {
    onAllUser: f => f,
    onMessage: f => f,
    onGetPreviousMessage: f => f
};

export default Chat
