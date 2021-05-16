import React from 'react';
import '../../App.css';
import Signup from "../../authentication/Signup"
import Login from "../../authentication/Login"
import Logout from "../../authentication/Logout"
import ForgotPassword from "../../authentication/ForgotPassword"
import { Container } from "react-bootstrap"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"



export default function SignUp() {
  // return <h1 className='sign-up'>LIKE & SUBSCRIBE</h1>;
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div>
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
          <Route path="/signup" component={Signup} />
          <Route path="/forgot-password" component={ForgotPassword} />
        </div>
      </div>
    </Container>
  )
}
