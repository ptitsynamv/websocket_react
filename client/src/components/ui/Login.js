import React from 'react';
import PropTypes from 'prop-types'

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this)
    }

    submit(e) {
        const {_email, _password} = this.refs;
        const {onNewUser} = this.props;
        e.preventDefault();
        onNewUser(_email.value, _password.value);
        _email.value = '';
        _password.value = '';
        _email.focus()
    }

    render() {
        return (
            <form onSubmit={this.submit}>
                <input ref="_email"
                       type="text"
                       placeholder="email"
                       required
                />
                <input
                    ref="_password"
                    type="password"
                    placeholder="password"
                    required
                />
                <button>Submit</button>
            </form>
        )
    }
};

Login.propTypes = {
    onNewUser: PropTypes.func
}

Login.defaultProps = {
    onNewUser: f => f
}
export default Login