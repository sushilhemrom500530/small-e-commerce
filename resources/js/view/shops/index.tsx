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
  const [page, setPage] = useState(1);
  const pageSize = 6;

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
          <aside className="lg:col-span-3 bg-white p-5 rounded-2xl border border-gray-200/80 ">
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
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setPage(1);
                    }}
                    className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-left cursor-pointer ${active
                      ? "bg-primary/10 text-primary font-semibold shadow-2xs"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-primary" : "text-gray-500"}`} />
                    <span>{cat.name}</span>
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
                        className="inline-flex items-center justify-center px-4 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
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