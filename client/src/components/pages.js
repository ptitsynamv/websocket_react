import React from 'react'
import {Route} from 'react-router-dom'
import {MainMenu, AboutMenu} from './ui/Menu'
import {ContainerLogin, ContainerChat} from './containers'
import {AuthGuard} from '../lib/auth-guard-helper';
import {logoutUser} from '../actions/currentUserAction'

const PageTemplate = ({children}) =>
    <div className="page">
        <MainMenu/>
        {children}
    </div>

export const LoginPage = (data) => {
    if (AuthGuard()) {
        data.history.push('/chat')
    }
    return (<PageTemplate>
        <section className="login">
            <h2>[Login Page]</h2>
            <ContainerLogin history={data.history}/>
        </section>
    </PageTemplate>)
};

export const LogoutPage = (data) => {
    window.store.dispatch(logoutUser());
    data.history.push('/');
    return true;
};



export const ChatPage = (data) => {
    if (!AuthGuard()) {
        data.history.push('/')
    }
    return (<PageTemplate>
            <section className="chat">
                <h2>[Chap Page]</h2>
                <ContainerChat/>
            </section>
        </PageTemplate>
    )
};

export const AboutPage = () =>
    <PageTemplate>
        <section className="about">
            <Route component={AboutMenu}/>
            <Route exact path="/about" component={CompanyPage}/>
            <Route path="/about/services" component={ServicePage}/>
        </section>
    </PageTemplate>

export const ServicePage = () =>
    <section className="services">
        <h2>Our Services</h2>
        <p>
            Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Integer nec odio.
            Praesent libero. Sed cursus ante dapibus
            diam. Sed nisi. Nulla quis sem at nibh
            elementum imperdiet. Duis sagittis ipsum.
        </p>
    </section>

export const CompanyPage = () =>
    <section className="services">
        <h2>Our Company</h2>
        <p>
            Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Integer nec odio.
            Praesent libero. Sed cursus ante dapibus
            diam. Sed nisi. Nulla quis sem at nibh
            elementum imperdiet. Duis sagittis ipsum.
        </p>
    </section>

export const Error404Page = ({location}) =>
    <PageTemplate>
        <div className="error-404">
            <h2>404</h2>
            <div>Resource not found at '{location.pathname}'</div>
        </div>
    </PageTemplate>

