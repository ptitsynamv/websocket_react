import React from 'react'
import {Link, NavLink, Route} from 'react-router-dom'
import {MainMenu,AboutMenu } from './ui/Menu'
import Login from "./ui/Login";

const selectedStyle = {
    backgroundColor: "white",
    color: "slategray"
};


const PageTemplate = ({children}) =>
    <div className="page">
        <MainMenu/>
        {children}
    </div>

export const LoginPage = () =>
    <PageTemplate>
        <section className="login">
            <h1>[Login Page]</h1>
            <Login/>
        </section>
    </PageTemplate>


export const ChatPage = () =>
    <PageTemplate>
        <section className="chat">
            <h1>[Chap Page]</h1>
            <nav>
                <Link to="about-chat">[About Chat]</Link>
            </nav>
        </section>
    </PageTemplate>


export const AboutPage = ({ match }) =>
    <PageTemplate>
        <section className="about">
            <Route component={AboutMenu} />
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
            Praesent mauris. Fusce nec tellus sed
            augue semper porta. Mauris massa.
            Vestibulum lacinia arcu eget nulla.
            Class aptent taciti sociosqu ad litora
            torquent per conubia nostra, per inceptos
            himenaeos. Curabitur sodales ligula in
            libero.
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

