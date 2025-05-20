import {connect} from 'react-redux';
import Login from './ui/Login';
import UserDetails from './ui/UserDetails'
import {loginUser, logoutUser, updateCurrentUser} from "../store/actions/currentUserAction";
import {findById, sortFunction} from '../lib/array-helpers'
import Chat from './ui/chat/Chat'
import ChatLeftMenu from './ui/chat/LeftMenu'
import {addUser} from "../store/actions/userActions";
import {addMessage} from "../store/actions/messageActions";
import {updatePagination} from "../store/actions/paginationAction";
import {addError, removeError} from "../store/actions/errorAction";
import ErrorHandler from './ui/ErrorHandler'


export const ContainerLogin = connect(
    history => (history),
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
    (state, data) =>
        ({
            currentUser: state.currentUser,
            users: state.users,
            sortMessages: [...state.messages].sort(sortFunction(state.sort)),
            pagination: state.pagination,
            history: data.history
        }),
    dispatch =>
        ({
            onAllUser({id, email, isAdmin, isMute, isBan, isOnline}) {
                dispatch(addUser({id, email, isAdmin, isMute, isBan, isOnline}))
            },
            onMessage({id, userId, userName, comment, color, date}) {
                dispatch(addMessage({id, userId, userName, comment, color, date}))
            },
            onGetPreviousMessage() {
                return new Promise((resolve, reject) => {
                    resolve(dispatch(updatePagination()));
                })
            },
            onError({code, message}) {
                dispatch(addError({code, message}))
            },
            onLogout() {
                dispatch(logoutUser())
            },
            onUpdateCurrentUser({isMute, isBan, isOnline}){
                dispatch(updateCurrentUser({isMute, isBan, isOnline}))
            }
        })
)(Chat);


export const ContainerChatLeftMenu = connect(
    (state, data) =>
        ({
            currentUser: state.currentUser,
            users: state.users,
        }),
    null
)(ChatLeftMenu);

export const ErrorContainer = connect(
    state =>
        ({
            error: state.error
        }),
    dispatch =>
        ({
            onCloseErrorModal() {
                dispatch(removeError())
            }
        })
)(ErrorHandler);

