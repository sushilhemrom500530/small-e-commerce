import { Menu as MenuIcon, Search, Bell, ChevronDown, User as UserIcon, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store.js";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/userSlice.js";

interface HeaderProps {
    navOpened: boolean;
    setNavOpened: (opened: boolean) => void;
}

export default function Header({ navOpened, setNavOpened }: HeaderProps) {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isShopOwner =
        user?.role === "shop_owner" ||
        user?.role === "manager" ||
        window.location.pathname.startsWith("/shop-owner") ||
        window.location.pathname.startsWith("/manager");

    const defaultRoleName = isShopOwner ? "Shop Owner" : "Admin";
    const profilePath = isShopOwner ? "/shop-owner/dashboard/profile" : "/admin/dashboard/profile";

    const handleLogout = () => {
        dispatch(logout());
        navigate("/auth/login");
    };

    const dropdownItems: MenuProps["items"] = [
        {
            key: "info",
            label: (
                <div className="flex flex-col py-1 px-2 cursor-default">
                    <span className="font-bold text-slate-800 text-sm">
                        {user?.fullName || defaultRoleName}
                    </span>
                    <span className="text-xs text-slate-500">
                        {user?.email || (isShopOwner ? "owner@techworld.com" : "admin@example.com")}
                    </span>
                </div>
            ),
        },
        {
            type: "divider",
        },
        {
            key: "profile",
            icon: <UserIcon className="w-4 h-4 text-slate-500" />,
            label: <Link to={profilePath}>Profile</Link>,
        },
        {
            type: "divider",
        },
        {
            key: "logout",
            icon: <LogOut className="w-4 h-4 text-red-500" />,
            label: <span className="text-red-500 font-medium">Log out</span>,
            onClick: handleLogout,
        },
    ];

    return (
        <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200/80 h-16 sm:h-18 px-4 sm:px-6 flex items-center justify-between">
            {/* Left: Mobile Toggle & Search */}
            <div className="flex items-center gap-3 sm:gap-4">
                <button
                    type="button"
                    onClick={() => setNavOpened(!navOpened)}
                    className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
                    aria-label="Toggle sidebar"
                >
                    <MenuIcon className="w-5 h-5" />
                </button>

                {/* Search Input */}
                {/* <div className="relative w-48 sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-9 pr-3.5 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#f8fafc] border border-slate-200 rounded-xl placeholder-slate-400 text-slate-700 focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                </div> */}
            </div>

            {/* Right: Notifications & Profile */}
            <div className="flex items-center gap-3 sm:gap-4">
                {/* Notification Bell */}
                <button
                    type="button"
                    className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    aria-label="Notifications"
                >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>

                {/* Profile Pill Dropdown */}
                <Dropdown
                    menu={{ items: dropdownItems }}
                    trigger={["click"]}
                    placement="bottomRight"
                >
                    <button
                        type="button"
                        className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full sm:rounded-xl hover:bg-slate-50 transition-colors cursor-pointer select-none"
                    >
                        <img
                            src={
                                user?.profileUrl ||
                                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                            }
                            alt="Avatar"
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <span className="hidden sm:inline font-semibold text-slate-700 text-sm">
                            {user?.fullName || defaultRoleName}
                        </span>
                        <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:inline" />
                    </button>
                </Dropdown>
            </div>
        </header>
    );
}
