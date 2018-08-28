import {connect} from 'react-redux';
import Login from './ui/Login';
import UserDetails from './ui/UserDetails'
import {loginUser, logoutUser, updateCurrentUser} from "../actions/currentUserAction";
import {findById, sortFunction} from '../lib/array-helpers'
import Chat from './ui/Chat'
import {addUser} from "../actions/userActions";
import {addMessage} from "../actions/messageActions";
import {updatePagination} from "../actions/paginationAction";
import {addError, removeError} from "../actions/errorAction";
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

