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
import Loader from "./Loader";
import {Col, Card, Row, Button} from "react-materialize";

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isExistPreviousMessage: true,
            isCanSendMessage: true,
            isLoading: true
        };
        this.submit = this.submit.bind(this);
        this.showPreviousMessage = this.showPreviousMessage.bind(this);
        this.onBan = this.onBan.bind(this);
        this.onMute = this.onMute.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        let promiseLogin = emitLogin(this.props.currentUser.token);

        let promiseAllUsers = subscribeAllUsers(data => {
            Object.values(data).forEach((value, i) => {
                if (this.props.currentUser.id === value.id) {
                    this.props.onUpdateCurrentUser(value)
                }
                this.props.onAllUser(value);
                return true;
            });
        });

        let promiseMessages = subscribeMessage(data => {
            if (data.message.length < this.props.pagination[C.PAGINATION_LIMIT] && !data.isNewMessage) {
                this.setState({isExistPreviousMessage: false});
            }
            data.message.forEach(value => this.props.onMessage(value));
            return true;
        });

        Promise.all([promiseLogin, promiseAllUsers, promiseMessages])
            .then(v => this.setState({isLoading: false}));


        subscribeError(data => {
            if (data.code === 401) {
                this.logout();
            }
            this.props.onError(data);
        });

        subscribeDisconnect(data => {
            console.log('subscribeDisconnect', data)
            this.logout();
        });
    }

    logout() {
        this.props.onLogout();
        emitLogout(this.props.currentUser.token);
        socketClose();
        this.props.history.push('/')
    }

    submit(e) {
        e.preventDefault();
        if (this.props.currentUser.isMute || this.props.currentUser.isBan || !this.state.isCanSendMessage) {
            console.log('this.props.currentUser.isMute || this.props.currentUser.isBan || !this.state.isCanSendMessage', this.props.currentUser.isMute, this.props.currentUser.isBan, !this.state.isCanSendMessage);
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
    };

    onMute(userId) {
        if (!this.props.currentUser.isAdmin) {
            return;
        }
        emitMute({
            userForMuteId: userId,
            sender: this.props.currentUser.token
        })
    };

    getUsers = () => {
        const {currentUser, users} = this.props;
        return users
            .filter(user => (user.id !== currentUser.id) && (user.isOnline || currentUser.isAdmin));
    };

    getAdminAction = (user) => {
        const {currentUser} = this.props;
        if (currentUser.isAdmin) {
            return (
                <div>
                    <Button
                        className='blue darken-1'
                        onClick={this.onMute.bind(this, user.id)}
                    >
                        {user.isMute ? 'UnMute' : 'Mute'}
                    </Button>
                    <Button
                        className='red darken-4'
                        onClick={this.onBan.bind(this, user.id)}
                    >
                        {user.isBan ? 'UnBan' : 'Ban'}
                    </Button>
                </div>
            )
        }
    };

    getShowPreviousMessage = () => {
        return (
            <div>
                <Button
                    className="indigo lighten-1"
                    onClick={this.showPreviousMessage}
                >
                    Show Previous Message!
                </Button>
            </div>
        )
    };

    getSortMessages = () => {
        const {currentUser, sortMessages} = this.props;
        if (sortMessages) {
            return (
                sortMessages.map((message, i) =>
                    <div
                        key={i}
                        className={message.userId === currentUser.id ? 'sender' : 'receiver'}
                        style={{backgroundColor: message.color}}
                    >

                        <p className="username">{message.userName}:</p>
                        <p className="message">{message.comment}</p>

                    </div>
                )
            )
        }
    };

    getForm = () => {
        const {currentUser} = this.props;
        const {isCanSendMessage} = this.state;
        return (
            <form onSubmit={this.submit}>
                <textarea ref="_message" required defaultValue="masha"/>
                <div className="button-wrap">
                    <Button className="indigo"
                            disabled={!isCanSendMessage && currentUser.isMute}>
                        Submit
                    </Button>
                </div>
            </form>
        )
    };

    render() {
        const {currentUser} = this.props;
        const {isLoading, isExistPreviousMessage} = this.state;

        if (isLoading) {
            return (<Loader/>)
        }
        const users = this.getUsers();
        return (
            <section className="chat-section">
                <Row>
                    <Col m={4} s={4} className='blue lighten-3'>
                        <Card
                            key={0}
                            title='Current User'
                            className='blue lighten-2'
                        >
                            {currentUser.email}
                        </Card>
                        {
                            users.map((user, i) =>
                                <Card
                                    title={user.email}
                                    className='blue lighten-4'
                                    key={i}
                                >
                                    {user.isOnline && 'Online'}
                                    {this.getAdminAction(user)}
                                </Card>
                            )
                        }
                    </Col>
                    <Col m={8} s={8} className='indigo lighten-3'>
                       <div className="show-prev-message">
                           {isExistPreviousMessage && this.getShowPreviousMessage()}
                       </div>
                        <div className="messages-wrap">
                            {this.getSortMessages()}
                        </div>
                        <div className="form-wrap">
                            {this.getForm()}
                        </div>
                    </Col>
                </Row>
            </section>
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
    onGetPreviousMessage: PropTypes.func,
    onError: PropTypes.func,
    onLogout: PropTypes.func,
    history: PropTypes.object,
    onUpdateCurrentUser: PropTypes.func
};

Chat.defaultProps = {
    onAllUser: f => f,
    onMessage: f => f,
    onGetPreviousMessage: f => f,
    onError: f => f,
    onLogout: f => f,
    onUpdateCurrentUser: f => f
};

export default Chat
