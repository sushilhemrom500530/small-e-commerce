import { useState } from "react";
import { Link } from "react-router-dom";
import PageBanner from "../../Components/shared/page-banner/index.js";
import {
  LayoutGrid,
  Laptop,
  Shirt,
  Home,
  Sparkles,
  Dumbbell,
  HeartPulse,
  Search,
  ChevronDown,
  Star,
} from "lucide-react";

interface Shop {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  rating: number;
  reviewCount: string;
  image: string;
  slug: string;
}

const categories = [
  { id: "all", name: "All Categories", icon: LayoutGrid },
  { id: "electronics", name: "Electronics", icon: Laptop },
  { id: "fashion", name: "Fashion", icon: Shirt },
  { id: "home", name: "Home & Living", icon: Home },
  { id: "beauty", name: "Beauty & Personal Care", icon: Sparkles },
  { id: "sports", name: "Sports", icon: Dumbbell },
  { id: "health", name: "Health & Wellness", icon: HeartPulse },
];

const allShops: Shop[] = [
  {
    id: "1",
    name: "Tech World",
    category: "Electronics & More",
    categorySlug: "electronics",
    rating: 4.8,
    reviewCount: "1.2k reviews",
    image: "/images/shop-tech-v2.jpg",
    slug: "tech-world",
  },
  {
    id: "2",
    name: "Fashion Hub",
    category: "Trendy Fashion",
    categorySlug: "fashion",
    rating: 4.7,
    reviewCount: "856 reviews",
    image: "/images/shop-fashion@2x.jpg",
    slug: "fashion-hub",
  },
  {
    id: "3",
    name: "Home Decor",
    category: "Home & Living",
    categorySlug: "home",
    rating: 4.7,
    reviewCount: "720 reviews",
    image: "/images/shop-home@2x.jpg",
    slug: "home-decor",
  },
  {
    id: "4",
    name: "Beauty Zone",
    category: "Beauty & Care",
    categorySlug: "beauty",
    rating: 4.8,
    reviewCount: "640 reviews",
    image: "/images/shop-beauty@2x.jpg",
    slug: "beauty-zone",
  },
  {
    id: "5",
    name: "Sports Zone",
    category: "Sports & Fitness",
    categorySlug: "sports",
    rating: 4.6,
    reviewCount: "510 reviews",
    image: "/images/shop-sports@2x.jpg",
    slug: "sports-zone",
  },
  {
    id: "6",
    name: "Health Plus",
    category: "Health & Wellness",
    categorySlug: "health",
    rating: 4.7,
    reviewCount: "450 reviews",
    image: "/images/shop-health@2x.jpg",
    slug: "health-plus",
  },
];

export default function ShopsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const filteredShops = allShops.filter((shop) => {
    const matchesCategory =
      selectedCategory === "all" || shop.categorySlug === selectedCategory;
    const matchesSearch =
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-[#fbfcfd] min-h-screen">
      {/* Page Header Banner */}
      <PageBanner
        title="Our Shops"
        description="Explore our trusted shops and find your favorite products"
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

      {/* Main Content: Categories Sidebar + Shops Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar: Categories */}
          <aside className="lg:col-span-3 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
              Categories
            </h2>

            <div className="flex flex-col space-y-1.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-left ${
                      active
                        ? "bg-blue-50 text-[#2563eb] font-semibold shadow-2xs"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-[#2563eb]" : "text-gray-500"}`} />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Main Content */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Search & Sort Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search shops..."
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-gray-200/90 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-2xs"
                />
              </div>

              <div className="flex items-center justify-end">
                <div className="relative inline-flex items-center">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-200/90 rounded-xl px-4 py-2 pr-9 text-xs sm:text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs cursor-pointer"
                  >
                    <option value="popular">Sort by: Popular</option>
                    <option value="rating">Sort by: Top Rated</option>
                    <option value="newest">Sort by: Newest</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Shops Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredShops.map((shop) => (
                <div
                  key={shop.id}
                  className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
                >
                  {/* Shop Image with exact 2.2:1 aspect ratio */}
                  <div className="relative aspect-[2.2/1] w-full overflow-hidden bg-slate-100">
                    <img
                      src={shop.image}
                      alt={shop.name}
                      className="w-full h-full object-cover select-none"
                      loading="lazy"
                    />
                  </div>

                  {/* Shop Card Body */}
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                        {shop.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {shop.category}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-600">
                        <span className="text-amber-500 flex items-center gap-0.5 font-bold">
                          ★ {shop.rating}
                        </span>
                        <span className="text-gray-400">({shop.reviewCount})</span>
                      </div>
                    </div>

                    <div className="mt-3.5">
                      <Link
                        to={`/shops/${shop.slug}`}
                        className="inline-flex items-center justify-center px-4 py-1.5 bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                      >
                        Visit Shop
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredShops.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200/80 p-8">
                <p className="text-gray-500 text-sm">No shops found matching your search.</p>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
