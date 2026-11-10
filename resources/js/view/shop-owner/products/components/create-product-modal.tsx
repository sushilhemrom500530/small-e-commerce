import { Form, Input, InputNumber, Button, Select, message } from "antd";
import ResponsiveModal from "../../../../Components/reuseable/responsive-modal/index.js";
import { useCreateShopProductMutation } from "../../../../redux/features/ecommerce/index.js";

interface CreateProductModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    categories: Array<{ id: number; name: string }>;
}

export default function CreateProductModal({
    open,
    onCancel,
    onSuccess,
    categories,
}: CreateProductModalProps) {
    const [form] = Form.useForm();
    const [createShopProduct, { isLoading: isCreating }] = useCreateShopProductMutation();

    const handleSubmit = async (values: any) => {
        try {
            await createShopProduct(values).unwrap();
            message.success("New product created in shared catalog and listed in your shop!");
            form.resetFields();
            onSuccess();
        } catch (err: any) {
            message.error(err?.data?.message || "Failed to create product.");
        }
    };

    return (
        <ResponsiveModal
            open={open}
            onCancel={onCancel}
            title="Create New Product"
            subtitle="Enters Shared Catalog + Listed in Your Shop"
            description="Products created by you will become available in the Shared Catalog for other shop owners, and automatically listed in your shop!"
            footer={
                <>
                    <Button
                        onClick={onCancel}
                        disabled={isCreating}
                        className="rounded-xl h-10 px-5 font-medium text-slate-600 hover:text-slate-800"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        loading={isCreating}
                        onClick={() => form.submit()}
                        className="!bg-primary hover:!bg-primary-hover rounded-xl h-10 px-6 text-white font-semibold shadow-xs"
                    >
                        Create & List Product
                    </Button>
                </>
            }
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit} className="space-y-1">
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
            </Form>
        </ResponsiveModal>
    );
}

