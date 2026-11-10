import { useState } from "react";
import { Link } from "react-router-dom";
import { message } from "antd";
import { Eye, ShoppingCart, Check, Star } from "lucide-react";
import { useAppDispatch } from "../../../redux/hooks.js";
import { addToCart } from "../../../redux/cart-slice/index.js";

export interface IProductCardItem {
  id: number | string;
  name: string;
  category?: string;
  categorySlug?: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewsCount?: number;
  thumbnail: string;
  description?: string;
  shopName?: string;
}

interface ProductCardProps {
  product: IProductCardItem;
  className?: string;
  onAddToCart?: (product: IProductCardItem) => void;
}

export default function ProductCard({
  product,
  className = "",
  onAddToCart,
}: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [isAdded, setIsAdded] = useState(false);

  const detailUrl = `/product/${product.id}`;
  const price = typeof product.price === "number" ? product.price : 89.99;
  const originalPrice =
    typeof product.originalPrice === "number"
      ? product.originalPrice
      : price > 0
        ? Math.round(price * 1.25)
        : undefined;
  const rating = product.rating || 4.8;
  const reviewsCount = product.reviewsCount ?? 120;

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onAddToCart) {
      onAddToCart(product);
    } else {
      dispatch(
        addToCart({
          id: String(product.id),
          name: product.name,
          price: price,
          originalPrice: originalPrice,
          image: product.thumbnail,
          quantity: 1,
          shopName: product.shopName,
        })
      );
      message.success(`"${product.name}" added to cart!`);
    }

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200/80 transition-all duration-200 overflow-hidden flex flex-col group ${className}`}
    >
      <Link
        to={detailUrl}
        className="relative aspect-[16/11] w-full overflow-hidden bg-slate-50/80 flex items-center justify-center block"
      >
        <img
          src={product.thumbnail}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 select-none"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/images/product-headphone-main@2x.jpg";
          }}
        />

        {/* Category Badge on top-left */}
        {product.category && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-white/95 text-slate-700 border border-slate-200/80">
            {product.category}
          </span>
        )}
      </Link>

      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1">
        <div>
          {product.shopName && (
            <p className="text-[11px] font-medium text-slate-400 mb-0.5 line-clamp-1">
              Sold by <span className="text-slate-600">{product.shopName}</span>
            </p>
          )}

          <Link
            to={detailUrl}
            className="text-sm sm:text-[15px] font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug line-clamp-1"
            title={product.name}
          >
            {product.name}
          </Link>

          <div className="flex items-center justify-between gap-2 mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-gray-900">
                ${price.toFixed(2)}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-xs text-gray-400 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-gray-600 bg-amber-50/70 border border-amber-200/50 px-2 py-0.5 rounded-md">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-amber-700">{rating}</span>
              <span className="text-gray-400">({reviewsCount})</span>
            </div>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2">

          <Link
            to={detailUrl}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 hover:border-primary hover:text-primary text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold rounded-xl transition-all text-center cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </Link>

          <button
            type="button"
            onClick={handleAddClick}
            className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer ${isAdded
              ? "bg-emerald-600 shadow-emerald-500/20"
              : "bg-primary hover:bg-primary-hover shadow-primary/20"
              }`}
            title="Add to Cart"
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

