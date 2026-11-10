import { useState } from "react";
import { Link } from "react-router-dom";
import { Input, Select } from "antd";
import PageBanner from "../../Components/shared/page-banner/index.js";
import Pagination from "../../Components/reuseable/pagination/index.js";
import { useGetStoreShopsQuery } from "../../redux/features/ecommerce/index.js";
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
  Check,
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
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const currentCategoryObj =
    categories.find((c) => c.id === selectedCategory) || categories[0];
  const CurrentCategoryIcon = currentCategoryObj.icon;

  const { data: backendData } = useGetStoreShopsQuery({
    search: searchQuery,
    page,
    limit: pageSize,
  });

  const backendShops: Shop[] = (backendData?.results || []).map((s: any) => ({
    id: String(s.id),
    name: s.name,
    category: s.description || "Trusted Store",
    categorySlug: "all",
    rating: 4.8,
    reviewCount: `${s.productsCount || 0} products`,
    image: s.logo || "/images/shop-tech-v2.jpg",
    slug: s.slug,
  }));

  const activeSourceShops = backendShops.length > 0 ? backendShops : allShops;

  const filteredShops = activeSourceShops.filter((shop) => {
    const matchesCategory =
      selectedCategory === "all" || shop.categorySlug === selectedCategory;
    const matchesSearch =
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalShops = backendData?.meta?.totalResult ?? filteredShops.length;
  const paginatedShops = backendData?.meta
    ? filteredShops
    : filteredShops.slice((page - 1) * pageSize, page * pageSize);

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


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* category content  */}
          <aside className="lg:col-span-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80">
            {/* Mobile collapsible dropdown trigger - only visible on small devices (< lg) */}
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
                className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-gray-200/90 bg-slate-50/80 hover:bg-slate-100/80 transition-all cursor-pointer text-left"
                aria-expanded={isMobileCategoryOpen}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <CurrentCategoryIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="truncate">
                    <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Select Category
                    </span>
                    <span className="block text-xs sm:text-sm font-bold text-gray-900 truncate">
                      {currentCategoryObj.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-semibold text-primary hidden sm:inline">
                    {isMobileCategoryOpen ? "Close" : "Change"}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg bg-white border border-gray-200/90 flex items-center justify-center transition-transform duration-200 ${isMobileCategoryOpen ? "rotate-180" : ""
                      }`}
                  >
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              </button>
            </div>

            {/* Desktop header - only visible on large devices */}
            <div className="hidden lg:flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                Categories
              </h2>
              {selectedCategory !== "all" && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setPage(1);
                  }}
                  className="text-xs text-primary hover:text-primary-hover font-semibold transition-colors cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Category options - always open on desktop, collapsible dropdown on mobile */}
            <div
              className={`flex-col space-y-1.5 transition-all duration-200 ${isMobileCategoryOpen
                ? "flex mt-3 pt-3 border-t border-gray-100"
                : "hidden lg:flex"
                }`}
            >
              {categories.map((cat) => {
                const Icon = cat.icon;
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setPage(1);
                      setIsMobileCategoryOpen(false); // auto-matically collapse off when selected
                    }}
                    className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-left cursor-pointer ${active
                      ? "bg-primary text-white font-semibold "
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? "text-white" : "text-gray-500"}`} />
                      <span>{cat.name}</span>
                    </div>
                    {active && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* product content */}
          <main className="lg:col-span-9 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Input
                  type="text"
                  value={searchQuery}
                  prefix={<Search className="w-4 h-4 text-gray-400" />}
                  size="large"
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search shops..."
                  className="!rounded-md"
                />
              </div>

              <div className="flex items-center justify-end">
                <Select
                  value={sortBy}
                  onChange={(val) => setSortBy(val)}
                  className="w-44 !rounded-md [&_.ant-select-selector]:!rounded-md"
                  size="large"
                  options={[
                    { value: "popular", label: "Sort by: Popular" },
                    { value: "rating", label: "Sort by: Top Rated" },
                    { value: "newest", label: "Sort by: Newest" },
                  ]}
                />
              </div>
            </div>

            {/* Shops */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedShops.map((shop) => (
                <div
                  key={shop.id}
                  className="bg-white rounded-2xl border border-gray-200/80 transition-all duration-200 overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-[2.2/1] w-full overflow-hidden bg-slate-100">
                    <img
                      src={shop.image}
                      alt={shop.name}
                      className="w-full h-full object-cover select-none"
                      loading="lazy"
                    />
                  </div>

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
                        className="inline-flex items-center justify-center px-4 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Visit Shop
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredShops.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200/80 p-8">
                <p className="text-gray-500 text-sm">No shops found matching your search.</p>
              </div>
            ) : (
              <div className="pt-2">
                <Pagination
                  meta={backendData?.meta}
                  currentPage={page}
                  limit={pageSize}
                  totalResult={totalShops}
                  onPageChange={(newPage) => {
                    setPage(newPage);
                    window.scrollTo({ top: 300, behavior: "smooth" });
                  }}
                  itemName="shops"
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}