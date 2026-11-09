import { FaFacebookF, FaLinkedinIn, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Logo from "../logo/index.js";

export default function Footer() {
  const footerSections = [
    {
      title: "Shop & Categories",
      links: [
        { label: "Electronics & Tech", href: "/shops/tech-world" },
        { label: "Fashion & Apparel", href: "/shops/fashion-hub" },
        { label: "Home & Decor", href: "/shops/home-decor" },
        { label: "Beauty & Personal Care", href: "/shops/beauty-zone" },
      ],
    },
    {
      title: "Customer Service",
      links: [
        { label: "Track Your Order", href: "/orders" },
        { label: "Shipping Policy", href: "/shipping" },
        { label: "Easy Returns & Refunds", href: "/returns" },
        { label: "Help & FAQ", href: "/faq" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About ShopEase", href: "/about" },
        { label: "Partner with Us", href: "/auth/login" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
  ];

  const socialLinks = [
    { id: 1, href: "#facebook", icon: <FaFacebookF size={14} />, label: "Facebook" },
    { id: 2, href: "#twitter", icon: <FaXTwitter size={14} />, label: "Twitter" },
    { id: 3, href: "#instagram", icon: <FaInstagram size={14} />, label: "Instagram" },
    { id: 4, href: "#linkedin", icon: <FaLinkedinIn size={14} />, label: "LinkedIn" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <Logo className="text-white brightness-125" />
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              ShopEase connects smart shoppers with curated trusted shops offering top-quality products, competitive pricing, and fast delivery.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  aria-label={item.label}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#2563eb] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5 text-sm">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ShopEase Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
