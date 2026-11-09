import { Navigate } from "react-router-dom";
import DashboardLayout from "../../layout/dashboard/index.jsx";
import Dashboard from "../../view/admin/dashboard/index.js";
;
import Profile from "../../view/admin/profile/index.js";
import PrivateRoute from "../private/index.js";

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
                path: "dashboard/profile",
                element: <Profile />
            },
        ]
    }
]

export default adminRoutes;