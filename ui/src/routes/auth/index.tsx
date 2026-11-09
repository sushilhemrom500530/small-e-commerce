import { Navigate } from "react-router-dom";
import Login from "../../view/auth/login/index.js";
import AuthLayout from "../../layout/auth/index.js";

const authRoutes = [
    {
        path: "/auth/",
        element: <AuthLayout />,
        children: [
            {
                path: "",
                element: <Navigate replace to="login" />
            },
            {
                path: "login",
                element: <Login />
            },
        ]
    }
]

export default authRoutes;