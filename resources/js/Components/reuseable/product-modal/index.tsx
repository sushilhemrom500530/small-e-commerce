import { useEffect } from "react";
import { Form, Button } from "antd";
import ResponsiveModal from "../responsive-modal/index.js";
import FormField from "../../form/index.js";

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
    maxHeight = "85vh",
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

    const categoryOptions = categories.map((c) => ({
        label: c.name,
        value: c.id,
    }));

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
                {/* 1. Product Name via common FormField */}
                <FormField
                    type="text"
                    name="name"
                    label="Product Name"
                    placeholder="e.g. Mechanical Gaming Keyboard RGB"
                    required
                    colorClass="rounded-xl"
                    className="!mb-3.5"
                />

                {/* 2. Category & Price row via common FormField */}
                <div className={`grid grid-cols-1 ${isShopOwner ? "sm:grid-cols-2" : ""} gap-3 sm:gap-4`}>
                    <FormField
                        type="select"
                        name="categoryId"
                        label="Category"
                        placeholder="Select a category"
                        options={categoryOptions}
                        allowClear
                        colorClass="rounded-xl"
                        className="!mb-3.5"
                    />

                    {isShopOwner && (
                        <FormField
                            type="number"
                            name="price"
                            label="Your Selling Price (৳ BDT)"
                            placeholder="e.g. 4500"
                            required
                            colorClass="rounded-xl"
                            className="!mb-3.5"
                        />
                    )}
                </div>

                {/* 3. Description / Details via common FormField */}
                <FormField
                    type="textarea"
                    name={isShopOwner && isEdit ? "details" : "description"}
                    label={
                        isShopOwner && isEdit
                            ? "Shop-Specific Custom Details / Promotion Note"
                            : "Product Description"
                    }
                    placeholder={
                        isShopOwner && isEdit
                            ? "Customize warranty, accessories, or local deal notes..."
                            : "Full product specifications and details..."
                    }
                    rows={3}
                    colorClass="rounded-xl"
                    className="!mb-3.5"
                />

                {/* 4. Thumbnail URL via common FormField */}
                <FormField
                    type="text"
                    name="thumbnail"
                    label={
                        isShopOwner
                            ? "Thumbnail URL (Leave blank to use default)"
                            : "Master Thumbnail URL"
                    }
                    placeholder="https://example.com/product-image.jpg"
                    colorClass="rounded-xl"
                    className="!mb-3.5"
                />

                {/* 5. Live in Store Switch via common FormField (Shop Owner listing only) */}
                {isShopOwner && isEdit && (
                    <FormField
                        type="switch"
                        name="isActive"
                        label="Visibility Status in Store"
                        checkedChildren="Live in Store"
                        unCheckedChildren="Hidden"
                        className="!mb-2"
                    />
                )}
            </Form>
        </ResponsiveModal>
    );
}
