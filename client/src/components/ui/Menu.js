import {NavLink} from 'react-router-dom'
import React from 'react'
import {AuthGuard} from '../../lib/auth-guard-helper'

const selectedStyle = {
    backgroundColor: "white",
    color: 'red'
};

export const MainMenu = () =>
    <nav className="main-menu">
        {!AuthGuard() &&
        <NavLink exact to="/" activeStyle={selectedStyle}>
            [Login Page]
        </NavLink>}
        <NavLink to="/chat" activeStyle={selectedStyle}>
            [Chat Page]
        </NavLink>
        <NavLink to="/about" activeStyle={selectedStyle}>
            [About Page]
        </NavLink>

        {AuthGuard() &&
        <NavLink to="/logout" activeStyle={selectedStyle}>
            [Logout Page]
        </NavLink>}
    </nav>


export const AboutMenu = () =>
    <div className="about-menu">
        <li>
            <NavLink exact to="/about" activeStyle={selectedStyle}>
                [Company]
            </NavLink>
        </li>
        <li>
            <NavLink to="/about/services"
                     activeStyle={selectedStyle}>
                [Services]
            </NavLink>
        </li>
    </div>