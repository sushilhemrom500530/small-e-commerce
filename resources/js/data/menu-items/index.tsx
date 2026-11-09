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
  BookOpen,
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

  shop_owner: [
    {
      label: "Dashboard",
      href: "/shop-owner/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Shop",
      href: "/shop-owner/dashboard/my-shop",
      icon: Store,
    },
    {
      label: "Catalog",
      href: "/shop-owner/dashboard/catalog",
      icon: BookOpen,
    },
    {
      label: "My Products",
      href: "/shop-owner/dashboard/products",
      icon: Package,
    },
    {
      label: "Orders",
      href: "/shop-owner/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      label: "Settings",
      href: "/shop-owner/dashboard/profile",
      icon: Settings,
    },
  ],

  manager: [
    {
      label: "Dashboard",
      href: "/shop-owner/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Shop",
      href: "/shop-owner/dashboard/my-shop",
      icon: Store,
    },
    {
      label: "Catalog",
      href: "/shop-owner/dashboard/catalog",
      icon: BookOpen,
    },
    {
      label: "My Products",
      href: "/shop-owner/dashboard/products",
      icon: Package,
    },
    {
      label: "Orders",
      href: "/shop-owner/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      label: "Settings",
      href: "/shop-owner/dashboard/profile",
      icon: Settings,
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
