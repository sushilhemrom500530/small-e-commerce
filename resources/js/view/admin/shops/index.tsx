import { useState } from "react";
import { Store, Plus, Search, CheckCircle2, MoreVertical } from "lucide-react";
import { Button, Tag } from "antd";

interface Shop {
    id: number;
    name: string;
    owner: string;
    category: string;
    productsCount: number;
    status: "Active" | "Pending" | "Inactive";
}

const initialShops: Shop[] = [
    { id: 1, name: "Tech World", owner: "John Doe", category: "Electronics", productsCount: 42, status: "Active" },
    { id: 2, name: "Fashion Hub", owner: "Sarah Khan", category: "Clothing", productsCount: 38, status: "Active" },
    { id: 3, name: "Gadget Store", owner: "Mike Ross", category: "Accessories", productsCount: 25, status: "Active" },
    { id: 4, name: "Electro Plus", owner: "Emma Watson", category: "Appliances", productsCount: 15, status: "Active" },
    { id: 5, name: "Beauty Care", owner: "Lisa Ray", category: "Cosmetics", productsCount: 20, status: "Active" },
];

export default function ShopsManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [shops] = useState<Shop[]>(initialShops);

    const filteredShops = shops.filter(
        (s) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.owner.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1b3a] tracking-tight">
                        Shops Management
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 font-normal">
                        Manage registered multi-vendor shops and approval statuses
                    </p>
                </div>
                <Button
                    type="primary"
                    className="!bg-[#4353ff] hover:!bg-[#3234a8] !rounded-xl !h-10 !px-4 !font-semibold !flex !items-center !gap-2 !border-none !text-white w-fit cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create Shop</span>
                </Button>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                {/* Search Header */}
                <div className="flex items-center justify-between gap-4 pb-5 border-b border-slate-100">
                    <div className="relative w-full max-w-xs">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search shops or owners..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl placeholder-slate-400 text-slate-700 focus:outline-none focus:border-[#4353ff]"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400">
                                <th className="py-3">Shop</th>
                                <th className="py-3">Owner</th>
                                <th className="py-3">Category</th>
                                <th className="py-3">Products</th>
                                <th className="py-3">Status</th>
                                <th className="py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {filteredShops.map((shop) => (
                                <tr key={shop.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                                                <Store className="w-4 h-4" />
                                            </div>
                                            <span className="font-semibold text-slate-800">{shop.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-slate-600 font-medium">{shop.owner}</td>
                                    <td className="py-4 text-slate-500">{shop.category}</td>
                                    <td className="py-4 font-semibold text-slate-700">{shop.productsCount}</td>
                                    <td className="py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                                            {shop.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

