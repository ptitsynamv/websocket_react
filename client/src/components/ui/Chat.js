import React from 'react';
import PropTypes from 'prop-types'
import io from 'socket.io-client'
import Login from "./Login";

let socket = io(`http://localhost:4000`);


class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this)
    }

    componentDidMount() {

        console.log(this.props.currentUser.token);

        socket.emit('login', this.props.currentUser.token);

        socket.on('allUsers', data => {
            console.log(data);

            Object.values(data).forEach((value, i) => {
                this.props.onAllUser(value);
            })
        })
    }

    componentWillUnmount(){
        socket.emit('logout', this.props.currentUser.token);
    }


    submit(e) {
        e.preventDefault();
        const {_message} = this.refs;
        _message.value = '';
    }

    render() {
        return (
            <form onSubmit={this.submit}>
                <textarea ref="_message"
                          placeholder="masha"
                          required
                />
                <button>Submit</button>
            </form>
        )
    }
}

Chat.propTypes = {
    currentUser: PropTypes.object,
    onAllUser:PropTypes.func
};

Chat.defaultProps = {
    onAllUser: f => f
}

export default Chat