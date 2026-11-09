import { useState, type ChangeEvent, type FormEvent } from "react";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import { message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

export default function AddProduct() {
    const navigate = useNavigate();
    const location = useLocation();
    const isShopOwner = location.pathname.includes("shop-owner") || location.pathname.includes("manager");
    const backProductsLink = isShopOwner ? "/shop-owner/dashboard/products" : "/admin/dashboard/products";

    const [name, setName] = useState("Wireless Headphones");
    const [price, setPrice] = useState("99");
    const [description, setDescription] = useState("High quality wireless headphones with active noise cancellation and long battery life.");
    const [previewImage, setPreviewImage] = useState("/images/product-headphone-main@2x.jpg");
    const [fileName, setFileName] = useState("headphones-preview.jpg");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            message.success("Product added successfully!");
            navigate(backProductsLink);
        }, 600);
    };

    return (
        <div className="space-y-6">
            {/* Title */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1b3a] tracking-tight">
                    {isShopOwner ? "Add Product to My Shop" : "Add Product"}
                </h1>
                <p className="mt-1 text-sm text-slate-500 font-normal">
                    Enter the product details and upload custom thumbnail
                </p>
            </div>

            {/* Main Form Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xs">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: Thumbnail Preview Box */}
                    <div className="md:col-span-5 flex flex-col items-center">
                        <div className="w-full max-w-[280px] aspect-square rounded-2xl bg-slate-50 border border-slate-200/80 overflow-hidden flex items-center justify-center p-6 shadow-2xs">
                            <img
                                src={previewImage}
                                alt="Product Preview"
                                className="w-full h-full object-contain drop-shadow-sm"
                                onError={(e: any) => {
                                    e.target.src = "/images/product-headphone-main@2x.jpg";
                                }}
                            />
                        </div>
                        <span className="font-semibold text-slate-700 text-sm mt-3">
                            Thumbnail
                        </span>
                    </div>

                    {/* Right: Input Fields */}
                    <div className="md:col-span-7 space-y-5">
                        {/* Product Name */}
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                                Product Name
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Product Name"
                                className="w-full px-4 py-2.5 sm:py-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4353ff] transition-all"
                            />
                        </div>

                        {/* Price ($) */}
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                                Price ($)
                            </label>
                            <input
                                type="number"
                                required
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Price in USD"
                                className="w-full px-4 py-2.5 sm:py-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4353ff] transition-all"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                                Description
                            </label>
                            <textarea
                                rows={3}
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="High quality wireless headphones..."
                                className="w-full px-4 py-2.5 sm:py-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4353ff] transition-all resize-none"
                            />
                        </div>

                        {/* Choose File */}
                        <div>
                            <div className="flex items-center gap-3">
                                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-100 transition-colors cursor-pointer shrink-0">
                                    <UploadCloud className="w-4 h-4 text-slate-500" />
                                    <span>Choose File</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                                <span className="text-xs sm:text-sm text-slate-400 truncate">
                                    {fileName || "No file chosen"}
                                </span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-3">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 sm:py-3.5 px-6 rounded-xl bg-[#4353ff] hover:bg-[#3234a8] text-white font-semibold text-sm sm:text-base shadow-md shadow-[#4353ff]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{isSubmitting ? "Adding Product..." : "Add Product"}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
