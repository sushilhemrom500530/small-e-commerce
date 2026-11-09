import { Navigate } from "react-router-dom";
import PrivateRoute from "../private/index.js";
import DashboardLayout from "../../layout/dashboard/index.js";
import Dashboard from "../../view/admin/dashboard/index.js";
import Products from "../../view/admin/products/index.js";
import Profile from "../../view/admin/profile/index.js";
import CreateSales from "../../view/admin/create-sales/index.js";
import AddProduct from "../../view/admin/add-product/index.js";

const managerRoutes = [
    {
        path: "/manager/",
        element: (
            <PrivateRoute allowedRoles={["manager"]}>
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
                path: "dashboard/product/add",
                element: <AddProduct />
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

export default managerRoutes;