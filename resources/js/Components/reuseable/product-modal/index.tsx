import { useEffect } from "react";
import { Form, Input, InputNumber, Switch, Button, Select } from "antd";
import ResponsiveModal from "../responsive-modal/index.js";

export interface ProductModalInitialData {
    name?: string;
    categoryId?: number | null;
    price?: number;
    description?: string | null;
    details?: string | null;
    thumbnail?: string | null;
    isActive?: boolean;
}

export interface ProductModalProps {
    open: boolean;
    role?: "admin" | "shop_owner";
    mode?: "create" | "edit" | "customize";
    initialData?: ProductModalInitialData | null;
    categories: Array<{ id: number; name: string }>;
    loading?: boolean;
    maxHeight?: string;
    onCancel: () => void;
    onSubmit: (values: any) => Promise<void> | void;
    title?: string;
    subtitle?: string;
    description?: string;
    submitText?: string;
}

export default function ProductModal({
    open,
    role = "admin",
    mode = "create",
    initialData,
    categories = [],
    loading = false,
    maxHeight = "90vh",
    onCancel,
    onSubmit,
    title,
    subtitle,
    description,
    submitText,
}: ProductModalProps) {
    const [form] = Form.useForm();
    const isShopOwner = role === "shop_owner";
    const isEdit = mode === "edit" || mode === "customize";

    // Dynamic Title & Subtitle based on role and mode
    const resolvedTitle =
        title ||
        (isShopOwner
            ? isEdit
                ? "Customize Product in Your Shop"
                : "Create New Product"
            : isEdit
                ? "Edit Catalog Product"
                : "Add Product to Shared Catalog");

    const resolvedSubtitle =
        subtitle ||
        (isEdit
            ? initialData?.name
            : isShopOwner
                ? "Enters Shared Catalog + Automatically listed in your shop"
                : "Available for all shop owners to list in their stores");

    const resolvedDescription =
        description ||
        (isShopOwner
            ? isEdit
                ? "Changes made here customize this listing for your shop's storefront. The global catalog item remains intact."
                : "Products created by you will become available in the Shared Catalog for other shop owners and listed in your shop."
            : "Manage product details in the shared catalog accessible across all stores.");

    const resolvedSubmitText =
        submitText ||
        (isShopOwner
            ? isEdit
                ? "Save Listing"
                : "Create & List Product"
            : isEdit
                ? "Save Changes"
                : "Add to Catalog");

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.setFieldsValue({
                    name: initialData.name || "",
                    categoryId: initialData.categoryId ?? undefined,
                    price: initialData.price ?? 0,
                    details: initialData.details ?? initialData.description ?? "",
                    description: initialData.description ?? initialData.details ?? "",
                    thumbnail: initialData.thumbnail || "",
                    isActive: initialData.isActive !== false,
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, initialData, form]);

    const handleFormSubmit = async (values: any) => {
        // Normalize fields for both backend APIs
        const payload = {
            ...values,
            description: values.description || values.details,
            details: values.details || values.description,
        };
        await onSubmit(payload);
    };

    return (
        <ResponsiveModal
            open={open}
            onCancel={onCancel}
            title={resolvedTitle}
            subtitle={resolvedSubtitle}
            description={resolvedDescription}
            width="min(680px, 95vw)"
            maxHeight={maxHeight}
            footer={
                <>
                    <Button
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-xl h-10 px-5 font-medium text-slate-600 hover:text-slate-800"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        loading={loading}
                        onClick={() => form.submit()}
                        className="!bg-primary hover:!bg-primary-hover rounded-xl h-10 px-6 text-white font-semibold shadow-xs"
                    >
                        {resolvedSubmitText}
                    </Button>
                </>
            }
        >
            <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="space-y-1">
                {/* 1. Product Name */}
                <Form.Item
                    name="name"
                    label={<span className="text-xs sm:text-sm font-semibold text-slate-700">Product Name</span>}
                    rules={[{ required: true, message: "Product name is required" }]}
                    className="!mb-3.5"
                >
                    <Input placeholder="e.g. Mechanical Gaming Keyboard RGB" className="rounded-xl py-2 font-medium text-slate-800" />
                </Form.Item>

                {/* 2. Category & Price row */}
                <div className={`grid grid-cols-1 ${isShopOwner ? "sm:grid-cols-2" : ""} gap-3 sm:gap-4`}>
                    <Form.Item
                        name="categoryId"
                        label={<span className="text-xs sm:text-sm font-semibold text-slate-700">Category</span>}
                        className="!mb-3.5"
                    >
                        <Select placeholder="Select a category" className="rounded-xl !h-10" allowClear>
                            {categories.map((c) => (
                                <Select.Option key={c.id} value={c.id}>
                                    {c.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {isShopOwner && (
                        <Form.Item
                            name="price"
                            label={<span className="text-xs sm:text-sm font-semibold text-slate-700">Your Selling Price (৳ BDT)</span>}
                            rules={[{ required: true, message: "Price is required" }]}
                            className="!mb-3.5"
                        >
                            <InputNumber min={0} placeholder="e.g. 4500" className="w-full rounded-xl py-1 text-base font-bold text-slate-800" />
                        </Form.Item>
                    )}
                </div>

                {/* 3. Description / Details */}
                <Form.Item
                    name={isShopOwner && isEdit ? "details" : "description"}
                    label={
                        <span className="text-xs sm:text-sm font-semibold text-slate-700">
                            {isShopOwner && isEdit
                                ? "Shop-Specific Custom Details / Promotion Note"
                                : "Product Description"}
                        </span>
                    }
                    className="!mb-3.5"
                >
                    <Input.TextArea
                        rows={3}
                        placeholder={
                            isShopOwner && isEdit
                                ? "Customize warranty, accessories, or local deal notes..."
                                : "Full product specifications and details..."
                        }
                        className="rounded-xl text-sm"
                    />
                </Form.Item>

                {/* 4. Thumbnail URL */}
                <Form.Item
                    name="thumbnail"
                    label={
                        <span className="text-xs sm:text-sm font-semibold text-slate-700">
                            {isShopOwner
                                ? "Thumbnail URL (Leave blank to use default)"
                                : "Master Thumbnail URL"}
                        </span>
                    }
                    className="!mb-3.5"
                >
                    <Input placeholder="https://example.com/product-image.jpg" className="rounded-xl py-2 text-sm" />
                </Form.Item>

                {/* 5. Live in Store Switch (Shop Owner listing only) */}
                {isShopOwner && isEdit && (
                    <Form.Item
                        name="isActive"
                        label={<span className="text-xs sm:text-sm font-semibold text-slate-700">Visibility Status in Store</span>}
                        valuePropName="checked"
                        className="!mb-2"
                    >
                        <Switch checkedChildren="Live in Store" unCheckedChildren="Hidden" />
                    </Form.Item>
                )}
            </Form>
        </ResponsiveModal>
    );
}
