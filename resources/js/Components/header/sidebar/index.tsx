import { type Dispatch, type SetStateAction } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut, X } from "lucide-react";
import { sidebarMenus, type MenuItem } from "../../../data/menu-items/index.js";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store.js";
import { logout } from "../../../redux/userSlice.js";
import { message } from "antd";

interface SidebarProps {
    navOpened: boolean;
    setNavOpened: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({ navOpened, setNavOpened }: SidebarProps) {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(logout());
        message.success("Logged out successfully");
        navigate("/auth/login");
    };

    const isShopOwner =
        user?.role === "shop_owner" ||
        user?.role === "manager" ||
        location.pathname.startsWith("/shop-owner") ||
        location.pathname.startsWith("/manager");

    const brandTitle = isShopOwner ? "ShopEase" : "E-Commerce";
    const brandRole = isShopOwner ? "Shop Owner" : "Admin";
    const homeLink = isShopOwner ? "/shop-owner/dashboard" : "/admin/dashboard";

    const roleKey = isShopOwner ? "shop_owner" : "admin";
    const menuLinks = (sidebarMenus as Record<string, MenuItem[]>)[roleKey] || (sidebarMenus as Record<string, MenuItem[]>)["admin"] || [];

    return (
        <>
            {/* Backdrop for Mobile / Tablet */}
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 ${
                    navOpened ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setNavOpened(false)}
            />

            {/* Sidebar drawer */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
                    navOpened ? "translate-x-0 shadow-2xl" : "-translate-x-full"
                } lg:translate-x-0 lg:shadow-none`}
            >
                {/* Top Section */}
                <div className="flex flex-col flex-1 overflow-y-auto">
                    {/* Brand Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                        <Link
                            to={homeLink}
                            onClick={() => setNavOpened(false)}
                            className="flex items-center gap-3 group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-105">
                                <ShoppingCart className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-[#0f172a] text-sm tracking-tight leading-tight">
                                    {brandTitle}
                                </span>
                                <span className="font-semibold text-slate-500 text-xs leading-tight">
                                    {brandRole}
                                </span>
                            </div>
                        </Link>

                        {/* Mobile Close Button */}
                        <button
                            type="button"
                            onClick={() => setNavOpened(false)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
                            aria-label="Close menu"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="p-4 space-y-1.5">
                        {menuLinks.map((item: MenuItem, index: number) => {
                            const Icon = item.icon;
                            const isActive =
                                location.pathname === item.href ||
                                (item.href === "/admin/dashboard" && location.pathname === "/admin") ||
                                (item.href === "/shop-owner/dashboard" && (location.pathname === "/shop-owner" || location.pathname === "/manager"));

                            return (
                                <Link
                                    key={index}
                                    to={item.href || "#"}
                                    onClick={() => setNavOpened(false)}
                                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                                        isActive
                                            ? "bg-primary text-white shadow-md shadow-primary/20"
                                            : "text-slate-600 hover:text-primary hover:bg-slate-50"
                                    }`}
                                >
                                    {Icon && (
                                        <Icon
                                            className={`w-5 h-5 shrink-0 transition-colors ${
                                                isActive
                                                    ? "text-white"
                                                    : "text-slate-400 group-hover:text-primary"
                                            }`}
                                        />
                                    )}
                                    <span className="truncate">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Section: Logout */}
                <div className="p-4 border-t border-slate-100 bg-white">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50/80 transition-all duration-200 group cursor-pointer"
                    >
                        <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors shrink-0" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
