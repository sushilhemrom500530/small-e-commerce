import { useState } from "react";
import { Link } from "react-router-dom";
import { message } from "antd";
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
  Eye,
  ShoppingCart,
  Check,
} from "lucide-react";
import PageBanner from "../../Components/shared/page-banner/index.js";
import Pagination from "../../Components/reuseable/pagination/index.js";
import ProductCard from "../../Components/reuseable/product-card/index.js";
import {
  useGetAllProductsQuery,
  useGetCategoriesQuery,
} from "../../redux/features/ecommerce/index.js";
import { useAppDispatch } from "../../redux/hooks.js";
import { addToCart } from "../../redux/cart-slice/index.js";

interface IProductItem {
  id: number | string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  thumbnail: string;
  description?: string;
  shopName?: string;
}

const categoryTabs = [
  { id: "all", name: "All Categories", icon: LayoutGrid },
  { id: "electronics", name: "Electronics", icon: Laptop },
  { id: "fashion", name: "Fashion", icon: Shirt },
  { id: "home", name: "Home & Living", icon: Home },
  { id: "beauty", name: "Beauty & Personal Care", icon: Sparkles },
  { id: "sports", name: "Sports & Outdoors", icon: Dumbbell },
  { id: "health", name: "Health & Wellness", icon: HeartPulse },
];

const fallbackProducts: IProductItem[] = [
  {
    id: 1,
    name: "Samsung Galaxy A56",
    category: "Electronics",
    categorySlug: "electronics",
    price: 449.99,
    originalPrice: 499.99,
    rating: 4.8,
    reviewsCount: 320,
    thumbnail: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
    description: "Stunning AMOLED display, 5G connectivity, and all-day battery life.",
    shopName: "Tech World",
  },
  {
    id: 2,
    name: "Apple MacBook Pro 14\"",
    category: "Electronics",
    categorySlug: "electronics",
    price: 1999.0,
    originalPrice: 2199.0,
    rating: 4.9,
    reviewsCount: 540,
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    description: "Supercharged by M-Series chip with mind-blowing battery efficiency and liquid retina display.",
    shopName: "Tech World",
  },
  {
    id: 3,
    name: "Sony WH-1000XM5 Headphones",
    category: "Electronics",
    categorySlug: "electronics",
    price: 349.99,
    originalPrice: 399.99,
    rating: 4.9,
    reviewsCount: 1250,
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    description: "Industry-leading noise canceling with dual processors and 8 microphones.",
    shopName: "Tech World",
  },
  {
    id: 4,
    name: "Smart Fitness Watch Ultra",
    category: "Sports & Outdoors",
    categorySlug: "sports",
    price: 179.99,
    originalPrice: 220.0,
    rating: 4.7,
    reviewsCount: 410,
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    description: "Accurate health sensors, heart rate tracking, waterproof GPS smartwatch.",
    shopName: "Sports Zone",
  },
  {
    id: 5,
    name: "Minimalist Urban Backpack",
    category: "Fashion",
    categorySlug: "fashion",
    price: 59.99,
    originalPrice: 79.99,
    rating: 4.6,
    reviewsCount: 185,
    thumbnail: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    description: "Water-resistant commuter backpack with dedicated padded laptop compartment.",
    shopName: "Fashion Hub",
  },
  {
    id: 6,
    name: "Classic Slim-Fit Denim Jacket",
    category: "Fashion",
    categorySlug: "fashion",
    price: 89.0,
    originalPrice: 110.0,
    rating: 4.7,
    reviewsCount: 230,
    thumbnail: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
    description: "Vintage washed denim with comfortable stretch and rugged brass buttons.",
    shopName: "Fashion Hub",
  },
  {
    id: 7,
    name: "Mechanical Gaming Keyboard RGB",
    category: "Electronics",
    categorySlug: "electronics",
    price: 99.99,
    originalPrice: 129.99,
    rating: 4.8,
    reviewsCount: 680,
    thumbnail: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    description: "Tactile mechanical switches, customizable per-key RGB backlighting.",
    shopName: "Tech World",
  },
  {
    id: 8,
    name: "Breathable Running Sneakers",
    category: "Sports & Outdoors",
    categorySlug: "sports",
    price: 119.5,
    originalPrice: 145.0,
    rating: 4.8,
    reviewsCount: 512,
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    description: "Lightweight cushioned foam sole designed for distance training and daily runs.",
    shopName: "Sports Zone",
  },
  {
    id: 9,
    name: "Stainless Steel Smart Thermos",
    category: "Home & Living",
    categorySlug: "home",
    price: 34.99,
    originalPrice: 45.0,
    rating: 4.6,
    reviewsCount: 140,
    thumbnail: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
    description: "Double-walled vacuum insulated bottle with digital LED temperature readout.",
    shopName: "Home Decor",
  },
  {
    id: 11,
    name: "Luxury Amber Fragrance Perfume",
    category: "Beauty & Personal Care",
    categorySlug: "beauty",
    price: 74.99,
    originalPrice: 95.0,
    rating: 4.7,
    reviewsCount: 95,
    thumbnail: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
    description: "Warm woody amber accords blended with crisp citrus top notes for all-day allure.",
    shopName: "Beauty Zone",
  },
  {
    id: 12,
    name: "Hydrating Facial Primer & Serum",
    category: "Beauty & Personal Care",
    categorySlug: "beauty",
    price: 28.0,
    originalPrice: 36.0,
    rating: 4.8,
    reviewsCount: 210,
    thumbnail: "https://images.pexels.com/photos/30836145/pexels-photo-30836145/free-photo-of-elevate-your-makeup-game-with-e-l-f-power-grip-primer.jpeg?cs=tinysrgb&dpr=1&w=500",
    description: "Infused with hyaluronic acid for 24-hour hydration and a flawless dewy finish.",
    shopName: "Beauty Zone",
  },
  {
    id: 13,
    name: "Modern Geometric Ceramic Vase",
    category: "Home & Living",
    categorySlug: "home",
    price: 42.0,
    originalPrice: 55.0,
    rating: 4.7,
    reviewsCount: 88,
    thumbnail: "https://spectrum-brand.com/cdn/shop/products/geometric-foam-styling-props-for-photography-small-square-10cm-blush-pink-lifestyle-inuse-2_74707657-961d-42f6-9815-128744b070a7.jpg?v=1701778442&width=1001",
    description: "Sculptural Scandinavian-inspired ceramic home decor centerpiece.",
    shopName: "Home Decor",
  },
];

