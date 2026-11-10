import { useState } from "react";
import { Store, Plus, Search, Trash2, ExternalLink } from "lucide-react";
import { Button, Modal, Form, Input, Select, message } from "antd";
import { Link } from "react-router-dom";
import Loading from "../../../Components/reuseable/loading/index.js";
import DeleteConfirmModal from "../../../Components/reuseable/delete-confirm-modal/index.js";
import {
    useGetAdminShopsQuery,
    useCreateAdminShopMutation,
    useDeleteAdminShopMutation,
    useGetAdminShopOwnersQuery,
    type IShop,
} from "../../../redux/features/ecommerce/index.js";

export default function ShopsManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [deletingShop, setDeletingShop] = useState<IShop | null>(null);
    const [form] = Form.useForm();

    const { data, isLoading } = useGetAdminShopsQuery({ search: searchTerm });
    const { data: ownersData } = useGetAdminShopOwnersQuery();
    const [createShop, { isLoading: isCreating }] = useCreateAdminShopMutation();
    const [deleteShop, { isLoading: isDeleting }] = useDeleteAdminShopMutation();

    const shops: IShop[] = data?.results || [];
    const owners = ownersData?.results || [];

    const handleCreateShop = async (values: any) => {
        try {
            await createShop({
                name: values.name,
                ownerId: values.ownerId,
                description: values.description,
                logo: values.logo,
                status: values.status || "active",
            }).unwrap();
            message.success("Shop created successfully!");
            setIsCreateOpen(false);
            form.resetFields();
        } catch (err: any) {
            message.error(err?.data?.message || "Failed to create shop.");
        }
    };

    const handleDeleteShop = async () => {
        if (!deletingShop) return;
        try {
            await deleteShop(deletingShop.id).unwrap();
            message.success("Shop deleted successfully!");
            setDeletingShop(null);
        } catch (err: any) {
            message.error(err?.data?.message || "Failed to delete shop.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1b3a] tracking-tight">
                        Shops Management
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 font-normal">
                        Manage registered multi-vendor shops, owners, and assigned products
                    </p>
                </div>
                <Button
                    type="primary"
                    onClick={() => setIsCreateOpen(true)}
                    className="!bg-primary hover:!bg-primary-hover !rounded-md !h-10 !px-4 !font-semibold !flex !items-center !gap-2 !border-none !text-white w-fit cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create Shop</span>
                </Button>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
                {/* Search Header */}
                <div className="flex items-center justify-between gap-4 pb-5 border-b border-slate-100">
                    <div className="relative w-full max-w-xs">
                        <Input
                            type="text"
                            prefix={<Search className="w-4 h-4 text-slate-400" />}
                            size="large"
                            placeholder="Search shops or owners..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="!rounded-md"
                        />
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                        Total Shops: {shops.length}
                    </span>
                </div>

                <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400">
                                <th className="py-3">Shop</th>
                                <th className="py-3">Owner</th>
                                <th className="py-3">Storefront Slug</th>
                                <th className="py-3 text-center">Listed Products</th>
                                <th className="py-3">Status</th>
                                <th className="py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center">
                                        <Loading title="Loading shops..." className="min-h-[180px]" />
                                    </td>
                                </tr>
                            ) : shops.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-slate-400">
                                        No shops found. Click "Create Shop" to add one.
                                    </td>
                                </tr>
                            ) : (
                                shops.map((shop) => (
                                    <tr key={shop.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                                                    {shop.logo ? (
                                                        <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Store className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-slate-800 block">{shop.name}</span>
                                                    <span className="text-xs text-slate-400 line-clamp-1">{shop.description || "No description"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className="text-slate-700 font-medium block">{shop.owner?.name || "Unassigned"}</span>
                                            <span className="text-xs text-slate-400">{shop.owner?.email}</span>
                                        </td>
                                        <td className="py-4">
                                            <Link
                                                to={`/store/${shop.slug}`}
                                                target="_blank"
                                                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                                            >
                                                <span>/store/{shop.slug}</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </Link>
                                        </td>
                                        <td className="py-4 text-center font-bold text-slate-700">
                                            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs">
                                                {shop.productsCount ?? 0}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${shop.status === "active"
                                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                                                : "bg-amber-50 text-amber-600 border border-amber-200/60"
                                                }`}>
                                                {shop.status === "active" ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setDeletingShop(shop)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                                    title="Delete shop"
                                                >
                                                    <Trash2 className="w-4 h-4" />
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

            {/* Create Shop Modal */}
            <Modal
                title={<span className="text-lg font-bold text-[#0c1b3a]">Create New Multi-Vendor Shop</span>}
                open={isCreateOpen}
                onCancel={() => setIsCreateOpen(false)}
                footer={null}
                centered
            >
                <Form form={form} layout="vertical" onFinish={handleCreateShop} className="mt-4">
                    <Form.Item name="name" label="Shop Name" rules={[{ required: true, message: "Shop name is required" }]}>
                        <Input placeholder="e.g. Apex Gadgets" className="rounded-xl py-2" />
                    </Form.Item>

                    <Form.Item name="ownerId" label="Assign Shop Owner" rules={[{ required: true, message: "Please select an owner" }]}>
                        <Select placeholder="Select a registered shop owner" className="rounded-xl">
                            {owners.map((owner) => (
                                <Select.Option key={owner.id} value={owner.id}>
                                    {owner.name} ({owner.email})
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="description" label="Shop Description">
                        <Input.TextArea rows={3} placeholder="Brief summary of what this shop sells..." className="rounded-xl" />
                    </Form.Item>

                    <Form.Item name="logo" label="Logo / Cover Image URL">
                        <Input placeholder="https://example.com/logo.jpg" className="rounded-xl py-2" />
                    </Form.Item>

                    <Form.Item name="status" label="Initial Status" initialValue="active">
                        <Select className="rounded-xl">
                            <Select.Option value="active">Active</Select.Option>
                            <Select.Option value="inactive">Inactive</Select.Option>
                        </Select>
                    </Form.Item>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button onClick={() => setIsCreateOpen(false)} className="rounded-xl h-10 px-4">
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" loading={isCreating} className="!bg-primary hover:!bg-primary-hover rounded-xl h-10 px-6 text-white font-semibold">
                            Create Shop
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Delete Confirm Modal */}
            <DeleteConfirmModal
                open={!!deletingShop}
                onCancel={() => setDeletingShop(null)}
                onConfirm={handleDeleteShop}
                loading={isDeleting}
                title="Delete Shop"
                description={
                    deletingShop ? (
                        <span>
                            Are you sure you want to delete <strong>{deletingShop.name}</strong>? This will permanently delete the shop and all its assigned product listings.
                        </span>
                    ) : null
                }
                itemPreview={
                    deletingShop
                        ? {
                              name: deletingShop.name,
                              thumbnail: deletingShop.logo,
                              subtitle: `/store/${deletingShop.slug}`,
                          }
                        : undefined
                }
                confirmText="Delete Shop"
            />
        </div>
    );
}
