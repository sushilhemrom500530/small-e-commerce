import { Link } from "react-router-dom";
import { CheckCircle2, Users, Store } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="w-full bg-[#fbfcfd] min-h-screen">
      {/* Page Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#102a4b] via-[#16355e] to-[#214380] text-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              About Us
            </h1>
            <p className="mt-2 text-sm sm:text-base text-blue-100 font-normal">
              Learn more about our mission and values
            </p>
            <div className="mt-3.5 flex items-center gap-2 text-xs sm:text-sm text-blue-200/90 font-medium">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>›</span>
              <span className="text-white">About Us</span>
            </div>
          </div>

          {/* Banner Office Team Graphic */}
          <div className="hidden md:block w-72 lg:w-96 rounded-xl overflow-hidden opacity-90 shadow-md">
            <img
              src="/images/about-team-banner@2x.jpg"
              alt="ShopEase Team Collaborating"
              className="w-full h-auto object-cover select-none"
            />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Mission Text */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
              Our Mission
            </h2>
            <p className="text-sm sm:text-base lg:text-[17px] text-gray-600 leading-relaxed font-normal">
              At <strong className="text-gray-900 font-semibold">ShopEase</strong>, we believe in making online shopping simple, secure, and enjoyable for everyone. Our mission is to connect customers with the best products from trusted shops.
            </p>

            <div className="space-y-3.5 pt-2">
              {[
                "Quality Products",
                "Trusted Sellers",
                "Excellent Support",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm sm:text-base font-semibold text-gray-800">
                  <CheckCircle2 className="w-5 h-5 text-[#2563eb] flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Smiling Shopper Graphic */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-[480px] rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200/70 shadow-sm bg-white">
              <img
                src="/images/about-shopper-woman@2x.jpg"
                alt="Happy customer with shopping bags giving thumbs up"
                className="w-full h-auto object-cover select-none"
              />
            </div>
          </div>

        </div>

        {/* Bottom Metrics / Statistics Strip */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 gap-6 sm:gap-0">
            
            {/* Metric 1 */}
            <div className="flex items-center justify-center gap-4 py-2 sm:py-0">
              <div className="text-[#2563eb]">
                <Users className="w-8 h-8" strokeWidth={1.8} />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#2563eb] tracking-tight block">
                  1M+
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  Happy Customers
                </span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="flex items-center justify-center gap-4 pt-6 sm:pt-0 sm:px-6">
              <div className="text-amber-400 text-3xl leading-none">
                ★
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#2563eb] tracking-tight block">
                  4.8/5
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  Customer Rating
                </span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="flex items-center justify-center gap-4 pt-6 sm:pt-0 sm:px-6">
              <div className="text-[#2563eb]">
                <Store className="w-8 h-8" strokeWidth={1.8} />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#2563eb] tracking-tight block">
                  5K+
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  Trusted Shops
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
