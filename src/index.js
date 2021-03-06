import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import "bootstrap/dist/css/bootstrap.min.css"
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

ReactDOM.render(
    <Router history={history}>
        <App />
    </Router>
, document.getElementById('root'));