import React, { Children, useContext } from 'react'
import { useAuth } from './AuthProvider'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth()

    return isAuthenticated === undefined ? null : isAuthenticated === true ? children : <Navigate to={'/'} replace />
}

export default ProtectedRoute