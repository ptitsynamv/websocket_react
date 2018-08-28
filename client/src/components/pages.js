import React from 'react'
import {Route} from 'react-router-dom'
import {MainMenu, AboutMenu} from './ui/Menu'
import {ContainerLogin, ContainerChat} from './containers'
import {AuthGuard} from '../lib/auth-guard-helper';
import {logoutUser} from '../actions/currentUserAction'
import {ErrorContainer} from "./containers";
import {getAbout} from "../lib/api-helpers";

const PageTemplate = ({children}) =>
    <div className="page">
        <ErrorContainer/>
        <MainMenu/>
        {children}
    </div>;

export const LoginPage = ({history}) => {
    if (AuthGuard()) {
        history.push('/chat');
        return false
    }
    return (<PageTemplate>
        <section className="login">
            <h2>[Login Page]</h2>
            <ContainerLogin history={history}/>
        </section>
    </PageTemplate>)
};

export const LogoutPage = ({history}) => {
    window.store.dispatch(logoutUser());
    history.push('/');
    return true;
};


export const ChatPage = ({history}) => {
    if (!AuthGuard()) {
        history.push('/');
        return false
    }
    return (<PageTemplate>
            <section className="chat">
                <h2>[Chap Page]</h2>
                <ContainerChat history={history}/>
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
    </PageTemplate>;

export const ServicePage = ({history}) => {
    if (!AuthGuard()) {
        history.push('/');
        return false
    }
    //TODO get text for page from server

    let text;
    getAbout().then(v => text = v);


    return (
        <section className="services">
            {text &&
            <div>
                <h2>Our Services (only for login user)</h2>
                <p>{text}</p>
            </div>
            }
        </section>
    )
};

export const CompanyPage = () => {
    return (
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
    )
};

export const Error404Page = ({location}) =>
    <PageTemplate>
        <div className="error-404">
            <h2>404</h2>
            <div>Resource not found at '{location.pathname}'</div>
        </div>
    </PageTemplate>

