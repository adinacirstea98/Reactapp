import React from 'react';
import '../../App.css';
import Signup from "../../authentication/Signup"
import Login from "../../authentication/Login"
import Dashboard from "../../authentication/Dashboard"
import PrivateRoute from "../../authentication/PrivateRoute"
import ForgotPassword from "../../authentication/ForgotPassword"
import { Container } from "react-bootstrap"
import { AuthProvider } from "../../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"



export default function SignUp() {
  // return <h1 className='sign-up'>LIKE & SUBSCRIBE</h1>;
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div>
        <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path="/" component={Dashboard} />
              <div className="w-100" style={{ maxWidth: "400px" }}>
                <Route  path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
                <Route path="/forgot-password" component={ForgotPassword} />
              </div>
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  )
}
