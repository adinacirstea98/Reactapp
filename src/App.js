import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Services from './components/pages/Services';
import Products from './components/pages/Products';
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./authentication/PrivateRoute";
import Dashboard from "./components/pages/Dashboard";
import MyBooks from "./components/pages/MyBooks";
import AddBook from "./components/pages/AddBook";
import AuthenticationRoutes from "./components/pages/AuthenticationRoutes";

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
            <PrivateRoute path="/my-books" component={MyBooks} />
            <PrivateRoute path="/add-book" component={AddBook} />
            <AuthenticationRoutes/>
          </Switch>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
