import {connect} from 'react-redux';
import Login from './ui/Login';
import UserDetails from './ui/UserDetails'
import {loginUser} from "../actions/currentUserAction";
import {findById} from '../lib/array-helpers'
import {LoginPage} from "./pages";

export const ContainerLogin = connect(
    null,
    dispatch =>
        ({
            onNewUser(email, password) {
                dispatch(loginUser(email, password))
            }
        })
)(LoginPage);

export const ContainerUserDetails = connect(
    ({ users }, { match }) => findById(users, match.params.id)
)(UserDetails);