import { useState, useEffect } from "react";
import { Store, Mail, Phone, ExternalLink } from "lucide-react";
import { message, Form, Input, Button } from "antd";
import { Link } from "react-router-dom";
import {
    useGetMyShopProfileQuery,
    useUpdateMyShopProfileMutation,
} from "../../../redux/features/ecommerce/index.js";

export default function MyShopPage() {
    const { data, isLoading } = useGetMyShopProfileQuery();
    const [updateShop, { isLoading: isSaving }] = useUpdateMyShopProfileMutation();
    const [form] = Form.useForm();

    const shop = data?.results;

    useEffect(() => {
        if (shop) {
            form.setFieldsValue({
                name: shop.name,
                description: shop.description,
                logo: shop.logo,
            });
        }
    }, [shop, form]);

    const handleSave = async (values: any) => {
        try {
            await updateShop(values).unwrap();
            message.success("Shop information updated successfully!");
        } catch (err: any) {
            message.error(err?.data?.message || "Failed to update shop.");
        }
    };

    if (isLoading) {
        return (
            <div className="py-20 text-center text-slate-400 font-medium">
                Loading shop profile...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1b3a] tracking-tight">
                    My Shop Profile
                </h1>
                <p className="mt-1 text-sm text-slate-500 font-normal">
                    Manage your store profile, branding, and preview your live customer storefront
                </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xs max-w-4xl">
                {/* Storefront Banner / Header Card */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/70 border border-slate-100 mb-8">
                    <div className="w-24 h-24 rounded-2xl bg-white p-2 shadow-xs border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                        {shop?.logo ? (
                            <img src={shop.logo} alt="Shop Preview" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                            <Store className="w-10 h-10 text-primary" />
                        )}
                    </div>
                    <div className="text-center sm:text-left space-y-1 flex-1">
                        <div className="flex items-center justify-center sm:justify-start gap-2.5">
                            <h2 className="text-2xl font-black text-[#0c1b3a]">
                                {shop?.name || "My Shop"}
                            </h2>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                                {shop?.status || "Active"}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium line-clamp-1">
                            {shop?.description || "No description set yet."}
                        </p>
                        <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-1">
                            <span className="flex items-center gap-1">
                                <Store className="w-3.5 h-3.5" /> {shop?.productsCount ?? 0} Listed Products
                            </span>
                            {shop?.slug && (
                                <Link
                                    to={`/store/${shop.slug}`}
                                    target="_blank"
                                    className="flex items-center gap-1 text-primary font-semibold hover:underline"
                                >
                                    <span>Preview Storefront</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <Form form={form} layout="vertical" onFinish={handleSave} className="space-y-4">
                    <Form.Item name="name" label="Shop Name" rules={[{ required: true, message: "Shop name is required" }]}>
                        <Input placeholder="Shop Name" className="rounded-xl py-2" />
                    </Form.Item>

                    <Form.Item name="description" label="Shop Bio / Description">
                        <Input.TextArea rows={4} placeholder="Describe what makes your store unique..." className="rounded-xl" />
                    </Form.Item>

                    <Form.Item name="logo" label="Logo / Cover Image URL">
                        <Input placeholder="https://images.unsplash.com/photo-..." className="rounded-xl py-2" />
                    </Form.Item>

                    {shop?.owner && (
                        <div className="pt-2 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <span>Owner: {shop.owner.name} ({shop.owner.email})</span>
                            </div>
                            {shop.owner.phoneNumber && (
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    <span>Phone: {shop.owner.phoneNumber}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isSaving}
                            className="!bg-primary hover:!bg-primary-hover rounded-xl h-11 px-8 text-white font-semibold"
                        >
                            Save Changes
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}
