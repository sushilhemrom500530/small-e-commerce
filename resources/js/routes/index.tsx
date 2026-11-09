import { createBrowserRouter, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store.js";
import MainLayout from "../layout/main/index.js";
import Index from "../view/error-page/index.js";
import authRoutes from "./auth/index.js";
import adminRoutes from './admin/index.jsx';
import HomePage from "../view/home/index.js";
import ShopsPage from "../view/shops/index.js";
import StorefrontPage from "../view/storefront/index.js";
import ProductDetailPage from "../view/product-detail/index.js";
import AboutPage from "../view/about/index.js";
import ContactPage from "../view/contact/index.js";
import CartPage from "../view/cart/index.js";
import employeeRoutes from "./customer/index.js";
import managerRoutes from "./manager/index.js";

function RoleBasedDashboardRedirect() {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    if (!isAuthenticated || !user) {
        return <Navigate to="/auth/login" replace />;
    }
    if (user.role === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
    }
    if (user.role === "shop_owner" || user.role === "manager") {
        return <Navigate to="/shop-owner/dashboard" replace />;
    }
    // Customers only view home page & public store, no dashboard
    return <Navigate to="/" replace />;
}

const routes = [
    {
        path: "/dashboard",
        element: <RoleBasedDashboardRedirect />,
    },
    // common home page route 
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <Index />,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "/shop",
                element: <ShopsPage />
            },
            {
                path: "/shops",
                element: <ShopsPage />
            },
            {
                path: "/shops/:slug",
                element: <StorefrontPage />
            },
            {
                path: "/store/:slug",
                element: <StorefrontPage />
            },
            {
                path: "/product/:id",
                element: <ProductDetailPage />
            },
            {
                path: "/about",
                element: <AboutPage />
            },
            {
                path: "/about-us",
                element: <AboutPage />
            },
            {
                path: "/contact",
                element: <ContactPage />
            },
            {
                path: "/contact-us",
                element: <ContactPage />
            },
            {
                path: "/cart",
                element: <CartPage />
            },
            {
                path: "/shipping",
                element: <CartPage />
            },
        ]
    },
    {
        path: "*",
        element: <Index />
    },
    ...authRoutes,
    ...adminRoutes,
    ...employeeRoutes,
    ...managerRoutes,
]

const router = createBrowserRouter(
    routes
);

export default router;
