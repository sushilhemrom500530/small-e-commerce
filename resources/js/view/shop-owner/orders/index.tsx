import { useState } from "react";
import { Search, ShoppingBag, Eye, CheckCircle2, User, Phone, MapPin, Mail, Calendar } from "lucide-react";
import { message, Select, Button, Modal } from "antd";
import {
    useGetShopOrdersQuery,
    useUpdateOrderStatusMutation,
    type IOrder,
} from "../../../redux/features/ecommerce/index.js";
import Loading from "../../../Components/reuseable/loading/index.js";
import ResponsiveModal from "../../../Components/reuseable/responsive-modal/index.js";

export default function ShopOrdersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

    const { data, isLoading } = useGetShopOrdersQuery({
        search: searchTerm || undefined,
        status: statusFilter,
    });
    const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

    const orders: IOrder[] = data?.results || [];

    const handleMarkDelivered = async (order: IOrder) => {
        try {
            await updateOrderStatus({
                id: order.id,
                status: "Delivered",
            }).unwrap();
            message.success(`Order ${order.orderNumber || order.orderId} marked as Delivered!`);
        } catch (err: any) {
            message.error(err?.data?.message || "Failed to update order status.");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1b3a] tracking-tight">
                    Shop Orders
                </h1>
                <p className="mt-1 text-sm text-slate-500 font-normal">
                    Track customer purchases, fulfillment, and shipment statuses directly from database
                </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                {/* Search & Status Filter Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-72">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search order ID or customer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3.5 py-2 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl placeholder-slate-400 text-slate-700 focus:outline-none focus:border-primary"
                            />
                        </div>
                        <Select
                            placeholder="All Statuses"
                            allowClear
                            value={statusFilter}
                            onChange={(val) => setStatusFilter(val)}
                            className="w-36 !rounded-xl"
                            options={[
                                { label: "Pending", value: "Pending" },
                                { label: "Processing", value: "Processing" },
                                { label: "Delivered", value: "Delivered" },
                                { label: "Cancelled", value: "Cancelled" },
                            ]}
                        />
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                        Total Orders: {orders.length}
                    </span>
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
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center">
                                        <Loading title="Loading shop orders from database..." className="min-h-[180px]" />
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-400">
                                        No orders found for this shop.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-4 px-3 font-bold text-slate-800">
                                            {order.orderNumber || order.orderId}
                                        </td>
                                        <td className="py-4 px-3">
                                            <span className="font-semibold text-slate-700 block">
                                                {order.customerName || order.customer}
                                            </span>
                                            {order.customerPhone && (
                                                <span className="text-xs text-slate-400 block">
                                                    {order.customerPhone}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-3 text-slate-500 text-xs">
                                            {order.date}
                                        </td>
                                        <td className="py-4 px-3 font-medium text-slate-600">
                                            {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}
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
                                                        : order.status === "Cancelled"
                                                        ? "bg-rose-50 text-rose-600 border-rose-200/60"
                                                        : "bg-emerald-50 text-emerald-600 border-emerald-200/60"
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-3 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {order.status !== "Delivered" && (
                                                    <Button
                                                        type="text"
                                                        loading={isUpdating}
                                                        onClick={() => handleMarkDelivered(order)}
                                                        className="!inline-flex !items-center !gap-1.5 !px-3 !py-1 !h-8 !rounded-lg !bg-emerald-50 !text-emerald-700 hover:!bg-emerald-100 !font-semibold !text-xs !border-none cursor-pointer"
                                                    >
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        <span>Mark Delivered</span>
                                                    </Button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                                    aria-label="View Order Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <ResponsiveModal
                    open={!!selectedOrder}
                    onCancel={() => setSelectedOrder(null)}
                    title={`Order Details: ${selectedOrder.orderNumber || selectedOrder.orderId}`}
                    subtitle={`Placed on ${selectedOrder.date}`}
                    width="min(560px, 95vw)"
                    footer={
                        <>
                            {selectedOrder.status !== "Delivered" && (
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        handleMarkDelivered(selectedOrder);
                                        setSelectedOrder({ ...selectedOrder, status: "Delivered" });
                                    }}
                                    className="!bg-emerald-600 hover:!bg-emerald-700 rounded-xl h-10 px-5 text-white font-semibold"
                                >
                                    Mark as Delivered
                                </Button>
                            )}
                            <Button
                                onClick={() => setSelectedOrder(null)}
                                className="rounded-xl h-10 px-5 font-medium text-slate-600"
                            >
                                Close
                            </Button>
                        </>
                    }
                >
                    <div className="space-y-4 py-1 text-sm text-slate-700">
                        {/* Order Summary Header */}
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                            <div>
                                <span className="text-xs text-slate-400 block font-medium">Order Total</span>
                                <span className="text-xl font-black text-slate-900">{selectedOrder.total}</span>
                            </div>
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                                    selectedOrder.status === "Pending"
                                        ? "bg-amber-50 text-amber-600 border-amber-200"
                                        : selectedOrder.status === "Processing"
                                        ? "bg-blue-50 text-blue-600 border-blue-200"
                                        : selectedOrder.status === "Cancelled"
                                        ? "bg-rose-50 text-rose-600 border-rose-200"
                                        : "bg-emerald-50 text-emerald-600 border-emerald-200"
                                }`}
                            >
                                {selectedOrder.status}
                            </span>
                        </div>

                        {/* Customer Information */}
                        <div className="space-y-2 border-t border-slate-100 pt-3">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Customer Details
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 text-slate-700">
                                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span className="font-semibold">{selectedOrder.customerName || selectedOrder.customer}</span>
                                </div>
                                {selectedOrder.customerEmail && (
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                                        <span>{selectedOrder.customerEmail}</span>
                                    </div>
                                )}
                                {selectedOrder.customerPhone && (
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                                        <span>{selectedOrder.customerPhone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span>Date: {selectedOrder.date}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        {selectedOrder.shippingAddress && (
                            <div className="space-y-1.5 border-t border-slate-100 pt-3">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" /> Shipping Address
                                </h4>
                                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs leading-relaxed">
                                    {selectedOrder.shippingAddress}
                                </p>
                            </div>
                        )}
                    </div>
                </ResponsiveModal>
            )}
        </div>
    );
}
