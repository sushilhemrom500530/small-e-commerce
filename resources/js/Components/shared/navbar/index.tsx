import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import Logo from "../logo/index.js";
import { navLinks, type MenuItem } from "../../../data/menu-items/index.js";
import { useAppSelector } from "../../../redux/hooks.js";

export default function Navbar() {
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartItems = useAppSelector((state) => state.cart?.items ?? []);
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Brand Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-9">
            {navLinks.map((item: MenuItem) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  to={item.href || "/"}
                  className={`relative inline-flex flex-col items-center py-1 text-[15px] transition-colors ${
                    active
                      ? "text-gray-900 font-semibold"
                      : "text-gray-600 hover:text-primary font-medium"
                  }`}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search, Cart, Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Search Input Bar */}
            <div className="relative hidden sm:flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-48 lg:w-60 pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-[#fbfbfb] border border-gray-200/90 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white transition-all"
              />
            </div>

            {/* Shopping Cart Icon with Badge */}
            <Link
              to="/cart"
              className="relative p-1.5 text-gray-700 hover:text-primary rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" strokeWidth={1.8} />
              {totalCartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#ef4444] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {totalCartCount}
                </span>
              )}
            </Link>

            {/* User Profile Avatar */}
            <Link
              to="/auth/login"
              className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-primary hover:border-primary transition-colors"
              aria-label="User Account"
            >
              <User className="w-4.5 h-4.5 text-slate-700" strokeWidth={1.8} />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex flex-col space-y-1">
            {navLinks.map((item: MenuItem) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  to={item.href || "/"}
                  className={`px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    active
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
