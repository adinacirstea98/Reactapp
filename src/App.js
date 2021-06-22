import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./authentication/PrivateRoute";
import Dashboard from "./components/pages/Dashboard";
import MyBooks from "./components/pages/MyBooks";
import FavoritesBooks from "./components/pages/FavoritesBooks";
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
          <PrivateRoute path="/favorites-books" component={FavoritesBooks} />
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
