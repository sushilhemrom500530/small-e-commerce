import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { message, Button } from "antd";
import { Plus, ArrowLeft } from "lucide-react";
import ProductModal from "../../../Components/reuseable/product-modal/index.js";
import {
    useGetCategoriesQuery,
    useCreateAdminProductMutation,
    useCreateShopProductMutation,
} from "../../../redux/features/ecommerce/index.js";

export default function AddProduct() {
    const navigate = useNavigate();
    const location = useLocation();
    const isShopOwner =
        location.pathname.includes("shop-owner") ||
        location.pathname.includes("manager");
    const backProductsLink = isShopOwner
        ? "/shop-owner/dashboard/products"
        : "/admin/dashboard/products";

    const [isModalOpen, setIsModalOpen] = useState(true);

            const { data: categoriesData } = useGetCategoriesQuery();
            const categories = (categoriesData?.results || []).map((c: any) => ({
                id: c.id,
                name: c.name,
            }));

            const [createAdminProduct, { isLoading: isAdminCreating }] =
                useCreateAdminProductMutation();
            const [createShopProduct, { isLoading: isShopCreating }] =
                useCreateShopProductMutation();

            const isSubmitting = isAdminCreating || isShopCreating;

            const handleSubmit = async (values: any) => {
                try {
                    if (isShopOwner) {
                        await createShopProduct(values).unwrap();
                        message.success(
                            "Product created and added to your shop & shared catalog!"
                        );
                    } else {
                        await createAdminProduct(values).unwrap();
                        message.success("Product added to master catalog successfully!");
                    }
                    setIsModalOpen(false);
                    navigate(backProductsLink);
                } catch (err: any) {
                    message.error(err?.data?.message || "Failed to create product.");
                }
            };

                const handleCancel = () => {
                    setIsModalOpen(false);
                    navigate(backProductsLink);
                };

                return (
                    <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1b3a] tracking-tight">
                                            {isShopOwner ? "Add Product to My Shop" : "Add Product"}
                                        </h1>
                                        <p className="mt-1 text-sm text-slate-500 font-normal">
                                            Create a product to enter the shared catalog and list in your store
                                        </p>
                                    </div>

                                    <Button
                                        onClick={() => navigate(backProductsLink)}
                                        className="rounded-xl h-10 px-4 font-semibold text-slate-600 hover:text-slate-800 flex items-center gap-2"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        <span>Back to Products</span>
                                    </Button>
                                </div>

                                <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-2xs text-center max-w-2xl mx-auto">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                                        <Plus className="w-8 h-8 text-primary" />
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-900 mb-2">
                                        {isShopOwner
                                            ? "Create & List a New Product"
                                            : "Create Master Catalog Product"}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
                                        Use our common product form to define name, category, pricing, description, and thumbnail.
                                    </p>
                                    <Button
                                        type="primary"
                                        onClick={() => setIsModalOpen(true)}
                                        className="!bg-primary hover:!bg-primary-hover rounded-xl h-11 px-6 text-white font-semibold shadow-xs inline-flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Open Add Product Form</span>
                                    </Button>
                                </div>

                                {/* Reusable Common ProductModal Form */}
                                <ProductModal
                                    open={isModalOpen}
                                    role={isShopOwner ? "shop_owner" : "admin"}
                                    mode="create"
                                    categories={categories}
                                    loading={isSubmitting}
                                    onCancel={handleCancel}
                                    onSubmit={handleSubmit}
                                />
                        </div>
                        );
}
