import { Navigate } from "react-router-dom";
import PrivateRoute from "../private/index.js";
import DashboardLayout from "../../layout/dashboard/index.js";
import ShopOwnerDashboard from "../../view/shop-owner/dashboard/index.js";
import MyShopPage from "../../view/shop-owner/my-shop/index.js";
import ProductCatalog from "../../view/shop-owner/catalog/index.js";
import ManageProducts from "../../view/admin/products/index.js";
import AddProduct from "../../view/admin/add-product/index.js";
import ShopOrdersPage from "../../view/shop-owner/orders/index.js";
import Profile from "../../view/admin/profile/index.js";

const allowedRoles = ["shop_owner", "manager", "admin"] as const;

const shopOwnerChildren = [
    {
        path: "",
        element: <Navigate replace to="dashboard" />,
    },
    {
        path: "dashboard",
        element: <ShopOwnerDashboard />,
    },
    {
        path: "dashboard/my-shop",
        element: <MyShopPage />,
    },
    {
        path: "dashboard/catalog",
        element: <ProductCatalog />,
    },
    {
        path: "dashboard/products",
        element: <ManageProducts />,
    },
    {
        path: "dashboard/product/add",
        element: <AddProduct />,
    },
    {
        path: "dashboard/orders",
        element: <ShopOrdersPage />,
    },
    {
        path: "dashboard/profile",
        element: <Profile />,
    },
    {
        path: "my-shop",
        element: <MyShopPage />,
    },
    {
        path: "catalog",
        element: <ProductCatalog />,
    },
    {
        path: "products",
        element: <ManageProducts />,
    },
    {
        path: "product/add",
        element: <AddProduct />,
    },
    {
        path: "orders",
        element: <ShopOrdersPage />,
    },
    {
        path: "profile",
        element: <Profile />,
    },
];

const managerRoutes = [
    {
        path: "/shop-owner",
        element: (
            <PrivateRoute allowedRoles={allowedRoles as any}>
                <DashboardLayout />
            </PrivateRoute>
        ),
        children: shopOwnerChildren,
    },
    {
        path: "/manager",
        element: (
            <PrivateRoute allowedRoles={allowedRoles as any}>
                <DashboardLayout />
            </PrivateRoute>
        ),
        children: shopOwnerChildren,
    },
];

export default managerRoutes;
