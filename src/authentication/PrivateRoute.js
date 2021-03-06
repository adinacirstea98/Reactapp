import React from "react"
import { Route, Redirect } from "react-router-dom"
import Home from "../components/pages/Home"
import { useAuth } from "../contexts/AuthContext"

export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth()

  return (
    <Route
      {...rest}
      render={props => {
        return currentUser ? <Component {...props.location.state} /> : <Home/>
      }}
    ></Route>
  )
}