import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import type { RootState } from "../../redux/store.js";
import { logout } from "../../redux/user-slice/index.js";
import Sidebar from "../../Components/header/sidebar/index.js";
import Header from "../../Components/header/index.js";

export default function DashboardLayout() {
    const dispatch = useDispatch();
    const [navOpened, setNavOpened] = useState<boolean>(false);
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const token =
        Cookies.get("token") ||
        Cookies.get("authToken") ||
        (typeof window !== "undefined"
            ? localStorage.getItem("token") || localStorage.getItem("authToken")
            : null);

    // If token is not found, cannot view any dashboard layout
    if (!token || !isAuthenticated || !user) {
        if (isAuthenticated) {
            dispatch(logout());
        }
        return <Navigate to="/auth/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
            {/* Sidebar with White Background & Fully Responsive Off-Canvas */}
            <Sidebar navOpened={navOpened} setNavOpened={setNavOpened} />

            {/* Main Area */}
            <div className="flex flex-col flex-1 min-w-0 lg:ml-64 transition-all duration-300 min-h-screen">
                <Header navOpened={navOpened} setNavOpened={setNavOpened} />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
