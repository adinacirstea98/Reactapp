import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Services from './components/pages/Services';
import Products from './components/pages/Products';
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./authentication/PrivateRoute";
import Dashboard from "./components/pages/Dashboard";
import Authentication from "./components/pages/Authentication";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Navbar />
          <Switch>
            <PrivateRoute exact path="/" component={Dashboard} />
            <Route path='/services' component={Services} />
            <Route path='/products' component={Products} />
            <Authentication/>
          </Switch>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
