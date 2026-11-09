import { useState } from "react";
import { Search, Check, Plus, Package } from "lucide-react";
import { Button, Modal, Form, Input, InputNumber, message, Select } from "antd";
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
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search shared products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl placeholder-slate-400 text-slate-700 shadow-2xs focus:outline-none focus:border-primary"
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
                <span className="text-xs font-semibold text-slate-400 ml-auto">
                    Available Items: {catalog.length}
                </span>
            </div>

            {/* Catalog Grid */}
            {isLoading ? (
                <div className="py-20 text-center text-slate-400 font-medium">
                    Loading shared catalog...
                </div>
            ) : catalog.length === 0 ? (
                <div className="py-20 text-center text-slate-400 bg-white rounded-2xl border border-slate-100">
                    No products found in the shared catalog.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catalog.map((product) => {
                        const isAdded = product.isAddedToCurrentShop;
                        return (
                            <div
                                key={product.id}
                                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group"
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

            {/* Add to Shop Modal */}
            <Modal
                title={
                    <span className="text-lg font-bold text-[#0c1b3a]">
                        Add "{selectedProduct?.name}" to Your Shop
                    </span>
                }
                open={isAddModalOpen}
                onCancel={() => setIsAddModalOpen(false)}
                footer={null}
                centered
            >
                <p className="text-xs text-slate-500 mb-4">
                    You can set your own shop-specific selling price, custom description, and custom thumbnail without modifying the global product.
                </p>
                <Form form={form} layout="vertical" onFinish={handleConfirmAdd}>
                    <Form.Item
                        name="price"
                        label="Your Shop Selling Price (৳ BDT)"
                        rules={[{ required: true, message: "Please set your selling price" }]}
                    >
                        <InputNumber
                            min={0}
                            className="w-full rounded-xl py-1 text-base font-bold text-slate-800"
                            placeholder="e.g. 45000"
                        />
                    </Form.Item>

                    <Form.Item name="details" label="Shop-Specific Custom Details / Promotion">
                        <Input.TextArea
                            rows={3}
                            placeholder="e.g. Exclusive Deal: Includes 1-year local warranty and gift box..."
                            className="rounded-xl"
                        />
                    </Form.Item>

                    <Form.Item name="thumbnail" label="Custom Shop Thumbnail URL (Optional)">
                        <Input placeholder="Leave blank to use the shared master thumbnail" className="rounded-xl py-2" />
                    </Form.Item>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button onClick={() => setIsAddModalOpen(false)} className="rounded-xl h-10 px-4">
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isAdding}
                            className="!bg-primary hover:!bg-primary-hover rounded-xl h-10 px-6 text-white font-semibold"
                        >
                            Confirm & List in Shop
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}
