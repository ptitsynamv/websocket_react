import React from 'react'
import { Router, Route } from 'react-router-dom';
import {history} from "../helpers/history";
import ProductsContainer from './ProductsContainer'
import CartContainer from './CartContainer'
import {Login} from "../components/Login";

class App extends React.Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;
        history.listen((location, action) => {
            // clear alert on location change
            //dispatch(alertActions.clear());
        });
    }

    render(){
        return (
            <div>
                <h2>Shopping Cart Example</h2>
                <Router history={history}>
                    <div>
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={ProductsContainer} />
                    </div>
                </Router>
            </div>
        )
    }
}
export default App
