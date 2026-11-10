import { useState } from "react";
import { Link } from "react-router-dom";
import { message } from "antd";
import {
  Minus,
  Plus,
  X,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Volume2,
  Battery,
  Wifi,
  CheckCircle2,
} from "lucide-react";
import PageBanner from "../../Components/shared/page-banner/index.js";
import CartBannerGraphic from "../../Components/shared/page-banner/cart-graphic.js";
import { useAppDispatch, useAppSelector } from "../../redux/hooks.js";
import {
  updateQuantity,
  removeFromCart,
  addToCart,
  clearCart,
  DEFAULT_CART_ITEM,
} from "../../redux/cart-slice/index.js";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart?.items ?? []);
  const shippingFee = useAppSelector((state) => state.cart?.shippingFee ?? 0);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + (cartItems.length > 0 ? shippingFee : 0);

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    dispatch(clearCart());
    message.success("Purchase completed successfully! Your order has been placed.");
    setTimeout(() => {
      setCheckoutSuccess(false);
    }, 6000);
  };

  const handleResetSample = () => {
    dispatch(addToCart(DEFAULT_CART_ITEM));
  };

  return (
    <div className="w-full bg-[#fbfcfd] min-h-screen">
      {/* Reusable Page Banner matching Reference Mockup */}
      <PageBanner
        title="Your Cart"
        description="Review your items and proceed to checkout"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cart" },
        ]}
        gradient="bg-gradient-to-r from-[#0b1e36] via-[#0d2544] to-[#12335c]"
        rightElement={<CartBannerGraphic />}
      />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {checkoutSuccess && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm sm:text-base text-emerald-950">
                  Checkout Successful!
                </p>
                <p className="text-xs sm:text-sm text-emerald-700">
                  Your order has been placed successfully and your cart items have been cleared.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-white rounded-lg border border-emerald-200 text-emerald-700 shadow-2xs">
              Order Confirmed
            </span>
          </div>
        )}

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-3xl border border-gray-200/80 p-8 sm:p-14 text-center w-full">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5">
              <ShoppingCart className="w-10 h-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
              You haven&apos;t added any products yet. Discover top products from our
              trusted shops!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover !text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                Explore Shops <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={handleResetSample}
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors"
              >
                Add Sample Item
              </button>
            </div>
          </div>
        ) : (
          /* Two Column Grid: Items List & Order Summary */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between pb-1">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Items in Cart ({cartItems.length})
                </h2>
                <button
                  type="button"
                  onClick={() => dispatch(clearCart())}
                  className="text-xs sm:text-sm text-gray-400 hover:text-red-600 font-medium transition-colors"
                >
                  Clear all
                </button>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Product Details (Image + Name + Tags) */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#f0f5fc] rounded-xl flex items-center justify-center p-2 flex-shrink-0 border border-blue-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain select-none"
                      />
                    </div>
                    <div>
                      <Link
                        to={`/product/${item.id}`}
                        className="text-base sm:text-lg font-bold text-gray-900 hover:text-primary transition-colors leading-snug"
                      >
                        {item.name}
                      </Link>

                      {item.shopName && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          From <span className="font-medium text-gray-600">{item.shopName}</span>
                        </p>
                      )}

                      {/* 3 mini feature icons matching mockup */}
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className="w-6 h-6 rounded-md bg-gray-50 border border-gray-200/60 flex items-center justify-center text-gray-500"
                          title="Wireless Audio"
                        >
                          <Wifi className="w-3.5 h-3.5" />
                        </span>
                        <span
                          className="w-6 h-6 rounded-md bg-gray-50 border border-gray-200/60 flex items-center justify-center text-gray-500"
                          title="High Capacity Battery"
                        >
                          <Battery className="w-3.5 h-3.5" />
                        </span>
                        <span
                          className="w-6 h-6 rounded-md bg-gray-50 border border-gray-200/60 flex items-center justify-center text-gray-500"
                          title="Noise Cancellation"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing, Quantity Counter, Total, Remove */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    {/* Unit Price Badge */}
                    <div className="bg-[#f0f5fc] text-gray-900 font-bold px-3 py-1.5 rounded-xl text-sm border border-blue-100/60">
                      ${item.price.toFixed(2)}
                    </div>

                    {/* Quantity Selector */}
                    <div className="inline-flex items-center border border-gray-200/90 rounded-xl bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: item.quantity - 1,
                            })
                          )
                        }
                        className="p-2 text-gray-400 hover:text-gray-700 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-gray-900 text-sm">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                        className="p-2 text-gray-400 hover:text-gray-700 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <span className="font-extrabold text-gray-900 text-base sm:text-lg min-w-[72px] text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>

                    {/* Remove Cross Button */}
                    <button
                      type="button"
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Value Propositions Strip */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 text-xs text-gray-600 font-medium">
                  <Truck className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Free shipping over $50</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 text-xs text-gray-600 font-medium">
                  <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>100% Secure Checkout</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 text-xs text-gray-600 font-medium">
                  <RotateCcw className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>30-Day Easy Returns</span>
                </div>
              </div>
            </div>

            {/* Right: Order Summary Card */}
            <div className="lg:col-span-4 sticky top-24">
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 space-y-5">
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-gray-600 font-normal">
                    <span>Subtotal</span>
                    <span className="text-gray-900 font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600 font-normal">
                    <span>Shipping</span>
                    <span className="text-gray-900 font-semibold">
                      {shippingFee === 0 ? "$0.00" : `$${shippingFee.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-xl font-extrabold text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 px-4 rounded-xl shadow-sm shadow-primary/20 text-center transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  Proceed to Checkout
                </button>

                <div className="pt-2 text-center">
                  <Link
                    to="/shop"
                    className="text-xs text-gray-500 hover:text-primary font-medium transition-colors inline-flex items-center gap-1"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

