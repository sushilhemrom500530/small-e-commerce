import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard, {
  type IProductCardItem,
} from "../../../Components/reuseable/product-card/index.js";
import { useGetAllProductsQuery } from "../../../redux/features/ecommerce/index.js";

interface FeaturedShop {
  id: string;
  name: string;
  category: string;
  image: string;
  image2x: string;
  slug: string;
}

const defaultFeaturedProducts: IProductCardItem[] = [
  {
    id: 1,
    name: "Samsung Galaxy A56",
    category: "Electronics",
    categorySlug: "electronics",
    price: 449.99,
    originalPrice: 499.99,
    rating: 4.8,
    reviewsCount: 320,
    thumbnail:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
    description:
      "Stunning AMOLED display, 5G connectivity, and all-day battery life.",
    shopName: "Tech World",
  },
  {
    id: 2,
    name: 'Apple MacBook Pro 14"',
    category: "Electronics",
    categorySlug: "electronics",
    price: 1999.0,
    originalPrice: 2199.0,
    rating: 4.9,
    reviewsCount: 540,
    thumbnail:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    description:
      "Supercharged by M-Series chip with mind-blowing battery efficiency.",
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
    thumbnail:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    description:
      "Industry-leading noise canceling with dual processors and 8 microphones.",
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
    thumbnail:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    description:
      "Advanced biometric tracking, built-in GPS, waterproof up to 50 meters.",
    shopName: "Fashion Hub",
  },
];

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
  const { data: apiData } = useGetAllProductsQuery({ limit: 4 });

  const backendProducts: IProductCardItem[] = (apiData?.results || []).map(
    (p: any) => ({
      id: p.id,
      name: p.name,
      category: p.categoryName || "General",
      categorySlug: p.categorySlug || "all",
      price: typeof p.price === "number" ? p.price : 89.99,
      originalPrice:
        typeof p.price === "number" ? Math.round(p.price * 1.25) : 120.0,
      rating: p.rating || 4.8,
      reviewsCount: 120,
      thumbnail: p.thumbnail || "/images/product-headphone-main@2x.jpg",
      description: p.description || "",
      shopName: p.creatorName ? `${p.creatorName}'s Shop` : "Verified Store",
    })
  );

  const displayProducts =
    backendProducts.length > 0
      ? backendProducts.slice(0, 4)
      : defaultFeaturedProducts;

  return (
    <section className="bg-white pt-8 pb-14 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Featured Products
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Explore our top picked items from verified stores
              </p>
            </div>
            <Link
              to="/shop"
              className="text-sm font-semibold text-primary hover:text-primary-hover inline-flex items-center gap-1 group transition-colors"
            >
              View All Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Short Product */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Featured Shops */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Featured Shops
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Discover popular storefronts with verified inventory
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

          {/* Shop Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {featuredShops.map((shop) => (
              <div
                key={shop.id}
                className="bg-white rounded-2xl border border-gray-200/80 transition-all duration-200 overflow-hidden flex flex-col group"
              >
                <div className="relative aspect-[2.1/1] w-full overflow-hidden bg-slate-100">
                  <img
                    src={shop.image2x}
                    srcSet={`${shop.image} 1x, ${shop.image2x} 2x`}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 select-none"
                    loading="lazy"
                  />
                </div>

                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug">
                      {shop.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {shop.category}
                    </p>
                  </div>

                  <div className="mt-3">
                    <Link
                      to={`/shops/${shop.slug}`}
                      className="inline-flex items-center justify-center px-3.5 py-1.5 bg-primary hover:bg-primary-hover !text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                    >
                      Visit Shop
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
