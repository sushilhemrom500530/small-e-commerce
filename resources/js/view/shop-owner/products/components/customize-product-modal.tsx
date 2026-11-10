import { useEffect } from "react";
import { Form, Input, InputNumber, Switch, Button, Select, message } from "antd";
import ResponsiveModal from "../../../../Components/reuseable/responsive-modal/index.js";
import { useUpdateShopProductMutation, type IShopProduct } from "../../../../redux/features/ecommerce/index.js";

interface CustomizeProductModalProps {
    product: IShopProduct | null;
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    categories: Array<{ id: number; name: string }>;
}

export default function CustomizeProductModal({
    product,
    open,
    onCancel,
    onSuccess,
    categories,
}: CustomizeProductModalProps) {
    const [form] = Form.useForm();
    const [updateShopProduct, { isLoading: isUpdating }] = useUpdateShopProductMutation();

    useEffect(() => {
        if (product && open) {
            form.setFieldsValue({
                name: product.name,
                categoryId: product.category?.id,
                price: product.price,
                details: product.details,
                thumbnail: product.thumbnail,
                isActive: product.isActive,
            });
        }
    }, [product, open, form]);

    const handleSubmit = async (values: any) => {
        if (!product) return;
        try {
            await updateShopProduct({
                id: product.id,
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
            form.resetFields();
            onSuccess();
        } catch (err: any) {
            message.error(err?.data?.message || "Failed to update listing.");
        }
    };

    return (
        <ResponsiveModal
            open={open}
            onCancel={onCancel}
            title="Customize Product in Your Shop"
            subtitle={product?.name}
            description="Changes made here apply only to your shop's listing. The shared global product remains unaffected."
            footer={
                <>
                    <Button
                        onClick={onCancel}
                        disabled={isUpdating}
                        className="rounded-xl h-10 px-5 font-medium text-slate-600 hover:text-slate-800"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        loading={isUpdating}
                        onClick={() => form.submit()}
                        className="!bg-primary hover:!bg-primary-hover rounded-xl h-10 px-6 text-white font-semibold shadow-xs"
                    >
                        Save Listing
                    </Button>
                </>
            }
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit} className="space-y-1">
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
            </Form>
        </ResponsiveModal>
    );
}

