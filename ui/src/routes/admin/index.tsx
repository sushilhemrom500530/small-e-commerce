import { Navigate } from "react-router-dom";
import DashboardLayout from "../../layout/dashboard/index.jsx";
import Dashboard from "../../view/admin/dashboard/index.js";
import Products from "../../view/admin/products/index.js";
import AddProduct from "../../view/admin/add-product/index.js";
import CreateSales from "../../view/admin/create-sales/index.js";
import Profile from "../../view/admin/profile/index.js";
import PrivateRoute from "../private/index.js";
import UpdateProduct from "../../view/admin/update-product/index.js";
import ViewSalesHistory from "../../view/admin/view-sale-history/index.js";

const adminRoutes = [
    {
        path: "/admin/",
        element: (
            <PrivateRoute allowedRoles={["admin"]}>
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
                path: "dashboard/product/update/:id",
                element: <UpdateProduct />
            },
            {
                path: "dashboard/sales/create",
                element: <CreateSales />
            },
            {
                path: "dashboard/sales/history",
                element: <ViewSalesHistory />
            },
            {
                path: "dashboard/profile",
                element: <Profile />
            },
        ]
    }
]

export default adminRoutes;