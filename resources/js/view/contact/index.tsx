import { useState, type FormEvent } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { RiMessengerLine } from "react-icons/ri";
import PageBanner from "../../Components/shared/page-banner/index.js";
import ContactBannerMap from "../../Components/shared/page-banner/contact-map.js";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setName("");
      setEmail("");
      setMessage("");
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="w-full bg-[#fbfcfd] min-h-screen">
      {/* Reusable Page Banner with Pure SVG Vector Map */}
      <PageBanner
        title="Contact Us"
        description="We're here to help. Get in touch with us!"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact Us" },
        ]}
        gradient="bg-gradient-to-r from-[#0b1e36] via-[#0d2544] to-[#12335c]"
        rightElement={<ContactBannerMap />}
      />

      {/* Main Content: Info & Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Get in Touch Info */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Get in Touch
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                Have a question or need assistance? Feel free to reach out to us.
              </p>
            </div>

            {/* Contact Details List */}
            <div className="space-y-4 pt-2">
              {/* Phone */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563eb] flex-shrink-0">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  +880 123 456 789
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563eb] flex-shrink-0">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  support@shopease.com
                </span>
              </div>

              {/* Address */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563eb] flex-shrink-0">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  123 Business Street, Dhaka-1205
                </span>
              </div>
            </div>

            {/* Social Icons Strip */}
            <div className="flex items-center gap-3 pt-3">
              {[
                { id: "fb", icon: <FaFacebookF size={14} />, label: "Facebook" },
                { id: "yt", icon: <FaYoutube size={14} />, label: "YouTube" },
                { id: "li", icon: <FaLinkedinIn size={14} />, label: "LinkedIn" },
                { id: "msg", icon: <RiMessengerLine size={15} />, label: "Messenger" },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-label={item.label}
                  className="w-8 h-8 rounded-full bg-[#2563eb] hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-2xs"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-2xs">
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">
                    ✓
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Message Sent!</h3>
                  <p className="text-sm text-gray-600 max-w-sm mx-auto">
                    Thank you for contacting ShopEase. Our team will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Your Name */}
                  <div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      required
                      className="w-full border border-gray-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                    />
                  </div>

                  {/* Your Email */}
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your Email"
                      required
                      className="w-full border border-gray-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                    />
                  </div>

                  {/* Your Message */}
                  <div>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Your Message"
                      required
                      rows={5}
                      className="w-full border border-gray-200/90 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none bg-white"
                    />
                  </div>

                  {/* Send Message Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm shadow-2xs"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
