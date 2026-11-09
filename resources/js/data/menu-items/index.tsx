import {
  LayoutDashboard,
  Store,
  Package,
  Users,
  UserPlus,
  Settings,
  UserRound,
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
      label: "Shops",
      href: "/admin/dashboard/shops",
      icon: Store,
    },
    {
      label: "Products",
      href: "/admin/dashboard/products",
      icon: Package,
    },
    {
      label: "Shop Owners",
      href: "/admin/dashboard/shop-owners",
      icon: Users,
    },
    {
      label: "Users",
      href: "/admin/dashboard/users",
      icon: UserPlus,
    },
    {
      label: "Settings",
      href: "/admin/dashboard/profile",
      icon: Settings,
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
    label: "Home",
    href: "/",
  },
  {
    label: "Shop",
    href: "/shop",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];
