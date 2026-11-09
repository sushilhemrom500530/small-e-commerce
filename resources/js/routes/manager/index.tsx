import { Navigate } from "react-router-dom";
import PrivateRoute from "../private/index.js";
import DashboardLayout from "../../layout/dashboard/index.js";
import Dashboard from "../../view/admin/dashboard/index.js";
import Profile from "../../view/admin/profile/index.js";

const managerRoutes = [
    {
        path: "/manager/",
        element: (
            <PrivateRoute allowedRoles={["shop_owner"]}>
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
                path: "dashboard/profile",
                element: <Profile />
            }
        ]
    }
]

export default managerRoutes;