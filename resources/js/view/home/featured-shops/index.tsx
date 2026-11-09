import { Link } from "react-router-dom";
import { ArrowRight, Store, PackageCheck } from "lucide-react";
import { useGetStoreShopsQuery } from "../../../redux/features/ecommerce/index.js";

export default function FeaturedShops() {
  const { data: shopsData, isLoading } = useGetStoreShopsQuery();
  const shops = (shopsData?.results || []).slice(0, 4);

  return (
    <section className="bg-white pt-8 pb-14 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Featured Partner Shops
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse stores with verified inventory and specialized pricing
            </p>
          </div>
          <Link
            to="/shops"
            className="text-sm font-semibold text-primary hover:text-primary-hover inline-flex items-center gap-1 group transition-colors"
          >
            View All Shops
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 4 Shop Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl border border-slate-200 h-60 animate-pulse" />
            ))}
          </div>
        ) : shops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {shops.map((shop) => (
              <div
                key={shop.id}
                className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group"
              >
                {/* Card Image with matching aspect ratio */}
                <div className="relative aspect-[2.1/1] w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                  {shop.logo ? (
                    <img
                      src={shop.logo}
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 select-none"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/shop-tech.jpg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-indigo-50/50 flex items-center justify-center">
                      <Store className="w-8 h-8 text-primary/40" />
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug">
                      {shop.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {shop.description || "Verified Storefront"}
                    </p>
                    <div className="mt-2 text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <PackageCheck className="w-3.5 h-3.5 text-primary" />
                      {shop.productsCount ?? 0} active products
                    </div>
                  </div>

                  <div className="mt-3">
                    <Link
                      to={`/shops/${shop.slug}`}
                      className="inline-flex items-center justify-center px-3.5 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                    >
                      Visit Shop
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-slate-500">
            No partner shops active right now.
          </div>
        )}

      </div>
    </section>
  );
}
