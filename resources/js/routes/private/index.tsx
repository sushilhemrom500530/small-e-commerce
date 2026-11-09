import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import type { UserRole } from '../../types/user/index.js';
import type { RootState } from '../../redux/store.js';
import { logout } from '../../redux/user-slice/index.js';

interface PrivateRouteProps {
    allowedRoles: UserRole[];
    children?: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles, children }) => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const token =
        Cookies.get("token") ||
        Cookies.get("authToken") ||
        (typeof window !== "undefined"
            ? localStorage.getItem("token") || localStorage.getItem("authToken")
            : null);

    // If token is not found or user is unauthenticated, deny dashboard access immediately
    if (!token || !isAuthenticated || !user) {
        if (isAuthenticated) {
            dispatch(logout());
        }
        return <Navigate to="/auth/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        // Redirect unauthorized users based on their actual role
        if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (user.role === 'shop_owner' || user.role === 'manager') return <Navigate to="/shop-owner/dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;
