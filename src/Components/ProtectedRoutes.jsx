import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'

const ProtectedRoutes = () => {
    const userData = useSelector(store => store.user)
    return userData ? <> <Navbar /> <Outlet /></> : <Navigate to={"/auth"} />
}

export default ProtectedRoutes