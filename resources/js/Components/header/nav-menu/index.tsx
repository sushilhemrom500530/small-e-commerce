import React, { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";


interface SubmenuItem {
    label: string;
    href: string;
    icon?: React.ElementType | undefined;
}

interface NavItemProps {
    href: string;
    icon?: React.ElementType | undefined;
    label: string;
    submenu?: SubmenuItem[] | undefined;
    openSubmenu: string | null;
    handleSubmenuToggle: (label: string) => void;
    closeAllSubmenus: () => void;
    setNavOpened: Dispatch<SetStateAction<boolean>>;
}

export default function NavItem({
    href,
    icon: Icon,
    label,
    submenu,
    openSubmenu,
    handleSubmenuToggle,
    setNavOpened,
    closeAllSubmenus,
}: NavItemProps) {
    const location = useLocation();
    const pathname = location.pathname;

    const activeClass = "border-r-2 border-primary text-primary bg-primary/20";
    const inactiveClass = "text-[#43464A] hover:text-primary hover:bg-primary/10 border-r-2 border-r-transparent";

    const isSubmenuOpen = openSubmenu === label;

    const submenuRef = useRef<HTMLDivElement>(null);
    const [submenuHeight, setSubmenuHeight] = useState<number>(0);

    useEffect(() => {
        if (submenuRef.current) {
            setSubmenuHeight(isSubmenuOpen ? submenuRef.current.scrollHeight : 0);
        }
    }, [isSubmenuOpen]);

    const handleClick = () => {
        if (!submenu) closeAllSubmenus();
    };

    const isParentActive =
        pathname === href || submenu?.some((item) => pathname === item.href);

    return (
        <div className="relative w-full my-1.5">
            <div
                onClick={submenu ? () => handleSubmenuToggle(label) : handleClick}
                className={`w-full flex items-center cursor-pointer transition-all gap-3 ${isParentActive ? activeClass : inactiveClass
                    }`}
            >
                {!submenu ? (
                    <Link
                        to={href || "#"}
                        className="flex items-center gap-3 w-full text-base font-medium px-5 py-2"
                        onClick={() => setNavOpened(false)}
                    >
                        {Icon && <Icon size={22} />}
                        <span>{label}</span>
                    </Link>
                ) : (
                    <div className="flex items-center justify-between w-full px-5 py-2">
                        <div className="flex items-center gap-3 text-base font-medium">
                            {Icon && <Icon size={22} />}
                            <span>{label}</span>
                        </div>
                        <ChevronDown
                            size={18}
                            className={`transition-transform duration-300 ${isSubmenuOpen ? "rotate-180" : ""
                                }`}
                        />
                    </div>
                )}
            </div>

            {/* Submenu */}
            {submenu && (
                <div
                    ref={submenuRef}
                    style={{ height: `${submenuHeight}px` }}
                    className="ml-6 pl-3 overflow-hidden transition-[height] duration-300 ease-in-out"
                >
                    <div className="flex flex-col gap-1 py-2">
                        {submenu.map((item, index) => {
                            const SubIcon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={index}
                                    to={item.href || "#"}
                                    onClick={() => setNavOpened(false)}
                                    className={`flex items-center gap-3 px-5 py-2 text-base font-medium transition-colors ${isActive
                                        ? "border-r-2 border-primary text-primary bg-primary/20"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                                        }`}
                                >
                                    {SubIcon && <SubIcon size={18} />}
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}