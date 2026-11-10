import { useState } from "react";
import { Plus, Search, Edit3, Trash2, Package, Check, Tag } from "lucide-react";
import { Button, Modal, Form, Input, InputNumber, Switch, message, Popconfirm, Select } from "antd";
import { Link } from "react-router-dom";
import {
    useGetMyShopProductsQuery,
    useCreateShopProductMutation,
    useUpdateShopProductMutation,
    useDeleteShopProductMutation,
    useGetCategoriesQuery,
    type IShopProduct,
} from "../../../redux/features/ecommerce/index.js";

export default function ShopOwnerProductsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [editingProduct, setEditingProduct] = useState<IShopProduct | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [createForm] = Form.useForm();

    const { data, isLoading } = useGetMyShopProductsQuery({ search: searchTerm });
    const { data: catData } = useGetCategoriesQuery();

    const [updateShopProduct, { isLoading: isUpdating }] = useUpdateShopProductMutation();
    const [createShopProduct, { isLoading: isCreating }] = useCreateShopProductMutation();
    const [deleteShopProduct] = useDeleteShopProductMutation();

    const products: IShopProduct[] = data?.results || [];
    const categories = catData?.results || [];

    const handleOpenEdit = (sp: IShopProduct) => {
        setEditingProduct(sp);
        form.setFieldsValue({
            name: sp.name,
            categoryId: sp.category?.id,
            price: sp.price,
            details: sp.details,
            thumbnail: sp.thumbnail,
            isActive: sp.isActive,
        });
    };

    const handleSaveEdit = async (values: any) => {
        if (!editingProduct) return;
        try {
            await updateShopProduct({
                id: editingProduct.id,
                body: {
                    name: values.name,
                    categoryId: values.categoryId,
                    price: values.price,
                    details: values.details,
                    thumbnail: values.thumbnail,
                    isActive: values.isActive,
                },
            }).unwrap();
            message.success("Product name, pricing, and details updated successfully!");
            setEditingProduct(null);
            form.resetFields();
        } catch (err: any) {
            message.error(err?.data?.message || "Failed to update listing.");
        }
    };

    const handleCreateCustomProduct = async (values: any) => {
        try {
            await createShopProduct(values).unwrap();
            message.success("New product created in shared catalog and listed in your shop!");
            setIsCreateModalOpen(false);
            createForm.resetFields();
        } catch (err: any) {
            message.error(err?.data?.message || "Failed to create product.");
        }
    };

    const handleRemoveFromShop = async (id: number) => {
        try {
            await deleteShopProduct(id).unwrap();
            message.success("Product removed from your shop.");
        } catch (err: any) {
            message.error(err?.data?.message || "Failed to remove product.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1b3a] tracking-tight">
                        My Shop Products
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 font-normal">
                        Manage products currently listed in your shop, customize prices, details, and thumbnails
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/shop-owner/dashboard/catalog">
                        <Button className="!rounded-xl !h-10 !px-4 !font-semibold">
                            Browse Shared Catalog
                        </Button>
                    </Link>
                    <Button
                        type="primary"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="!bg-primary hover:!bg-primary-hover !rounded-xl !h-10 !px-4 !font-semibold !flex !items-center !gap-2 !border-none !text-white"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create Own Product</span>
                    </Button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                {/* Search Bar */}
                <div className="flex items-center justify-between gap-4 pb-5 border-b border-slate-100">
                    <div className="relative w-full max-w-xs">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search listed products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl placeholder-slate-400 text-slate-700 focus:outline-none focus:border-primary"
                        />
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                        Listed in Shop: {products.length}
                    </span>
                </div>

                <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400">
                                <th className="py-3">Product</th>
                                <th className="py-3">Category</th>
                                <th className="py-3">Your Selling Price</th>
                                <th className="py-3">Custom Override</th>
                                <th className="py-3">Status</th>
                                <th className="py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-slate-400">
                                        Loading your shop products...
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-slate-400">
                                        No products listed yet. Click "Browse Shared Catalog" to add some!
                                    </td>
                                </tr>
                            ) : (
                                products.map((sp) => (
                                    <tr key={sp.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                                                    {sp.effectiveThumbnail ? (
                                                        <img src={sp.effectiveThumbnail} alt={sp.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-5 h-5 text-slate-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-slate-800 block">{sp.name}</span>
                                                    <span className="text-xs text-slate-400 line-clamp-1 max-w-sm">
                                                        {sp.effectiveDetails}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 font-medium text-xs">
                                                {sp.category?.name || "General"}
                                            </span>
                                        </td>
                                        <td className="py-4 font-bold text-slate-800 text-base">
                                            ৳{Number(sp.price).toLocaleString()}
                                        </td>
                                        <td className="py-4">
                                            <div className="flex flex-col gap-1 text-xs text-slate-400">
                                                {sp.thumbnail && <span className="text-primary font-medium">✓ Custom Thumbnail</span>}
                                                {sp.details && <span className="text-indigo-500 font-medium">✓ Custom Details</span>}
                                                {!sp.thumbnail && !sp.details && <span>Catalog Defaults</span>}
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${sp.isActive
                                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                                                : "bg-slate-100 text-slate-500"
                                                }`}>
                                                {sp.isActive ? "Live in Store" : "Hidden"}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleOpenEdit(sp)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-blue-50 transition-colors cursor-pointer"
                                                    title="Edit Price & Details"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <Popconfirm
                                                    title="Remove from your shop?"
                                                    description="This removes it from your shop's customer listings. It will remain in the shared catalog."
                                                    onConfirm={() => handleRemoveFromShop(sp.id)}
                                                    okText="Yes, Remove"
                                                    okButtonProps={{ danger: true }}
                                                >
                                                    <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </Popconfirm>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Shop Product Modal */}
            <Modal
                title={
                    <div className="pr-6">
                        <span className="text-lg font-bold text-[#0c1b3a] block">
                            Customize Product in Your Shop
                        </span>
                        <span className="text-xs text-slate-500 font-medium truncate block max-w-md">
                            {editingProduct?.name}
                        </span>
                    </div>
                }
                open={!!editingProduct}
                onCancel={() => setEditingProduct(null)}
                footer={null}
                centered
                width="min(680px, 95vw)"
                style={{ top: "3vh", maxHeight: "90vh" }}
                styles={{
                    content: {
                        maxHeight: "90vh",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "1rem",
                        padding: "1.25rem 1.5rem",
                    },
                    body: {
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        maxHeight: "calc(90vh - 85px)",
                    },
                }}
            >
                <div className="flex flex-col h-full max-h-[calc(90vh-95px)] min-h-0">
                    <p className="text-xs text-slate-500 mb-3 shrink-0">
                        Changes made here apply only to your shop's listing. The shared global product remains unaffected.
                    </p>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSaveEdit}
                        className="flex flex-col flex-1 min-h-0 overflow-hidden"
                    >
                        <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-1">
                            <Form.Item
                                name="name"
                                label={<span className="text-xs sm:text-sm font-semibold text-slate-700">Product Name</span>}
                                rules={[{ required: true, message: "Product name is required" }]}
                            >
                                <Input placeholder="Enter product name..." className="rounded-xl py-2 font-medium text-slate-800" />
                            </Form.Item>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <Form.Item
                                    name="categoryId"
                                    label={<span className="text-xs sm:text-sm font-semibold text-slate-700">Category</span>}
                                >
                                    <Select placeholder="Select a category" className="rounded-xl !h-10" allowClear>
                                        {categories.map((c) => (
                                            <Select.Option key={c.id} value={c.id}>
                                                {c.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="price"
                                    label={<span className="text-xs sm:text-sm font-semibold text-slate-700">Your Selling Price (৳ BDT)</span>}
                                    rules={[{ required: true, message: "Price is required" }]}
                                >
                                    <InputNumber min={0} className="w-full rounded-xl py-1 text-base font-bold text-slate-800" />
                                </Form.Item>
                            </div>

                            <Form.Item
                                name="details"
                                label={<span className="text-xs sm:text-sm font-semibold text-slate-700">Shop-Specific Custom Details / Promotion Note</span>}
                            >
                                <Input.TextArea
                                    rows={3}
                                    placeholder="Customize your description or warranty notes..."
                                    className="rounded-xl text-sm"
                                />
                            </Form.Item>

                            <Form.Item
                                name="thumbnail"
                                label={<span className="text-xs sm:text-sm font-semibold text-slate-700">Shop-Specific Custom Thumbnail URL</span>}
                            >
                                <Input placeholder="Leave blank to use global catalog thumbnail" className="rounded-xl py-2 text-sm" />
                            </Form.Item>

                            <Form.Item
                                name="isActive"
                                label={<span className="text-xs sm:text-sm font-semibold text-slate-700">Visibility Status in Store</span>}
                                valuePropName="checked"
                            >
                                <Switch checkedChildren="Live" unCheckedChildren="Hidden" />
                            </Form.Item>
                        </div>

                        {/* Pinned Action Buttons */}
                        <div className="sticky bottom-0 bg-white pt-3 pb-1 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 mt-3 z-10">
                            <Button onClick={() => setEditingProduct(null)} className="rounded-xl h-10 px-5 font-medium text-slate-600 hover:text-slate-800">
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isUpdating}
                                className="!bg-primary hover:!bg-primary-hover rounded-xl h-10 px-6 text-white font-semibold shadow-xs"
                            >
                                Save Listing
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal>

            {/* Create Own Product Modal */}
            <Modal
                title={<span className="text-lg font-bold text-[#0c1b3a]">Create New Product (Enters Shared Catalog + Your Shop)</span>}
                open={isCreateModalOpen}
                onCancel={() => setIsCreateModalOpen(false)}
                footer={null}
                centered
                width="min(680px, 95vw)"
                style={{ top: "3vh", maxHeight: "90vh" }}
                styles={{
                    content: {
                        maxHeight: "90vh",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "1rem",
                        padding: "1.25rem 1.5rem",
                    },
                    body: {
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        maxHeight: "calc(90vh - 85px)",
                    },
                }}
            >
                <div className="flex flex-col h-full max-h-[calc(90vh-95px)] min-h-0">
                    <p className="text-xs text-slate-500 mb-3 shrink-0">
                        Products created by you will become available in the Shared Catalog for other shop owners, and automatically listed in your shop!
                    </p>
                    <Form
                        form={createForm}
                        layout="vertical"
                        onFinish={handleCreateCustomProduct}
                        className="flex flex-col flex-1 min-h-0 overflow-hidden"
                    >
                        <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-1">
                            <Form.Item
                                name="name"
                                label={<span className="text-xs sm:text-sm font-semibold text-slate-700">Product Name</span>}
                                rules={[{ required: true, message: "Name is required" }]}
                            >
                                <Input placeholder="e.g. Handmade Leather Wallet" className="rounded-xl py-2 font-medium text-slate-800" />
                            </Form.Item>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <Form.Item
                                    name="categoryId"
                                    label={<span className="text-xs sm:text-sm font-semibold text-slate-700">Category</span>}
                                >
                                    <Select placeholder="Select a category" className="rounded-xl !h-10" allowClear>
                                        {categories.map((c) => (
                                            <Select.Option key={c.id} value={c.id}>
                                                {c.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="price"
                                    label={<span className="text-xs sm:text-sm font-semibold text-slate-700">Your Shop Selling Price (৳ BDT)</span>}
                                    rules={[{ required: true, message: "Price is required" }]}
                                >
                                    <InputNumber min={0} placeholder="e.g. 2500" className="w-full rounded-xl py-1 text-base font-bold text-slate-800" />
                                </Form.Item>
                            </div>

                            <Form.Item
                                name="description"
                                label={<span className="text-xs sm:text-sm font-semibold text-slate-700">Catalog Master Description</span>}
                            >
                                <Input.TextArea rows={3} placeholder="Full product description..." className="rounded-xl text-sm" />
                            </Form.Item>

                            <Form.Item
                                name="thumbnail"
                                label={<span className="text-xs sm:text-sm font-semibold text-slate-700">Product Thumbnail URL</span>}
                            >
                                <Input placeholder="https://example.com/image.jpg" className="rounded-xl py-2 text-sm" />
                            </Form.Item>
                        </div>

                        {/* Pinned Action Buttons */}
                        <div className="sticky bottom-0 bg-white pt-3 pb-1 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 mt-3 z-10">
                            <Button onClick={() => setIsCreateModalOpen(false)} className="rounded-xl h-10 px-5 font-medium text-slate-600 hover:text-slate-800">
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isCreating}
                                className="!bg-primary hover:!bg-primary-hover rounded-xl h-10 px-6 text-white font-semibold shadow-xs"
                            >
                                Create & List Product
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal>
        </div>
    );
}

