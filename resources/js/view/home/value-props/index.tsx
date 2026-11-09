import { Truck, ShieldCheck, Headphones, RotateCcw } from "lucide-react";

const valueProps = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $50",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "100% secure checkout",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "We're here to help",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30 days return policy",
  },
];

export default function ValueProps() {
  return (
    <section className="bg-white border-b border-gray-100 py-7 sm:py-9">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {valueProps.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-center gap-3.5">
                <div className="flex-shrink-0 text-[#2563eb]">
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

