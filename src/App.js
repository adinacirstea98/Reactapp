import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Services from './components/pages/Services';
import Products from './components/pages/Products';
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./authentication/PrivateRoute";
import Dashboard from "./components/pages/Dashboard";
import MyBooks from "./components/pages/MyBooks";
import AddBook from "./components/pages/AddBook";
import EditBook from "./components/pages/EditBook";
import AuthenticationRoutes from "./components/pages/AuthenticationRoutes";

function App() {
  return (
    <>
      <AuthProvider>
        <Navbar />
        <Switch>
          <PrivateRoute exact path="/" component={Dashboard} />
          <Route path='/services' component={Services} />
          <Route path='/products' component={Products} />
          <PrivateRoute path="/my-books" component={MyBooks} />
          <PrivateRoute path="/add-book" component={AddBook} />
          <PrivateRoute path="/edit-book" component={EditBook} />
          <AuthenticationRoutes/>
        </Switch>
        <ToastContainer/>
      </AuthProvider>
    </>
  );
}

export default App;
