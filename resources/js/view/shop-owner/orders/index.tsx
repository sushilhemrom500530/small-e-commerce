import { useState } from "react";
import { Search, ShoppingBag, Eye, CheckCircle2 } from "lucide-react";
import { message } from "antd";

interface Order {
    id: string;
    customer: string;
    date: string;
    itemsCount: number;
    total: string;
    status: "Pending" | "Delivered" | "Processing" | "Cancelled";
}

const initialOrders: Order[] = [
    { id: "#ORD-1001", customer: "Alex Johnson", date: "Jul 07, 2026", itemsCount: 2, total: "$120.00", status: "Pending" },
    { id: "#ORD-1002", customer: "Jessica Miller", date: "Jul 06, 2026", itemsCount: 1, total: "$85.00", status: "Delivered" },
    { id: "#ORD-1003", customer: "Daniel Brown", date: "Jul 05, 2026", itemsCount: 3, total: "$200.00", status: "Delivered" },
    { id: "#ORD-1004", customer: "Sophia Taylor", date: "Jul 04, 2026", itemsCount: 1, total: "$99.00", status: "Processing" },
    { id: "#ORD-1005", customer: "David Wilson", date: "Jul 03, 2026", itemsCount: 4, total: "$340.00", status: "Delivered" },
];

export default function ShopOrdersPage() {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = orders.filter(
        (o) =>
            o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleMarkDelivered = (id: string) => {
        setOrders(
            orders.map((o) => (o.id === id ? { ...o, status: "Delivered" } : o))
        );
        message.success(`Order ${id} marked as Delivered!`);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1b3a] tracking-tight">
                    Shop Orders
                </h1>
                <p className="mt-1 text-sm text-slate-500 font-normal">
                    Track customer purchases, fulfillment, and shipment statuses
                </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                <div className="relative max-w-xs pb-5 border-b border-slate-100">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search order ID or customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl placeholder-slate-400 text-slate-700 focus:outline-none focus:border-[#4353ff]"
                    />
                </div>

                <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400">
                                <th className="py-3 px-3">Order ID</th>
                                <th className="py-3 px-3">Customer</th>
                                <th className="py-3 px-3">Date</th>
                                <th className="py-3 px-3">Items</th>
                                <th className="py-3 px-3">Total</th>
                                <th className="py-3 px-3">Status</th>
                                <th className="py-3 px-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {filtered.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="py-4 px-3 font-bold text-slate-800">
                                        {order.id}
                                    </td>
                                    <td className="py-4 px-3 font-semibold text-slate-700">
                                        {order.customer}
                                    </td>
                                    <td className="py-4 px-3 text-slate-500">
                                        {order.date}
                                    </td>
                                    <td className="py-4 px-3 font-medium text-slate-600">
                                        {order.itemsCount} items
                                    </td>
                                    <td className="py-4 px-3 font-black text-slate-900">
                                        {order.total}
                                    </td>
                                    <td className="py-4 px-3">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                                order.status === "Pending"
                                                    ? "bg-amber-50 text-amber-600 border-amber-200/60"
                                                    : order.status === "Processing"
                                                    ? "bg-blue-50 text-blue-600 border-blue-200/60"
                                                    : "bg-emerald-50 text-emerald-600 border-emerald-200/60"
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-3 text-right">
                                        {order.status !== "Delivered" && (
                                            <button
                                                type="button"
                                                onClick={() => handleMarkDelivered(order.id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs transition-colors cursor-pointer mr-2"
                                            >
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span>Mark Delivered</span>
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => message.info(`Viewing details of ${order.id}`)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                            aria-label="View"
                                        >
                                            <Eye className="w-4 h-4" />
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
