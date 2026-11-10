import { useState } from "react";
import { Search, Check, Plus, Package } from "lucide-react";
import { Button, Form, Input, message, Select } from "antd";
import ResponsiveModal from "../../../Components/reuseable/responsive-modal/index.js";
import FormField from "../../../Components/form/index.js";
import Loading from "../../../Components/reuseable/loading/index.js";
import {
    useGetShopCatalogQuery,
    useAddCatalogToShopMutation,
    useGetCategoriesQuery,
    type ICatalogProduct,
} from "../../../redux/features/ecommerce/index.js";

export default function ProductCatalog() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
    const [selectedProduct, setSelectedProduct] = useState<ICatalogProduct | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [form] = Form.useForm();

    const { data, isLoading } = useGetShopCatalogQuery({
        search: searchTerm,
        categoryId: selectedCategory,
    });
    const { data: catData } = useGetCategoriesQuery();
    const [addToShop, { isLoading: isAdding }] = useAddCatalogToShopMutation();

    const catalog: ICatalogProduct[] = data?.results || [];
    const categories = catData?.results || [];

    const handleOpenAddModal = (product: ICatalogProduct) => {
        setSelectedProduct(product);
        form.setFieldsValue({
            price: 1000,
            details: product.description,
            thumbnail: product.thumbnail,
        });
        setIsAddModalOpen(true);
    };

    const handleConfirmAdd = async (values: any) => {
        if (!selectedProduct) return;
        try {
            await addToShop({
                productId: selectedProduct.id,
                price: values.price,
                details: values.details,
                thumbnail: values.thumbnail,
            }).unwrap();
            message.success(`"${selectedProduct.name}" added to your shop successfully!`);
            setIsAddModalOpen(false);
            form.resetFields();
        } catch (err: any) {
            message.error(err?.data?.message || "Failed to add product to shop.");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1b3a] tracking-tight">
                    Shared Product Catalog
                </h1>
                <p className="mt-1 text-sm text-slate-500 font-normal">
                    Browse global master products created by Admin and other Shop Owners, and add them to your store
                </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-full sm:w-80">
                    <Input
                        type="text"
                        size="large"
                        prefix={<Search className="w-4 h-4 text-slate-400" />}
                        placeholder="Search shared products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="!rounded-md"
                    />
                </div>
                <Select
                    placeholder="All Categories"
                    allowClear
                    size="large"
                    onChange={(val) => setSelectedCategory(val)}
                    className="w-48 !rounded-md"
                >
                    {categories.map((c) => (
                        <Select.Option key={c.id} value={c.id}>
                            {c.name}
                        </Select.Option>
                    ))}
                </Select>
                <span className="text-xs font-semibold text-slate-400 ml-auto">
                    Available Items: {catalog.length}
                </span>
            </div>

            {/* Catalog Grid */}
            {isLoading ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-8">
                    <Loading title="Loading shared catalog..." />
                </div>
            ) : catalog.length === 0 ? (
                <div className="py-20 text-center text-slate-400 bg-white rounded-2xl border border-slate-100">
                    No products found in the shared catalog.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {catalog.map((product) => {
                        const isAdded = product.isAddedToCurrentShop;
                        return (
                            <div
                                key={product.id}
                                className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col justify-between transition-shadow group"
                            >
                                <div>
                                    {/* Product Image */}
                                    <div className="w-full h-48 rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center p-3 mb-4 border border-slate-100">
                                        {product.thumbnail ? (
                                            <img
                                                src={product.thumbnail}
                                                alt={product.name}
                                                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <Package className="w-10 h-10 text-slate-300" />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-primary border border-blue-100">
                                            {product.categoryName || "General"}
                                        </span>
                                        <span className="text-[11px] text-slate-400">
                                            By: {product.creatorName || "Admin"}
                                        </span>
                                    </div>

                                    <h3 className="text-base font-bold text-[#0c1b3a] line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                        {product.description || "Shared global catalog specification."}
                                    </p>
                                </div>

                                {/* Action Button */}
                                <div className="mt-5 pt-4 border-t border-slate-100">
                                    {isAdded ? (
                                        <button
                                            disabled
                                            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default"
                                        >
                                            <Check className="w-4 h-4 stroke-2" />
                                            <span>Already in Your Shop</span>
                                        </button>
                                    ) : (
                                        <Button
                                            type="primary"
                                            onClick={() => handleOpenAddModal(product)}
                                            className="w-full !rounded-xl !h-10 !text-xs !font-semibold !flex !items-center !justify-center !gap-2 !bg-primary hover:!bg-primary-hover !text-white !border-none"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Add to My Shop</span>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Reusable Responsive Modal for Adding Catalog Product to Shop */}
            <ResponsiveModal
                open={isAddModalOpen}
                onCancel={() => setIsAddModalOpen(false)}
                title="Add Product to Your Shop"
                subtitle={selectedProduct?.name}
                description="You can set your own shop-specific selling price, custom description, and custom thumbnail without modifying the global product."
                width="min(640px, 95vw)"
                footer={
                    <>
                        <Button
                            onClick={() => setIsAddModalOpen(false)}
                            className="rounded-xl h-10 px-5 font-medium text-slate-600 hover:text-slate-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            loading={isAdding}
                            onClick={() => form.submit()}
                            className="!bg-primary hover:!bg-primary-hover rounded-xl h-10 px-6 text-white font-semibold"
                        >
                            Confirm & List in Shop
                        </Button>
                    </>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleConfirmAdd}
                    className="space-y-1"
                >
                    <FormField
                        type="number"
                        name="price"
                        label="Your Shop Selling Price (৳ BDT)"
                        placeholder="e.g. 45000"
                        required
                        colorClass="rounded-xl"
                        className="!mb-3.5"
                    />

                    <FormField
                        type="textarea"
                        name="details"
                        label="Shop-Specific Custom Details / Promotion"
                        placeholder="e.g. Exclusive Deal: Includes 1-year local warranty and gift box..."
                        rows={3}
                        colorClass="rounded-xl"
                        className="!mb-3.5"
                    />

                    <FormField
                        type="text"
                        name="thumbnail"
                        label="Custom Shop Thumbnail URL (Optional)"
                        placeholder="Leave blank to use the shared master thumbnail"
                        colorClass="rounded-xl"
                        className="!mb-3.5"
                    />
                </Form>
            </ResponsiveModal>
        </div>
    );
}
