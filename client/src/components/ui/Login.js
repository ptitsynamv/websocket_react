import React from 'react';
import PropTypes from 'prop-types'

const Login = ({onNewUser = f => f}) => {

    let _email, _password;

    const submit = e => {
        e.preventDefault();
        onNewUser(_email.value, _password.value);
        _email.value = '';
        _password.value = '';
        _email.focus()
    };

    return (
        <form onSubmit={submit}>
            <input ref={input => _email = input}
                   type="text"
                   placeholder="email"
                   required
            />
            <input
                ref={input => _password = input}
                type="password"
                placeholder="password"
                required
            />

            <button>Submit</button>
        </form>
    )

};

Login.contextTypes = {
    onNewUser: PropTypes.func
};

export default Login