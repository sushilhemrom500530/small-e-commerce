import { useState } from "react";
import { Plus, Search, Edit3, Trash2, Package } from "lucide-react";
import { Button, message } from "antd";
import { Link } from "react-router-dom";
import {
    useGetMyShopProductsQuery,
    useCreateShopProductMutation,
    useUpdateShopProductMutation,
    useDeleteShopProductMutation,
    useGetCategoriesQuery,
    type IShopProduct,
} from "../../../redux/features/ecommerce/index.js";
import ProductModal from "../../../Components/reuseable/product-modal/index.js";
import DeleteConfirmModal from "../../../Components/reuseable/delete-confirm-modal/index.js";

export default function ShopOwnerProductsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [editingProduct, setEditingProduct] = useState<IShopProduct | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<IShopProduct | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, isLoading } = useGetMyShopProductsQuery({ search: searchTerm });
    const { data: catData } = useGetCategoriesQuery();

    const [createShopProduct, { isLoading: isCreating }] = useCreateShopProductMutation();
    const [updateShopProduct, { isLoading: isUpdating }] = useUpdateShopProductMutation();
    const [deleteShopProduct, { isLoading: isDeleting }] = useDeleteShopProductMutation();

    const products: IShopProduct[] = data?.results || [];
    const categories = catData?.results || [];

    const handleCreateProduct = async (values: any) => {
        try {
            await createShopProduct(values).unwrap();
            message.success("New product created in shared catalog and listed in your shop!");
            setIsCreateModalOpen(false);
        } catch (err: any) {
            message.error(err?.data?.message || "Failed to create product.");
        }
    };

    const handleUpdateProduct = async (values: any) => {
        if (!editingProduct) return;
        try {
            await updateShopProduct({
                id: editingProduct.id,
                body: values,
            }).unwrap();
            message.success("Product name, pricing, and details updated successfully!");
            setEditingProduct(null);
        } catch (err: any) {
            message.error(err?.data?.message || "Failed to update listing.");
        }
    };

    const handleConfirmDelete = async () => {
        if (!deletingProduct) return;
        try {
            await deleteShopProduct(deletingProduct.id).unwrap();
            message.success("Product removed from your shop.");
            setDeletingProduct(null);
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
                                                    onClick={() => setEditingProduct(sp)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-blue-50 transition-colors cursor-pointer"
                                                    title="Edit Price & Details"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingProduct(sp)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                                    title="Remove from your shop"
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

            {/* Reusable ProductModal for Customizing / Editing */}
            <ProductModal
                open={!!editingProduct}
                role="shop_owner"
                mode="customize"
                initialData={editingProduct ? {
                    name: editingProduct.name,
                    categoryId: editingProduct.category?.id,
                    price: editingProduct.price,
                    details: editingProduct.details,
                    thumbnail: editingProduct.thumbnail,
                    isActive: editingProduct.isActive,
                } : null}
                categories={categories}
                loading={isUpdating}
                onCancel={() => setEditingProduct(null)}
                onSubmit={handleUpdateProduct}
            />

            {/* Reusable ProductModal for Creating Own Product */}
            <ProductModal
                open={isCreateModalOpen}
                role="shop_owner"
                mode="create"
                categories={categories}
                loading={isCreating}
                onCancel={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateProduct}
            />

            {/* Reusable Delete Confirmation Modal */}
            <DeleteConfirmModal
                open={!!deletingProduct}
                onCancel={() => setDeletingProduct(null)}
                onConfirm={handleConfirmDelete}
                loading={isDeleting}
                title="Remove from Your Shop?"
                description={
                    <>
                        Are you sure you want to remove <strong className="text-slate-800">"{deletingProduct?.name}"</strong> from your shop?
                    </>
                }
                itemPreview={deletingProduct ? {
                    name: deletingProduct.name,
                    thumbnail: deletingProduct.effectiveThumbnail,
                    subtitle: `৳${Number(deletingProduct.price).toLocaleString()}`
                } : undefined}
                note="This removes the product listing from your shop's customer storefront. The master item remains safely available in the shared catalog."
                confirmText="Yes, Remove"
            />
        </div>
    );
}
