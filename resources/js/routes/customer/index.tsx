import { Navigate } from "react-router-dom";

const customerRoutes = [
    {
        path: "/customer",
        element: <Navigate replace to="/" />
    },
    {
        path: "/customer/*",
        element: <Navigate replace to="/" />
    }
];

export default customerRoutes;
