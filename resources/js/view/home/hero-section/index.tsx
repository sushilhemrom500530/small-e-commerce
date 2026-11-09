import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#ebf3ff] via-[#f4f8ff] to-[#e5efff] py-12 sm:py-16 lg:py-20">
      {/* Soft circular atmospheric glow behind bags */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 w-[520px] h-[380px] bg-[#d4e4fd]/50 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">

          {/* Left Column: Text & Call to Actions */}
          <div className="lg:col-span-6 xl:col-span-6 text-left">

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.12]">
              <span className="block text-[#0a163a]">Smart Shopping</span>
              <span className="block text-[#2563eb] mt-1.5">Better Living</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-sm sm:text-base lg:text-[16px] text-slate-500 font-normal max-w-lg leading-relaxed">
              Discover amazing products from our trusted shops with the best prices.
            </p>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-[#2563eb] text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-colors"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center px-6 py-2.5 rounded-lg text-sm font-semibold bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-2xs transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Graphic */}
          <div className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[460px] lg:max-w-[500px]">
              <img
                src="/images/hero-bags-transparent.png"
                alt="ShopEase Shopping Bags and Cart"
                className="w-full h-auto object-contain select-none"
                loading="eager"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
