import { CheckCircle2, Users, Store } from "lucide-react";
import PageBanner from "../../Components/shared/page-banner/index.js";

export default function AboutPage() {
  return (
    <div className="w-full bg-[#fbfcfd] min-h-screen">
      {/* Reusable Page Banner */}
      <PageBanner
        title="About Us"
        description="Learn more about our mission and values"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us" },
        ]}
        backgroundImage="/images/about-banner-hd.png"
        imageAlt="ShopEase Team Collaborating"
        gradient="bg-gradient-to-r from-[#173766] via-[#1c4176] to-[#244f8b]"
      />

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
