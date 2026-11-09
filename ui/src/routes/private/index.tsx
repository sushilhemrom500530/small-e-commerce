import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { UserRole } from '../../types/user/index.js';
import type { RootState } from '../../redux/store.js';

interface PrivateRouteProps {
    allowedRoles: UserRole[];
    children?: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles, children }) => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    if (user && !allowedRoles.includes(user.role)) {
        // Redirect unauthorized users based on their actual role or a general page
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        if (user.role === 'manager') return <Navigate to="/manager" replace />;
        if (user.role === 'employee') return <Navigate to="/employee" replace />;
        return <Navigate to="/" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;
