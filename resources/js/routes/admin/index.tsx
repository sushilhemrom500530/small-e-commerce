import { Navigate } from "react-router-dom";
import DashboardLayout from "../../layout/dashboard/index.js";
import Dashboard from "../../view/admin/dashboard/index.js";
import Profile from "../../view/admin/profile/index.js";
import Products from "../../view/admin/products/index.js";
import ShopsManagement from "../../view/admin/shops/index.js";
import ShopOwnersManagement from "../../view/admin/shop-owners/index.js";
import UsersManagement from "../../view/admin/users/index.js";
import PrivateRoute from "../private/index.js";

const adminRoutes = [
    {
        path: "/admin",
        element: (
            <PrivateRoute allowedRoles={["admin"]}>
                <DashboardLayout />
            </PrivateRoute>
        ),
        children: [
            {
                path: "",
                element: <Navigate replace to="dashboard" />,
            },
            {
                path: "dashboard",
                element: <Dashboard />,
            },
            {
                path: "dashboard/shops",
                element: <ShopsManagement />,
            },
            {
                path: "dashboard/products",
                element: <Products />,
            },
            {
                path: "dashboard/shop-owners",
                element: <ShopOwnersManagement />,
            },
            {
                path: "dashboard/users",
                element: <UsersManagement />,
            },
            {
                path: "dashboard/profile",
                element: <Profile />,
            },
            {
                path: "shops",
                element: <ShopsManagement />,
            },
            {
                path: "products",
                element: <Products />,
            },
            {
                path: "shop-owners",
                element: <ShopOwnersManagement />,
            },
            {
                path: "users",
                element: <UsersManagement />,
            },
            {
                path: "profile",
                element: <Profile />,
            },
        ],
    },
];

export default adminRoutes;
