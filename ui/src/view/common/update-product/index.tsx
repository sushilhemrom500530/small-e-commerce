import { useEffect, useState } from 'react';
import { Button, Form, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import FormField from '../../../Components/form/index.js';
import { useGetProductQuery, useUpdateProductMutation } from '../../../redux/features/product/index.js';

export default function UpdateProductContent({ id }: { id: string }) {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const { data, isLoading: productLoading } = useGetProductQuery(id!, {
        skip: !id,
    });

    const [updateProduct, { isLoading }] = useUpdateProductMutation();

    const productImageData = Form.useWatch('productImage', form);

    useEffect(() => {
        if (productImageData && productImageData.length > 0) {
            const file = productImageData[0].originFileObj;
            if (file) {
                setPreviewImage(URL.createObjectURL(file));
            }
        }
        // Cleanup URL object if needed (optional for this context)
    }, [productImageData]);

    useEffect(() => {
        if (data?.data) {
            form.setFieldsValue({
                productName: data.data.productName,
                sku: data.data.sku,
                category: data.data.category,
                purchasePrice: data.data.purchasePrice,
                sellingPrice: data.data.sellingPrice,
                stockQuantity: data.data.stockQuantity,
            });

            setPreviewImage(data.data.productImage);
        }
    }, [data, form]);


    const handleSave = async (values: any) => {
        try {
            const formData = new FormData();

            formData.append("productName", values.productName);
            formData.append("sku", values.sku);
            formData.append("category", values.category);
            formData.append("purchasePrice", String(values.purchasePrice));
            formData.append("sellingPrice", String(values.sellingPrice));
            formData.append("stockQuantity", String(values.stockQuantity));

            const file = values.productImage?.[0]?.originFileObj;

            if (file) {
                formData.append("productImage", file);
            }

            const res = await updateProduct({
                id: id!,
                body: formData,
            }).unwrap();

            message.success(res.message || "Product updated successfully.");

            navigate(-1);
        } catch (error: any) {
            message.error(
                error?.data?.message || "Failed to update product."
            );
        }
    };

    const handleImageChange = (file: File) => {
        setPreviewImage(URL.createObjectURL(file));
    };


    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            className="flex flex-col gap-6"
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column - Image Upload */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 h-full flex flex-col">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Image</h2>
                        <div className="flex-1">
                            <FormField
                                type="file"
                                name="productImage"
                                defaultImage={previewImage}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column - Product Information */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-xl border border-slate-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                            <FormField
                                type="text"
                                label="Product Name"
                                name="productName"
                                required
                                placeholder="E.g. Apple iPhone 15 Pro"
                                className="md:col-span-2"
                                colorClass="rounded-lg"
                            />

                            <FormField
                                type="text"
                                label="SKU"
                                name="sku"
                                required
                                placeholder="E.g. IPH15P-001"
                                colorClass="rounded-lg"
                            />

                            <FormField
                                type="text"
                                label="Category"
                                name="category"
                                required
                                placeholder="E.g. Electronics"
                                colorClass="rounded-lg"
                            />

                            <FormField
                                type="number"
                                label="Purchase Price ($)"
                                name="purchasePrice"
                                required
                                placeholder="0.00"
                                colorClass="rounded-lg"
                            />

                            <FormField
                                type="number"
                                label="Selling Price ($)"
                                name="sellingPrice"
                                required
                                placeholder="0.00"
                                colorClass="rounded-lg"
                            />

                            <FormField
                                type="number"
                                label="Stock Quantity"
                                name="stockQuantity"
                                required
                                placeholder="0"
                                className="md:col-span-2 lg:col-span-1"
                                colorClass="rounded-lg"
                            />
                        </div>
                    </div>
                </div>

            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-end gap-3 mt-2">
                <Button
                    size="large"
                    className="px-6 text-gray-700 font-medium"
                    onClick={() => navigate(-1)}
                >
                    Cancel
                </Button>
                <Button
                    loading={isLoading}
                    type="primary"
                    htmlType="submit"
                    size="large"
                    className="px-6 !bg-secondary hover:!bg-secondary/80 font-medium transition-colors"
                >
                    Update Product
                </Button>
            </div>
        </Form>
    );
}