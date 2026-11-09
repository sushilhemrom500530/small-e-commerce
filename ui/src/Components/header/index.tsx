"use client";
import { IoMdMenu } from "react-icons/io";
import { BsBellFill } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store.js";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/userSlice.js";
import { FaUser, FaBox, FaSignOutAlt } from "react-icons/fa";

export default function Header({ navOpened, setNavOpened }: any) {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/auth/login");
    };

    const getRolePath = () => {
        if (!user) return "";
        return `/${user.role}`;
    };

    const dropdownItems: MenuProps['items'] = [
        {
            key: 'info',
            label: (
                <div className="flex flex-col py-1 px-2 mb-1 cursor-default">
                    <span className="font-semibold text-gray-800">{user?.fullName ?? "User"}</span>
                    <span className="text-sm text-gray-500">{user?.email ?? "email@example.com"}</span>
                </div>
            ),
        },
        {
            type: 'divider',
        },
        {
            key: 'profile',
            icon: <FaUser className="text-gray-500" />,
            label: <Link to={`${getRolePath()}/profile`}>Profile</Link>,
        },
        {
            key: 'products',
            icon: <FaBox className="text-gray-500" />,
            label: <Link to={`${getRolePath()}/products`}>Products</Link>,
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <FaSignOutAlt className="text-red-500" />,
            label: <span className="text-red-500 font-medium">Log out</span>,
            onClick: handleLogout,
        },
    ];

    return (
        <div className="sticky inset-y-0 left-0 z-30 w-full border-b border-b-[#E5E7EB] h-20  bg-[#FFFFFF] [transition:0.5s]">
            <header className="flex items-center justify-between p-4">
                {/* left side  */}
                <div className="flex items-center justify-between w-full">
                    <div
                        onClick={() => setNavOpened(!navOpened)}
                        className="md:hidden flex items-center justify-center cursor-pointer"
                    >
                        <IoMdMenu className=" w-10 h-10 rounded-full bg-primary/10 text-primary [transition:0.3s] hover:bg-primary hover:text-white text-center p-2" />
                    </div>

                    <div />
                    <div className="flex items-center justify-center gap-x-5">
                        <div
                            onClick={() => setNavOpened(!navOpened)}
                            className="hidden lg:hidden md:flex items-center justify-center cursor-pointer"
                        >
                            <IoMdMenu className=" w-10 h-10 rounded-full bg-yellow-50 [transition:0.3s] hover:bg-yellow-100 text-center p-1" />
                        </div>
                        <div className="flex items-center justify-center cursor-pointer relative">
                            <h3 className="absolute -top-4 -right-3 bg-[#10B981] rounded-full w-5 h-5 flex items-center justify-center text-xs text-white">
                                2
                            </h3>
                            <BsBellFill size={22} color="#000" />
                        </div>
                        <Dropdown menu={{ items: dropdownItems }} trigger={['click']} placement="bottomRight">
                            <div className="flex w-10 md:w-14 xl:w-auto flex-1 items-center gap-2 cursor-pointer transition-opacity hover:opacity-80">
                                <img
                                    src={user?.profileUrl ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQna96LOHsB0K43Ybx1vGQyqq4IKX9k_1xW_am2qdgT-Q&s"}
                                    alt="logo"
                                    className="w-9 h-9 rounded-full object-cover"
                                />
                                <h1 className="text-lg text-black font-medium hidden xl:block">
                                    {user?.fullName ?? "User"}
                                </h1>
                            </div>
                        </Dropdown>
                    </div>
                </div>
            </header>
        </div>
    );
}