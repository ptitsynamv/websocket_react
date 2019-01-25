import {NavLink} from 'react-router-dom'
import React from 'react'
import {AuthGuard} from '../../lib/auth-guard-helper'
import {Navbar, NavItem} from "react-materialize";

const selectedStyle = {
    backgroundColor: "white",
    color: 'red'
};

export const MainMenu = () =>
    (
        <Navbar brand='logo' right>
            {!AuthGuard() &&
            <NavItem exact to="/">
                [Login Page]
            </NavItem>}
            <NavItem to="/chat">
                [Chat Page]
            </NavItem>
            <NavItem to="/about">
                [About Page]
            </NavItem>
            {AuthGuard() &&
            <NavItem to="/logout">
                [Logout Page]
            </NavItem>}
        </Navbar>
    );


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