import React from 'react'
import {HashRouter, NavLink, Route, Switch, Redirect} from 'react-router-dom'
import {LoginPage, ChatPage, Error404Page, AboutPage} from "./pages";
import {ContainerUserDetails, ContainerLogin} from './containers'

window.React = React;


class App extends React.Component {

    render() {
        return (
            <div>
                <h1>Chat</h1>
                <HashRouter>
                    <div className="main">
                        <Switch>
                            <Route exact path="/:id" component={ContainerUserDetails} />

                            <Route exact path="/" component={ContainerLogin} />
                            <Route path="/chat" component={ChatPage} />
                            <Route path="/about" component={AboutPage} />
                            <Redirect from="/services" to="/about/services" />
                            <Route component={Error404Page} />
                        </Switch>
                    </div>
                </HashRouter>
            </div>
        )
    }
}

export default App
