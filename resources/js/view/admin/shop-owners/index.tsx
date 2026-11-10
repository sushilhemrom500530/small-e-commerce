import { useState, useEffect } from "react";
import {
    Users,
    Plus,
    Search,
    Mail,
    Phone,
    Store,
    MoreVertical,
    Edit2,
    Ban,
    CheckCircle2,
    Trash2,
} from "lucide-react";
import { Button, Modal, Form, Dropdown, message } from "antd";
import FormField from "../../../Components/form/index.js";
import DeleteConfirmModal from "../../../Components/reuseable/delete-confirm-modal/index.js";
import {
    useGetAdminShopOwnersQuery,
    useCreateAdminShopOwnerMutation,
    useUpdateAdminShopOwnerMutation,
    useToggleAdminShopOwnerStatusMutation,
    useDeleteAdminShopOwnerMutation,
    type IShopOwner,
} from "../../../redux/features/ecommerce/index.js";
import Loading from "../../../Components/reuseable/loading/index.js";

const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Suspended", value: "suspended" },
    { label: "Inactive", value: "inactive" },
];

export default function ShopOwnersManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingOwner, setEditingOwner] = useState<IShopOwner | null>(null);
    const [deletingOwner, setDeletingOwner] = useState<IShopOwner | null>(null);

    const [createForm] = Form.useForm();
    const [editForm] = Form.useForm();

    const { data, isLoading } = useGetAdminShopOwnersQuery({ search: searchTerm });
    const [createOwner, { isLoading: isCreating }] = useCreateAdminShopOwnerMutation();
    const [updateOwner, { isLoading: isUpdating }] = useUpdateAdminShopOwnerMutation();
    const [toggleStatus] = useToggleAdminShopOwnerStatusMutation();
    const [deleteOwner, { isLoading: isDeleting }] = useDeleteAdminShopOwnerMutation();

    const owners: IShopOwner[] = data?.results || [];

    useEffect(() => {
        if (editingOwner) {
            editForm.setFieldsValue({
                name: editingOwner.name,
                email: editingOwner.email,
                phoneNumber: editingOwner.phoneNumber || "",
                shopName:
                    editingOwner.shopName && editingOwner.shopName !== "No Shop Assigned"
                        ? editingOwner.shopName
                        : "",
                status: editingOwner.status || "active",
                password: "",
            });
        }
    }, [editingOwner, editForm]);

    const handleCreateOwner = async (values: any) => {
        try {
            await createOwner(values).unwrap();
            message.success("Shop owner account created successfully!");
            setIsCreateOpen(false);
            createForm.resetFields();
        } catch (err: any) {
            message.error(err?.data?.message || "Failed to create shop owner.");
        }
    };

    const handleUpdateOwner = async (values: any) => {
        if (!editingOwner) return;
        try {
            const payload: any = { ...values };
            if (!payload.password) {
                delete payload.password;
            }
            await updateOwner({ id: editingOwner.id, body: payload }).unwrap();
            message.success("Shop owner account updated successfully!");
            setEditingOwner(null);
            editForm.resetFields();
        } catch (err: any) {
            message.error(err?.data?.message || "Failed to update shop owner.");
        }
    };

    const handleToggleStatus = async (owner: IShopOwner) => {
        try {
            await toggleStatus(owner.id).unwrap();
            const actionVerb = owner.status === "suspended" ? "activated" : "suspended";
            message.success(`Shop owner account ${actionVerb} successfully!`);
        } catch (err: any) {
            message.error(err?.data?.message || "Failed to update account status.");
        }
    };

    const handleDeleteOwner = async () => {
        if (!deletingOwner) return;
        try {
            await deleteOwner(deletingOwner.id).unwrap();
            message.success("Shop owner account deleted successfully!");
            setDeletingOwner(null);
        } catch (err: any) {
            message.error(err?.data?.message || "Failed to delete shop owner.");
        }
    };

    const getDropdownItems = (owner: IShopOwner) => [
        {
            key: "edit",
            label: "Edit Details",
            icon: <Edit2 className="w-4 h-4 text-blue-500" />,
            onClick: () => setEditingOwner(owner),
        },
        {
            key: "toggle-status",
            label: owner.status === "suspended" ? "Activate Account" : "Suspend Account",
            icon:
                owner.status === "suspended" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                    <Ban className="w-4 h-4 text-amber-500" />
                ),
            onClick: () => handleToggleStatus(owner),
        },
        {
            type: "divider" as const,
        },
        {
            key: "delete",
            label: "Delete Account",
            icon: <Trash2 className="w-4 h-4 text-red-500" />,
            danger: true,
            onClick: () => setDeletingOwner(owner),
        },
    ];

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
                                <th className="py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {isLoading ? (
                                <tr>
                                        <td colSpan={6} className="py-8 text-center">
                                            <Loading title="Loading shop owners..." className="min-h-[180px]" />
                                        </td>
                                </tr>
                            ) : owners.length === 0 ? (
                                <tr>
                                        <td colSpan={6} className="py-10 text-center text-slate-400">
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
                                            {owner.status === "suspended" ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200/60">
                                                    Suspended
                                                </span>
                                            ) : owner.status === "inactive" ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
                                                    Inactive
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                                                    Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 text-right">
                                            <Dropdown
                                                menu={{ items: getDropdownItems(owner) }}
                                                trigger={["click"]}
                                                placement="bottomRight"
                                            >
                                                <button
                                                    type="button"
                                                    className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors inline-flex items-center justify-center cursor-pointer"
                                                    title="More actions"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </Dropdown>
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
                    <Form form={createForm} layout="vertical" onFinish={handleCreateOwner} className="mt-4">
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

            {/* Edit Shop Owner Modal */}
            <Modal
                title={<span className="text-lg font-bold text-[#0c1b3a]">Edit Shop Owner Account</span>}
                open={!!editingOwner}
                onCancel={() => setEditingOwner(null)}
                footer={null}
                centered
            >
                <Form form={editForm} layout="vertical" onFinish={handleUpdateOwner} className="mt-4">
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
                        label="Assigned Shop Name"
                        placeholder="e.g. Galaxy Electronics"
                        colorClass="!rounded-md"
                        className="!mb-3.5"
                    />

                    <FormField
                        type="select"
                        name="status"
                        label="Account Status"
                        placeholder="Select status"
                        options={statusOptions}
                        colorClass="!rounded-md"
                        className="!mb-3.5"
                    />

                    <FormField
                        type="password"
                        name="password"
                        label="New Password (Optional)"
                        placeholder="Leave blank to keep current password"
                        colorClass="!rounded-md"
                        className="!mb-3.5"
                    />

                    <div className="flex justify-end gap-3 mt-6">
                        <Button onClick={() => setEditingOwner(null)} className="!rounded-md h-10 px-4">
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isUpdating}
                            className="!bg-primary hover:!bg-primary-hover !rounded-md h-10 px-6 text-white font-semibold"
                        >
                            Save Changes
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Delete Confirm Modal */}
            <DeleteConfirmModal
                open={!!deletingOwner}
                onCancel={() => setDeletingOwner(null)}
                onConfirm={handleDeleteOwner}
                loading={isDeleting}
                title="Delete Shop Owner"
                description={
                    deletingOwner ? (
                        <span>
                            Are you sure you want to delete <strong>{deletingOwner.name}</strong> ({deletingOwner.email})? This action cannot be undone.
                        </span>
                    ) : null
                }
                confirmText="Delete Account"
            />
        </div>
    );
}
