import { useState } from "react";
import { Search, Check, Plus } from "lucide-react";
import { message } from "antd";

interface CatalogItem {
    id: number;
    name: string;
    price: number;
    image: string;
}

const defaultCatalog: CatalogItem[] = [
    {
        id: 1,
        name: "Laptop",
        price: 800,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=80",
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 150,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
    },
    {
        id: 3,
        name: "Headphones",
        price: 120,
        image: "/images/product-headphone-main@2x.jpg",
    },
    {
        id: 4,
        name: "Backpack",
        price: 65,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
    },
    {
        id: 5,
        name: "Shoes",
        price: 95,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80",
    },
    {
        id: 6,
        name: "Mechanical Keyboard",
        price: 110,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80",
    },
];

export default function ProductCatalog() {
    const [searchTerm, setSearchTerm] = useState("");
    const [addedIds, setAddedIds] = useState<number[]>([]);

    const filtered = defaultCatalog.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddToShop = (item: CatalogItem) => {
        if (addedIds.includes(item.id)) {
            message.info(`${item.name} is already in your shop`);
            return;
        }
        setAddedIds([...addedIds, item.id]);
        message.success(`Added ${item.name} to your shop!`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1b3a] tracking-tight">
                    Product Catalog
                </h1>
                <p className="mt-1 text-sm text-slate-500 font-normal">
                    Browse shared products and add to your shop
                </p>
            </div>

            {/* Search Input Bar */}
            <div className="relative max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl placeholder-slate-400 text-slate-700 shadow-2xs focus:outline-none focus:border-[#4353ff]"
                />
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product) => {
                    const isAdded = addedIds.includes(product.id);
                    return (
                        <div
                            key={product.id}
                            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group"
                        >
                            {/* Product Image */}
                            <div className="w-full h-48 rounded-xl bg-slate-50/80 overflow-hidden flex items-center justify-center p-3 mb-4">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                    onError={(e: any) => {
                                        e.target.src = "/images/product-headphone-main@2x.jpg";
                                    }}
                                />
                            </div>

                            {/* Info */}
                            <div>
                                <h3 className="text-base font-bold text-[#0c1b3a]">
                                    {product.name}
                                </h3>
                                <p className="text-lg font-black text-[#0c1b3a] mt-1 mb-4">
                                    ${product.price}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => handleAddToShop(product)}
                                    className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                                        isAdded
                                            ? "bg-emerald-600 text-white shadow-emerald-600/20"
                                            : "bg-[#4353ff] hover:bg-[#3234a8] text-white shadow-[#4353ff]/20"
                                    }`}
                                >
                                    {isAdded ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            <span>Added to Shop</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            <span>Add to My Shop</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
