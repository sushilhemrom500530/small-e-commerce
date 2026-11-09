import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface FeaturedShop {
  id: string;
  name: string;
  category: string;
  image: string;
  image2x: string;
  slug: string;
}

const featuredShops: FeaturedShop[] = [
  {
    id: "1",
    name: "Tech World",
    category: "Electronics & More",
    image: "/images/shop-tech.jpg",
    image2x: "/images/shop-tech@2x.jpg",
    slug: "tech-world",
  },
  {
    id: "2",
    name: "Fashion Hub",
    category: "Trendy Fashion",
    image: "/images/shop-fashion.jpg",
    image2x: "/images/shop-fashion@2x.jpg",
    slug: "fashion-hub",
  },
  {
    id: "3",
    name: "Home Decor",
    category: "Beautiful Home",
    image: "/images/shop-home.jpg",
    image2x: "/images/shop-home@2x.jpg",
    slug: "home-decor",
  },
  {
    id: "4",
    name: "Beauty Zone",
    category: "Beauty & Care",
    image: "/images/shop-beauty.jpg",
    image2x: "/images/shop-beauty@2x.jpg",
    slug: "beauty-zone",
  },
];

export default function FeaturedShops() {
  return (
    <section className="bg-white pt-8 pb-14 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Featured Shops
          </h2>
          <Link
            to="/shops"
            className="text-sm font-semibold text-[#2563eb] hover:text-blue-700 inline-flex items-center gap-1 group transition-colors"
          >
            View All Shops
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 4 Shop Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {featuredShops.map((shop) => (
            <div
              key={shop.id}
              className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
            >
              {/* Card Image with matching 2:1 aspect ratio */}
              <div className="relative aspect-[2.1/1] w-full overflow-hidden bg-slate-100">
                <img
                  src={shop.image2x}
                  srcSet={`${shop.image} 1x, ${shop.image2x} 2x`}
                  alt={shop.name}
                  className="w-full h-full object-cover select-none"
                  loading="lazy"
                />
              </div>

              {/* Card Content */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                    {shop.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {shop.category}
                  </p>
                </div>

                <div className="mt-3">
                  <Link
                    to={`/shops/${shop.slug}`}
                    className="inline-flex items-center justify-center px-3.5 py-1.5 bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                  >
                    Visit Shop
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
