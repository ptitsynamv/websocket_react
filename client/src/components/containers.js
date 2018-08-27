import {connect} from 'react-redux';
import Login from './ui/Login';
import UserDetails from './ui/UserDetails'
import {loginUser} from "../actions/currentUserAction";
import {findById, sortFunction} from '../lib/array-helpers'
import Chat from './ui/Chat'
import {addUser} from "../actions/userActions";
import {addMessage} from "../actions/messageActions";
import {updatePagination} from "../actions/paginationAction";


export const ContainerLogin = connect(
    ({history}) => history,
    dispatch =>
        ({
            onNewUser(email, password, history) {
                dispatch(loginUser(email, password, history));
            }
        })
)(Login);

export const ContainerUserDetails = connect(
    ({users}, {match}) => findById(users, match.params.id)
)(UserDetails);


export const ContainerChat = connect(
    state =>
        ({
            currentUser: window.store.getState().currentUser,
            users: window.store.getState().users,
            sortMessages: [...window.store.getState().messages].sort(sortFunction(window.store.getState().sort)),
            // messages: window.store.getState().messages,
            pagination: window.store.getState().pagination
        }),
    dispatch =>
        ({
            onAllUser({id, email, isAdmin, isMute, isBan, isOnline}) {
                dispatch(addUser({id, email, isAdmin, isMute, isBan, isOnline}))
            },
            onMessage({userId, userName, comment, color, date}) {
                dispatch(addMessage({userId, userName, comment, color, date}))
            },
            onGetPreviousMessage() {
                return new Promise((resolve, reject) => {
                    resolve(dispatch(updatePagination()));
                })
            }
        })
)(Chat);

