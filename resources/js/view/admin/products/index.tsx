import { useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { message, Popconfirm } from "antd";

interface ProductItem {
    id: number;
    name: string;
    image: string;
    createdBy: string;
    status: "Active" | "Inactive";
}

const initialProducts: ProductItem[] = [
    {
        id: 1,
        name: "Laptop",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&auto=format&fit=crop&q=80",
        createdBy: "Admin",
        status: "Active",
    },
    {
        id: 2,
        name: "Smart Watch",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80",
        createdBy: "Admin",
        status: "Active",
    },
    {
        id: 3,
        name: "Headphones",
        image: "/images/product-headphone-main@2x.jpg",
        createdBy: "Admin",
        status: "Active",
    },
    {
        id: 4,
        name: "Backpack",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&auto=format&fit=crop&q=80",
        createdBy: "Admin",
        status: "Active",
    },
    {
        id: 5,
        name: "Shoes",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80",
        createdBy: "Admin",
        status: "Active",
    },
];

export default function ManageProducts() {
    const location = useLocation();
    const isShopOwner = location.pathname.includes("shop-owner") || location.pathname.includes("manager");
    const addProductLink = isShopOwner ? "/shop-owner/dashboard/product/add" : "/admin/dashboard/product/add";

    const [products, setProducts] = useState<ProductItem[]>(initialProducts);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id: number, name: string) => {
        setProducts(products.filter((p) => p.id !== id));
        message.success(`Deleted ${name}`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1b3a] tracking-tight">
                        Manage Products
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 font-normal">
                        View and manage all items currently available in the catalog
                    </p>
                </div>

                <Link
                    to={addProductLink}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4353ff] hover:bg-[#3234a8] text-white text-sm font-semibold shadow-md shadow-[#4353ff]/20 transition-all cursor-pointer w-fit"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                </Link>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                {/* Search Bar */}
                <div className="relative max-w-xs pb-5 border-b border-slate-100">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl placeholder-slate-400 text-slate-700 focus:outline-none focus:border-[#4353ff]"
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400">
                                <th className="py-3 px-2 w-12">#</th>
                                <th className="py-3 px-3">Product</th>
                                <th className="py-3 px-3">Created By</th>
                                <th className="py-3 px-3">Status</th>
                                <th className="py-3 px-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {filtered.map((item, index) => (
                                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="py-3.5 px-2 font-bold text-slate-500">
                                        {index + 1}
                                    </td>
                                    <td className="py-3.5 px-3">
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center p-1 shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-contain"
                                                    onError={(e: any) => {
                                                        e.target.src = "/images/product-headphone-main@2x.jpg";
                                                    }}
                                                />
                                            </div>
                                            <span className="font-bold text-slate-800">
                                                {item.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-3 font-medium text-slate-600">
                                        {item.createdBy}
                                    </td>
                                    <td className="py-3.5 px-3">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-3 text-right">
                                        <div className="inline-flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => message.info(`Editing ${item.name}`)}
                                                className="w-8 h-8 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                                                aria-label="Edit"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>

                                            <Popconfirm
                                                title="Delete product"
                                                description="Are you sure you want to delete this product?"
                                                onConfirm={() => handleDelete(item.id, item.name)}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <button
                                                    type="button"
                                                    className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                                                    aria-label="Delete"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </Popconfirm>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-end gap-1.5 pt-5 mt-4 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => setCurrentPage(1)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentPage === 1
                                ? "bg-[#4353ff] text-white shadow-sm"
                                : "text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        1
                    </button>
                    <button
                        type="button"
                        onClick={() => setCurrentPage(2)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentPage === 2
                                ? "bg-[#4353ff] text-white shadow-sm"
                                : "text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        2
                    </button>
                    <button
                        type="button"
                        onClick={() => setCurrentPage(2)}
                        className="w-8 h-8 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
}
