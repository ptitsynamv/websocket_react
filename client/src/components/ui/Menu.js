import {NavLink} from 'react-router-dom'
import React from 'react'

const selectedStyle = {
    backgroundColor: "white",
    color: "slategray"
};

const unSelectedStyle = {
    backgroundColor: "black",
    color: "slategray"
};

export const MainMenu = () =>
    <nav className="main-menu">
        <NavLink to="/">
            [Login Page]
        </NavLink>
        <NavLink to="/chat" activeStyle={selectedStyle}>
            [Chat Page]
        </NavLink>
        <NavLink to="/about" activeStyle={selectedStyle}>
            [About Page]
        </NavLink>
        <NavLink to="/logout" activeStyle={selectedStyle}>
            [Logout Page]
        </NavLink>
    </nav>


export const AboutMenu = ({match}) =>
    <div className="about-menu">
        <li>
            <NavLink to="/about"
                     style={match.isExact ? selectedStyle : unSelectedStyle}>
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