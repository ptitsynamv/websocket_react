import React from 'react';
import PropTypes from 'prop-types'
import Login from "./Login";

class ErrorHandler extends React.Component {

    constructor(props) {
        super(props);
        this.closeErrorModal = this.closeErrorModal.bind(this)
    }

    closeErrorModal(e){
        e.preventDefault();
        this.props.onCloseErrorModal()
    }

    render() {
        const {error} = this.props;
        return (
            <div className="errors">
                {Object.keys(this.props.error).length > 0 &&
                <div className="alert alert-danger">
                    <strong>Danger!</strong> {error.code} : {error.message}
                    <button type="button" className="close" onClick={this.closeErrorModal}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                }
            </div>
        )
    }
}

Login.propTypes = {
    error: PropTypes.object,
    onAfterShowError: PropTypes.func
};

Login.defaultProps = {
    onCloseErrorModal: f => f
};
export default ErrorHandler