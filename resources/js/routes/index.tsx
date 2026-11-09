import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/main/index.js";
import Index from "../view/error-page/index.js";
import authRoutes from "./auth/index.js";
import adminRoutes from './admin/index.jsx';
import HomePage from "../view/home/index.js";
import ShopsPage from "../view/shops/index.js";
import ProductDetailPage from "../view/product-detail/index.js";
import AboutPage from "../view/about/index.js";
import employeeRoutes from "./customer/index.js";
import managerRoutes from "./manager/index.js";

const routes = [
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
                path: "/shops/:id",
                element: <ProductDetailPage />
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
