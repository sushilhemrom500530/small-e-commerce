import {
  LayoutDashboard,
  UserRound,
  Package,
  PackagePlus,
  ShoppingCart,
} from "lucide-react";
import { TbMatrix, TbBulb } from "react-icons/tb";
import { MdDashboardCustomize } from "react-icons/md";
import { TbCategory, TbReportAnalytics, TbDiscount } from "react-icons/tb";
import { FaHistory } from "react-icons/fa";

export interface SubmenuItem {
  label: string;
  href: string;
  icon?: React.ElementType;
}

export interface MenuItem {
  label: string;
  href?: string;
  icon?: React.ElementType;
  submenu?: SubmenuItem[];
}

export interface MenuGroup {
  menu: MenuItem[];
}

export interface MenuData {
  linkData: MenuGroup[];
}

export const sidebarMenus = {
  admin: [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      href: "/admin/dashboard/products",
      icon: Package,
    },
    {
      label: "Add Product",
      href: "/admin/dashboard/product/add",
      icon: PackagePlus,
    },
    {
      label: "Create Sale",
      href: "/admin/dashboard/sales/create",
      icon: ShoppingCart,
    },
    {
      label: "Sales History",
      href: "/admin/dashboard/sales/history",
      icon: FaHistory,
    },
    {
      label: "Profile",
      href: "/admin/dashboard/profile",
      icon: UserRound,
    },
  ],

  manager: [
    {
      label: "Dashboard",
      href: "/manager/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      href: "/manager/dashboard/products",
      icon: Package,
    },
    {
      label: "Add Product",
      href: "/manager/dashboard/product/add",
      icon: PackagePlus,
    },
    {
      label: "Create Sale",
      href: "/manager/dashboard/sales/create",
      icon: ShoppingCart,
    },
    {
      label: "Profile",
      href: "/manager/dashboard/profile",
      icon: UserRound,
    },
  ],

  employee: [
    {
      label: "Dashboard",
      href: "/employee/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      href: "/employee/dashboard/products",
      icon: Package,
    },
    {
      label: "Create Sale",
      href: "/employee/dashboard/sales/create",
      icon: ShoppingCart,
    },
    {
      label: "Profile",
      href: "/employee/dashboard/profile",
      icon: UserRound,
    },
  ],
};

export const navLinks: MenuItem[] = [
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Services",
    href: "/services",
  },
  {
    label: "About Us",
    href: "/about-us",
  },
  {
    label: "Contact Us",
    href: "/contact-us",
  },
];
