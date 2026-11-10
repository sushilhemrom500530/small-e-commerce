import { useState } from "react";
import { Users, Plus, Search, Mail, Phone, Store } from "lucide-react";
import { Button, Modal, Form, message } from "antd";
import FormField from "../../../Components/form/index.js";
import {
    useGetAdminShopOwnersQuery,
    useCreateAdminShopOwnerMutation,
    type IShopOwner,
} from "../../../redux/features/ecommerce/index.js";
import Loading from "../../../Components/reuseable/loading/index.js";

export default function ShopOwnersManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [form] = Form.useForm();

    const { data, isLoading } = useGetAdminShopOwnersQuery({ search: searchTerm });
    const [createOwner, { isLoading: isCreating }] = useCreateAdminShopOwnerMutation();

    const owners: IShopOwner[] = data?.results || [];

    const handleCreateOwner = async (values: any) => {
        try {
            await createOwner(values).unwrap();
            message.success("Shop owner account created successfully!");
            setIsCreateOpen(false);
            form.resetFields();
        } catch (err: any) {
            message.error(err?.data?.message || "Failed to create shop owner.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1b3a] tracking-tight">
                        Shop Owners
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 font-normal">
                        Manage vendor accounts, permissions, and assigned stores
                    </p>
                </div>
                <Button
                    type="primary"
                    onClick={() => setIsCreateOpen(true)}
                    className="!bg-primary hover:!bg-primary-hover !rounded-xl !h-10 !px-4 !font-semibold !flex !items-center !gap-2 !border-none !text-white w-fit cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Shop Owner</span>
                </Button>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <div className="flex items-center justify-between gap-4 pb-5 border-b border-slate-100">
                    <div className="relative w-full max-w-xs">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search owners or shops..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl placeholder-slate-400 text-slate-700 focus:outline-none focus:border-primary"
                        />
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                        Total Owners: {owners.length}
                    </span>
                </div>

                <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400">
                                <th className="py-3">Owner</th>
                                <th className="py-3">Contact</th>
                                <th className="py-3">Assigned Shop</th>
                                <th className="py-3">Joined Date</th>
                                <th className="py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center">
                                        <Loading title="Loading shop owners..." className="min-h-[180px]" />
                                    </td>
                                </tr>
                            ) : owners.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center text-slate-400">
                                        No shop owners found. Click "Add Shop Owner" to create one.
                                    </td>
                                </tr>
                            ) : (
                                owners.map((owner) => (
                                    <tr key={owner.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                                                    <Users className="w-5 h-5" />
                                                </div>
                                                <span className="font-semibold text-slate-800">{owner.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>{owner.email}</span>
                                                </div>
                                                {owner.phoneNumber && (
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>{owner.phoneNumber}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2">
                                                <Store className="w-4 h-4 text-primary" />
                                                <span className="font-semibold text-slate-700">
                                                    {owner.shopName || "None"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-slate-500 text-xs">
                                            {owner.joinedDate || "Recent"}
                                        </td>
                                        <td className="py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Shop Owner Modal */}
            <Modal
                title={<span className="text-lg font-bold text-[#0c1b3a]">Create Shop Owner Account</span>}
                open={isCreateOpen}
                onCancel={() => setIsCreateOpen(false)}
                footer={null}
                centered
            >
                <Form form={form} layout="vertical" onFinish={handleCreateOwner} className="mt-4">
                    <FormField
                        type="text"
                        name="name"
                        label="Full Name"
                        placeholder="e.g. Michael Smith"
                        required
                        rules={[{ required: true, message: "Name is required" }]}
                        colorClass="!rounded-md"
                        className="!mb-3.5"
                    />

                    <FormField
                        type="email"
                        name="email"
                        label="Email Address"
                        placeholder="owner@store.com"
                        required
                        rules={[{ required: true, type: "email", message: "Valid email is required" }]}
                        colorClass="!rounded-md"
                        className="!mb-3.5"
                    />

                    <FormField
                        type="password"
                        name="password"
                        label="Password"
                        placeholder="••••••••"
                        required
                        rules={[{ required: true, min: 6, message: "Min 6 characters" }]}
                        colorClass="!rounded-md"
                        className="!mb-3.5"
                    />

                    <FormField
                        type="tel"
                        name="phoneNumber"
                        label="Phone Number"
                        placeholder="+8801700000000"
                        colorClass="!rounded-md"
                        className="!mb-3.5"
                    />

                    <FormField
                        type="text"
                        name="shopName"
                        label="Assign New Shop Name (Optional)"
                        placeholder="e.g. Galaxy Electronics"
                        colorClass="!rounded-md"
                        className="!mb-3.5"
                    />

                    <div className="flex justify-end gap-3 mt-6">
                        <Button onClick={() => setIsCreateOpen(false)} className="!rounded-md h-10 px-4">
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isCreating}
                            className="!bg-primary hover:!bg-primary-hover !rounded-md h-10 px-6 text-white font-semibold"
                        >
                            Create Account
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}
