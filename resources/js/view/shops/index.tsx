import { useState } from "react";
import { Link } from "react-router-dom";
import PageBanner from "../../Components/shared/page-banner/index.js";
import {
  Store,
  Search,
  Sparkles,
  ArrowRight,
  PackageCheck,
  ShieldCheck
} from "lucide-react";
import { useGetStoreShopsQuery } from "../../redux/features/ecommerce/index.js";

export default function ShopsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: shopsData, isLoading } = useGetStoreShopsQuery({
    search: searchQuery || undefined,
  });

  const shops = shopsData?.results || [];

  return (
    <div className="w-full bg-[#fbfcfd] min-h-screen">
      {/* Page Header Banner */}
      <PageBanner
        title="Explore Partner Shops"
        description="Discover multi-vendor shops, compare exclusive listings, and browse verified stores"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shops" },
        ]}
        rightElement={
          <div className="relative w-44 h-32 flex items-center justify-center opacity-85 select-none mr-8 sm:mr-14">
            <svg viewBox="0 0 160 140" fill="none" className="w-full h-full text-blue-300">
              <path
                d="M 15 120 C 50 115, 75 90, 105 60"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeDasharray="4 4"
                opacity="0.55"
              />
              <rect
                x="70"
                y="45"
                width="72"
                height="72"
                rx="9"
                stroke="currentColor"
                strokeWidth="2.5"
              />
              <path
                d="M 88 45 V 32 C 88 23 124 23 124 32 V 45"
                stroke="currentColor"
                strokeWidth="2.5"
              />
            </svg>
          </div>
        }
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Search & Statistics Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shops by name or description..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500 w-full sm:w-auto justify-end">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> All stores verified
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Store className="w-4 h-4 text-primary" /> {shops.length} Active {shops.length === 1 ? 'Shop' : 'Shops'}
            </span>
          </div>
        </div>

        {/* Shops Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 h-64 animate-pulse" />
            ))}
          </div>
        ) : shops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <div
                key={shop.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:shadow-xl hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col group"
              >
                {/* Shop Banner / Image */}
                <div className="relative aspect-[2.2/1] w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                  {shop.logo ? (
                    <img
                      src={shop.logo}
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 select-none"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/shop-tech-v2.jpg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-slate-100 to-indigo-50 flex items-center justify-center">
                      <Store className="w-12 h-12 text-slate-400" />
                    </div>
                  )}
                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[11px] font-bold text-slate-700 shadow-2xs">
                    {shop.status || "active"}
                  </span>
                </div>

                {/* Shop Card Body */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {shop.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {shop.description || "Browse exclusive catalog items curated by this merchant."}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Owner: <strong className="text-slate-700 font-medium">{shop.owner?.name || "Verified Merchant"}</strong></span>
                      <span className="flex items-center gap-1 font-semibold text-primary">
                        <PackageCheck className="w-3.5 h-3.5" />
                        {shop.productsCount ?? 0} {shop.productsCount === 1 ? 'Product' : 'Products'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <Link
                      to={`/shops/${shop.slug}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-primary text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs"
                    >
                      Visit Storefront <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto">
            <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Shops Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              There are no active shops matching your search. Try another keyword.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
