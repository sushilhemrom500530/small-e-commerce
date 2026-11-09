import { useState, type FormEvent } from "react";
import { Store, MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";
import { message } from "antd";

export default function MyShopPage() {
    const [shopName, setShopName] = useState("Tech World");
    const [category, setCategory] = useState("Consumer Electronics & Gadgets");
    const [phone, setPhone] = useState("+1 234 567 8900");
    const [email, setEmail] = useState("contact@techworld.com");
    const [address, setAddress] = useState("123 Innovation Blvd, Silicon Valley, CA 94025");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            message.success("Shop information updated successfully!");
        }, 500);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1b3a] tracking-tight">
                    My Shop
                </h1>
                <p className="mt-1 text-sm text-slate-500 font-normal">
                    Manage your store profile, branding, and contact details
                </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xs max-w-4xl">
                <form onSubmit={handleSave} className="space-y-6">
                    {/* Storefront Banner / Header Card */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/70 border border-slate-100 mb-8">
                        <div className="w-28 h-28 rounded-2xl bg-white p-3 shadow-xs border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                            <img
                                src="/images/storefront-3d-transparent.png"
                                alt="Shop Preview"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="text-center sm:text-left space-y-1">
                            <div className="flex items-center justify-center sm:justify-start gap-2.5">
                                <h2 className="text-2xl font-black text-[#0c1b3a]">
                                    {shopName}
                                </h2>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                                    Active
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">
                                {category}
                            </p>
                            <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-1">
                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Silicon Valley, CA</span>
                                <span className="flex items-center gap-1"><Store className="w-3.5 h-3.5" /> 24 Live Products</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                                Shop Name
                            </label>
                            <input
                                type="text"
                                required
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                className="w-full px-4 py-2.5 sm:py-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#4353ff]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                                Category
                            </label>
                            <input
                                type="text"
                                required
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2.5 sm:py-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#4353ff]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                                Support Phone
                            </label>
                            <input
                                type="text"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-2.5 sm:py-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#4353ff]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                                Support Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 sm:py-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#4353ff]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                            Physical Address
                        </label>
                        <input
                            type="text"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-4 py-2.5 sm:py-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#4353ff]"
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2.5 rounded-xl bg-[#4353ff] hover:bg-[#3234a8] text-white font-semibold text-sm shadow-md shadow-[#4353ff]/20 transition-all cursor-pointer flex items-center gap-2"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{isSaving ? "Saving Changes..." : "Save Changes"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

