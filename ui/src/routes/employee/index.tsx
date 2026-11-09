import { Navigate } from "react-router-dom";
import PrivateRoute from "../private/index.js";
import DashboardLayout from "../../layout/dashboard/index.js";
import Dashboard from "../../view/admin/dashboard/index.js";
import Products from "../../view/admin/products/index.js";
import Profile from "../../view/admin/profile/index.js";
import CreateSales from "../../view/admin/create-sales/index.js";

const employeeRoutes = [
    {
        path: "/employee/",
        element: (
            <PrivateRoute allowedRoles={["employee"]}>
                <DashboardLayout />
            </PrivateRoute>
        ),
        children: [
            {
                path: "",
                element: <Navigate replace to="dashboard" />
            },
            {
                path: "dashboard",
                element: <Dashboard />
            },
            {
                path: "dashboard/products",
                element: <Products />
            },
            {
                path: "dashboard/sales/create",
                element: <CreateSales />
            },

            {
                path: "dashboard/profile",
                element: <Profile />
            }
        ]
    }
]

export default employeeRoutes;