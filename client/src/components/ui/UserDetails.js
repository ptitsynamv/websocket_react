import React from 'react';
import PropTypes from "prop-types";
import Login from "./Login";

const UserDetails = ({email = ''}) =>
    <div className="user-details">
        <h2>[User Details]</h2>
        <div>{email}</div>
    </div>



UserDetails.propTypes = {
    email: PropTypes.string,
}

export default UserDetails