import React from 'react';
import PropTypes from 'prop-types'
import {Col, Card, Button} from "react-materialize";
import {emitBan, emitMute} from "../../../helpers/socket";

class LeftMenu extends React.Component {
    constructor(props) {
        super(props);
        this.onBan = this.onBan.bind(this);
        this.onMute = this.onMute.bind(this);
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

    render() {
        const {currentUser} = this.props;
        const users = this.getUsers();

        return (
            <Col m={4} s={4} className='left-menu blue lighten-3'>
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
        )
    }
}

LeftMenu.propTypes = {
    currentUser: PropTypes.object,
    users: PropTypes.array,
};

export default LeftMenu