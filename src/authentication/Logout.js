import React from "react"
import { Redirect } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext"

export default function Logout() {
    const { logout } = useAuth()
    logout()

    return (
        <Redirect to="/" />

    )
}