export default function ShopProductsPage() {
  const dispatch = useAppDispatch();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);
  const [addedItemIds, setAddedItemIds] = useState<Record<string | number, boolean>>({});
  const pageSize = 9;

  const { data: apiData, isLoading } = useGetAllProductsQuery({
    search: searchQuery,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    page,
    limit: pageSize,
  });

  const { data: catData } = useGetCategoriesQuery();

  // Map backend products if available, otherwise use rich fallback list
  const backendProducts: IProductItem[] = (apiData?.results || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    category: p.categoryName || "General",
    categorySlug: p.categorySlug || "all",
    price: typeof p.price === "number" ? p.price : 89.99,
    originalPrice: typeof p.price === "number" ? Math.round(p.price * 1.25) : 120.0,
    rating: p.rating || 4.8,
    reviewsCount: 120,
    thumbnail: p.thumbnail || "/images/product-headphone-main@2x.jpg",
    description: p.description || "",
    shopName: p.creatorName ? `${p.creatorName}'s Shop` : "ShopEase Verified",
  }));

  const activeProductsSource = backendProducts.length > 0 ? backendProducts : fallbackProducts;

  // Filter & sort
  const filteredProducts = activeProductsSource.filter((prod) => {
    const matchesCategory =
      selectedCategory === "all" ||
      prod.categorySlug.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      prod.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.description && prod.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0; // default 'popular'
  });

  const totalCount = apiData?.meta?.totalResult ?? sortedProducts.length;
  const paginatedProducts = apiData?.meta
    ? sortedProducts
    : sortedProducts.slice((page - 1) * pageSize, page * pageSize);

  const handleAddToCart = (product: IProductItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      addToCart({
        id: String(product.id),
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.thumbnail,
        quantity: 1,
        shopName: product.shopName,
      })
    );

    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    message.success(`"${product.name}" added to cart!`);

    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <div className="w-full bg-[#fbfcfd] min-h-screen">
      {/* Page Header Banner */}
      <PageBanner
        title="Our Products"
        description="Discover top quality products from verified shops at the best prices"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shop" },
        ]}
        rightElement={
          <div className="relative w-44 h-32 flex items-center justify-center opacity-90 select-none mr-6 sm:mr-12">
            <svg viewBox="0 0 160 140" fill="none" className="w-full h-full text-blue-300">
              <path
                d="M 20 110 C 50 105, 80 80, 110 50"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeDasharray="4 4"
                opacity="0.55"
              />
              <rect
                x="65"
                y="40"
                width="74"
                height="78"
                rx="12"
                stroke="currentColor"
                strokeWidth="2.5"
              />
              <path
                d="M 85 40 V 28 C 85 20 119 20 119 28 V 40"
                stroke="currentColor"
                strokeWidth="2.5"
              />
            </svg>
          </div>
        }
      />

      {/* Main Content Area: Categories Sidebar + Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Sidebar: Categories */}
          <aside className="lg:col-span-3 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 tracking-tight">
              Categories
            </h2>

            <div className="flex flex-col space-y-1.5">
              {categoryTabs.map((cat) => {
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

          {/* Right Main Content */}
          <main className="lg:col-span-9 space-y-6">

            {/* Search & Sort Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search products by title, category..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-gray-200/90 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="flex items-center justify-end">
                <div className="relative inline-flex items-center">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-200/90 rounded-xl px-4 py-2.5 pr-9 text-xs sm:text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:border-primary cursor-pointer shadow-2xs"
                  >
                    <option value="popular">Sort by: Featured</option>
                    <option value="rating">Sort by: Top Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200/80 p-8">
                <p className="text-gray-500 text-sm font-medium">No products found matching your filter criteria.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setPage(1);
                  }}
                  className="mt-4 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Responsive Pagination */}
            {filteredProducts.length > 0 && (
              <div className="pt-4">
                <Pagination
                  meta={apiData?.meta}
                  currentPage={page}
                  limit={pageSize}
                  totalResult={totalCount}
                  onPageChange={(newPage) => {
                    setPage(newPage);
                    window.scrollTo({ top: 300, behavior: "smooth" });
                  }}
                  itemName="products"
                />
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}

