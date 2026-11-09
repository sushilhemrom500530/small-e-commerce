import { useState } from "react";
import { Users, Plus, Search, Mail, Phone, MoreVertical } from "lucide-react";
import { Button } from "antd";

interface ShopOwner {
    id: number;
    name: string;
    email: string;
    phone: string;
    shopName: string;
    joinedDate: string;
    status: "Active" | "Pending";
}

const initialOwners: ShopOwner[] = [
    { id: 1, name: "John Doe", email: "john@techworld.com", phone: "+1 234 567 890", shopName: "Tech World", joinedDate: "Jan 12, 2026", status: "Active" },
    { id: 2, name: "Sarah Khan", email: "sarah@fashionhub.com", phone: "+1 234 567 891", shopName: "Fashion Hub", joinedDate: "Feb 05, 2026", status: "Active" },
    { id: 3, name: "Mike Ross", email: "mike@gadgetstore.com", phone: "+1 234 567 892", shopName: "Gadget Store", joinedDate: "Mar 18, 2026", status: "Active" },
    { id: 4, name: "Emma Watson", email: "emma@electroplus.com", phone: "+1 234 567 893", shopName: "Electro Plus", joinedDate: "Apr 22, 2026", status: "Active" },
    { id: 5, name: "Lisa Ray", email: "lisa@beautycare.com", phone: "+1 234 567 894", shopName: "Beauty Care", joinedDate: "May 10, 2026", status: "Active" },
];

export default function ShopOwnersManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [owners] = useState<ShopOwner[]>(initialOwners);

    const filtered = owners.filter(
        (o) =>
            o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.shopName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1b3a] tracking-tight">
                        Shop Owners
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 font-normal">
                        Manage shop owners, permissions, and vendor accounts
                    </p>
                </div>
                <Button
                    type="primary"
                    className="!bg-[#4353ff] hover:!bg-[#3234a8] !rounded-xl !h-10 !px-4 !font-semibold !flex !items-center !gap-2 !border-none !text-white w-fit cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Shop Owner</span>
                </Button>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                <div className="relative w-full max-w-xs pb-5 border-b border-slate-100">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search owners or shops..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl placeholder-slate-400 text-slate-700 focus:outline-none focus:border-[#4353ff]"
                    />
                </div>

                <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400">
                                <th className="py-3">Owner</th>
                                <th className="py-3">Contact</th>
                                <th className="py-3">Assigned Shop</th>
                                <th className="py-3">Joined Date</th>
                                <th className="py-3">Status</th>
                                <th className="py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {filtered.map((owner) => (
                                <tr key={owner.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="py-4 font-semibold text-slate-800">{owner.name}</td>
                                    <td className="py-4 text-slate-500 text-xs space-y-0.5">
                                        <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" />{owner.email}</div>
                                        <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" />{owner.phone}</div>
                                    </td>
                                    <td className="py-4 font-medium text-slate-700">{owner.shopName}</td>
                                    <td className="py-4 text-slate-500">{owner.joinedDate}</td>
                                    <td className="py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                                            {owner.status}
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
