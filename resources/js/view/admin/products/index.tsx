import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Package } from "lucide-react";
import { Button, Modal, Form, Input, Select, message } from "antd";
import {
    useGetAdminProductsQuery,
    useCreateAdminProductMutation,
    useUpdateAdminProductMutation,
    useDeleteAdminProductMutation,
    useGetCategoriesQuery,
    type ICatalogProduct,
} from "../../../redux/features/ecommerce/index.js";
import DeleteConfirmModal from "../../../Components/reuseable/delete-confirm-modal/index.js";

export default function ManageProducts() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ICatalogProduct | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<ICatalogProduct | null>(null);
    const [form] = Form.useForm();

    const { data, isLoading } = useGetAdminProductsQuery({
        search: searchTerm,
        categoryId: selectedCategory,
    });
    const { data: catData } = useGetCategoriesQuery();

    const [createProduct, { isLoading: isCreating }] = useCreateAdminProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateAdminProductMutation();
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteAdminProductMutation();

    const products: ICatalogProduct[] = data?.results || [];
    const categories = catData?.results || [];

    const handleOpenCreate = () => {
        setEditingProduct(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleOpenEdit = (product: ICatalogProduct) => {
        setEditingProduct(product);
        form.setFieldsValue({
            name: product.name,
            categoryId: product.categoryId,
            description: product.description,
            thumbnail: product.thumbnail,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (values: any) => {
        try {
            if (editingProduct) {
                await updateProduct({ id: editingProduct.id, body: values }).unwrap();
                message.success("Product updated successfully!");
            } else {
                await createProduct(values).unwrap();
                message.success("Product added to shared catalog successfully!");
            }
            setIsModalOpen(false);
            form.resetFields();
        } catch (err: any) {
            message.error(err?.data?.message || "Operation failed.");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteProduct(id).unwrap();
            message.success("Product removed from catalog successfully!");
        } catch (err: any) {
            message.error(err?.data?.message || "Failed to delete product.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1b3a] tracking-tight">
                        Shared Product Catalog
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 font-normal">
                        Global master catalog available for all shop owners to list in their stores
                    </p>
                </div>
                <Button
                    type="primary"
                    onClick={handleOpenCreate}
                    className="!bg-primary hover:!bg-primary-hover !rounded-xl !h-10 !px-4 !font-semibold !flex !items-center !gap-2 !border-none !text-white w-fit cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add to Catalog</span>
                </Button>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                {/* Search & Filter Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative w-full sm:w-72">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search shared catalog..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3.5 py-2 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl placeholder-slate-400 text-slate-700 focus:outline-none focus:border-primary"
                            />
                        </div>
                        <Select
                            placeholder="All Categories"
                            allowClear
                            onChange={(val) => setSelectedCategory(val)}
                            className="w-48 !rounded-xl"
                        >
                            {categories.map((c) => (
                                <Select.Option key={c.id} value={c.id}>
                                    {c.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                        Total Catalog Items: {products.length}
                    </span>
                </div>

                <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400">
                                <th className="py-3">Product</th>
                                <th className="py-3">Category</th>
                                <th className="py-3">Created By</th>
                                <th className="py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="py-10 text-center text-slate-400">
                                        Loading shared catalog...
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-10 text-center text-slate-400">
                                        No products in the catalog yet.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                                                    {product.thumbnail ? (
                                                        <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-slate-800 block">{product.name}</span>
                                                    <span className="text-xs text-slate-400 line-clamp-1 max-w-md">{product.description || "No description"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-blue-50 text-primary font-semibold text-xs border border-blue-100">
                                                {product.categoryName || "Uncategorized"}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <span className="text-slate-700 font-medium block">{product.creatorName || "Admin"}</span>
                                            <span className="text-xs text-slate-400 capitalize">{product.creatorRole || "admin"}</span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleOpenEdit(product)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-blue-50 transition-colors cursor-pointer"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingProduct(product)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                                    title="Remove from shared catalog"
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

            {/* Create/Edit Product Modal */}
            <Modal
                title={
                    <span className="text-lg font-bold text-[#0c1b3a]">
                        {editingProduct ? "Edit Catalog Product" : "Add Product to Shared Catalog"}
                    </span>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                centered
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
                    <Form.Item name="name" label="Product Name" rules={[{ required: true, message: "Product name is required" }]}>
                        <Input placeholder="e.g. Samsung Galaxy A56" className="rounded-xl py-2" />
                    </Form.Item>

                    <Form.Item name="categoryId" label="Category">
                        <Select placeholder="Select a category" className="rounded-xl">
                            {categories.map((c) => (
                                <Select.Option key={c.id} value={c.id}>
                                    {c.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="description" label="Global Master Description">
                        <Input.TextArea rows={3} placeholder="Comprehensive description for the shared catalog..." className="rounded-xl" />
                    </Form.Item>

                    <Form.Item name="thumbnail" label="Master Thumbnail URL">
                        <Input placeholder="https://example.com/image.jpg" className="rounded-xl py-2" />
                    </Form.Item>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button onClick={() => setIsModalOpen(false)} className="rounded-xl h-10 px-4">
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isCreating || isUpdating}
                            className="!bg-primary hover:!bg-primary-hover rounded-xl h-10 px-6 text-white font-semibold"
                        >
                            {editingProduct ? "Save Changes" : "Add to Catalog"}
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Reusable Delete Confirmation Modal */}
            <DeleteConfirmModal
                open={!!deletingProduct}
                onCancel={() => setDeletingProduct(null)}
                onConfirm={async () => {
                    if (!deletingProduct) return;
                    await handleDelete(deletingProduct.id);
                    setDeletingProduct(null);
                }}
                loading={isDeleting}
                title="Delete from Catalog?"
                description={
                    <>
                        Are you sure you want to delete <strong className="text-slate-800">"{deletingProduct?.name}"</strong> from the shared catalog?
                    </>
                }
                itemPreview={deletingProduct ? {
                    name: deletingProduct.name,
                    thumbnail: deletingProduct.thumbnail,
                    subtitle: deletingProduct.categoryName || "Catalog Product"
                } : undefined}
                note="This permanently removes the master product from the global catalog and all shops that have added it."
                confirmText="Yes, Delete"
            />
        </div>
    );
}
