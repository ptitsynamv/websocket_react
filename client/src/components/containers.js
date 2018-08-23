import {connect} from 'react-redux';
import Login from './ui/Login';
import UserDetails from './ui/UserDetails'
import {loginUser, logoutUser} from "../actions/currentUserAction";
import {findById} from '../lib/array-helpers'
import {LoginPage, LogoutPage} from "./pages";
import Chat from './ui/Chat'
import {addUser} from "../actions/userActions";

export const ContainerLogin = connect(
    null,
    dispatch =>
        ({
            onNewUser(email, password) {
                dispatch(loginUser(email, password))
            }
        })
)(Login);

export const ContainerUserDetails = connect(
    ({users}, {match}) => findById(users, match.params.id)
)(UserDetails);


export const ContainerChat = connect(
    ({currentUser}) =>
        ({
            currentUser: window.store.getState().currentUser
        }),
    dispatch =>
        ({
            onAllUser(email, isAdmin, isMute, isBan, isOnline) {
                dispatch(addUser(email, isAdmin, isMute, isBan, isOnline))
            }
        })
)(Chat);

