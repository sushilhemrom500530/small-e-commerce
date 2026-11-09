import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Star,
  CheckCircle2,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  Check,
} from "lucide-react";
import { useAppDispatch } from "../../redux/hooks.js";
import { addToCart } from "../../redux/cart-slice/index.js";

export default function ProductDetailPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: "wireless-headphones-1",
        name: "Wireless Headphones",
        price: 89.99,
        originalPrice: 120.0,
        image: "/images/product-headphone-main@2x.jpg",
        quantity,
        specs: ["Bluetooth 5.0", "Noise Cancellation", "Long Battery"],
        shopName: "Tech World",
      })
    );
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const thumbnails = [
    { id: 1, src: "/images/product-thumb-1@2x.jpg" },
    { id: 2, src: "/images/product-thumb-2@2x.jpg" },
    { id: 3, src: "/images/product-thumb-3@2x.jpg" },
    { id: 4, src: "/images/product-thumb-4@2x.jpg" },
  ];

  return (
    <div className="w-full bg-[#fbfcfd] min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>›</span>
          <Link to="/shop" className="hover:text-primary transition-colors">
            Shop
          </Link>
          <span>›</span>
          <Link to="/shop" className="hover:text-primary transition-colors">
            Electronics
          </Link>
          <span>›</span>
          <span className="text-gray-900 font-semibold">Wireless Headphones</span>
        </nav>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 lg:p-10 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Left: Gallery (Thumbnails + Main Image) */}
            <div className="lg:col-span-6 flex gap-4 sm:gap-5">
              {/* Thumbnails list */}
              <div className="flex flex-col gap-3">
                {thumbnails.map((thumb) => {
                  const active = selectedImage === thumb.id;
                  return (
                    <button
                      key={thumb.id}
                      onClick={() => setSelectedImage(thumb.id)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border p-1 bg-white flex items-center justify-center overflow-hidden transition-all cursor-pointer ${active
                        ? "border-primary ring-2 ring-primary/20 shadow-xs"
                        : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      <img
                        src={thumb.src}
                        alt={`Thumbnail ${thumb.id}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  );
                })}
              </div>

              {/* Main Image Stage */}
              <div className="flex-1 bg-[#f0f5fc] rounded-2xl p-6 sm:p-8 flex items-center justify-center min-h-[320px] sm:min-h-[400px]">
                <img
                  src="/images/product-headphone-main@2x.jpg"
                  alt="Wireless Headphones"
                  className="w-full max-w-[340px] h-auto object-contain select-none drop-shadow-sm"
                />
              </div>
            </div>

            {/* Right: Product Details & Actions */}
            <div className="lg:col-span-6 space-y-5">

              {/* Title & Stock Badge */}
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  Wireless Headphones
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex-shrink-0">
                  <span className="text-emerald-500">✦</span> In Stock
                </span>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-base">★</span>
                  ))}
                </div>
                <span className="font-bold text-gray-900">4.8</span>
                <span className="text-gray-400 text-xs">(1,250 reviews)</span>
              </div>

              {/* Price Row */}
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl font-black text-gray-900">
                  $89.99
                </span>
                <span className="text-base sm:text-lg text-gray-400 line-through">
                  $120.00
                </span>
                <span className="bg-rose-50 text-rose-600 text-xs font-bold px-2.5 py-1 rounded-md">
                  25% OFF
                </span>
              </div>

              {/* Short Description */}
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                Experience premium sound quality with our wireless headphones. Perfect for work, travel, and everyday use.
              </p>

              {/* Feature Highlights */}
              <div className="space-y-2.5 pt-1">
                {[
                  "Bluetooth 5.0",
                  "Noise Cancellation",
                  "Long Battery Life",
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5 text-sm font-medium text-gray-800">
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Quantity, Add to Cart, Wishlist */}
              <div className="pt-3 flex flex-wrap items-center gap-3.5">
                {/* Quantity */}
                <div className="inline-flex items-center border border-gray-200 rounded-xl bg-white shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-gray-900 text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 min-w-[180px] font-semibold py-3 px-6 rounded-xl shadow-sm transition-all text-sm text-center flex items-center justify-center gap-2 cursor-pointer ${addedToast
                    ? "bg-emerald-600 text-white shadow-emerald-500/20"
                    : "bg-primary hover:bg-primary-hover text-white shadow-primary/20"
                    }`}
                >
                  {addedToast ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Cart!
                    </>
                  ) : (
                    "Add to Cart"
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3 rounded-xl border transition-colors shadow-2xs cursor-pointer ${isWishlisted
                    ? "border-rose-200 bg-rose-50 text-rose-500"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-rose-500" : ""}`} />
                </button>
              </div>

            </div>

          </div>

          {/* Value Props 3-column banner inside product card */}
          <div className="mt-10 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3.5">
              <Truck className="w-6 h-6 text-[#2563eb]" strokeWidth={1.8} />
              <div>
                <h4 className="text-sm font-bold text-gray-900">Free Shipping</h4>
                <p className="text-xs text-gray-500">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <ShieldCheck className="w-6 h-6 text-[#2563eb]" strokeWidth={1.8} />
              <div>
                <h4 className="text-sm font-bold text-gray-900">Secure Payment</h4>
                <p className="text-xs text-gray-500">100% secure checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <RotateCcw className="w-6 h-6 text-[#2563eb]" strokeWidth={1.8} />
              <div>
                <h4 className="text-sm font-bold text-gray-900">Easy Returns</h4>
                <p className="text-xs text-gray-500">30 days return</p>
              </div>
            </div>
          </div>

          {/* Description / Specifications / Reviews Tabs */}
          <div className="mt-10 pt-6">
            <div className="border-b border-gray-200 flex items-center gap-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${activeTab === "description"
                  ? "text-gray-900 border-b-2 border-[#2563eb]"
                  : "text-gray-500 hover:text-gray-800"
                  }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("specifications")}
                className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${activeTab === "specifications"
                  ? "text-gray-900 border-b-2 border-[#2563eb]"
                  : "text-gray-500 hover:text-gray-800"
                  }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${activeTab === "reviews"
                  ? "text-gray-900 border-b-2 border-[#2563eb]"
                  : "text-gray-500 hover:text-gray-800"
                  }`}
              >
                Reviews (1,250)
              </button>
            </div>

            <div className="py-5 text-sm text-gray-600 leading-relaxed">
              {activeTab === "description" && (
                <p>
                  Enjoy crystal clear sound and comfortable design. These wireless headphones are perfect for music lovers, professionals, and travelers.
                </p>
              )}
              {activeTab === "specifications" && (
                <ul className="space-y-2 text-gray-600">
                  <li><strong>Connectivity:</strong> Bluetooth 5.0 (up to 10m range)</li>
                  <li><strong>Battery Life:</strong> Up to 40 hours playtime</li>
                  <li><strong>Charging:</strong> USB-C fast charging (10 min charge gives 3 hours)</li>
                  <li><strong>Weight:</strong> 250g ultra-lightweight ergonomic design</li>
                </ul>
              )}
              {activeTab === "reviews" && (
                <p>
                  Rated 4.8 out of 5 based on 1,250 customer reviews. "Super comfortable, stellar audio quality, and battery lasts forever!"
                </p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Frequently Asked Questions Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#102a4b] via-[#16355e] to-[#214380] text-white py-10 sm:py-14 my-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm sm:text-base text-blue-100 font-normal">
              Find answers to common questions
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-blue-200/90 font-medium">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>›</span>
              <span className="text-white">FAQ</span>
            </div>
          </div>

          {/* Speech bubble with question mark illustration */}
          <div className="hidden sm:flex items-center justify-end pr-6 select-none">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/95 shadow-lg flex items-center justify-center">
              <span className="text-[#2563eb] text-4xl sm:text-5xl font-black">?</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
