import { useState, useEffect } from "react";
import {
    UserPlus,
    Search,
    Shield,
    MoreVertical,
    Users,
    Edit2,
    Ban,
    CheckCircle2,
    Trash2,
} from "lucide-react";
import { Button, Input, Modal, Form, Dropdown, message } from "antd";
import FormField from "../../../Components/form/index.js";
import DeleteConfirmModal from "../../../Components/reuseable/delete-confirm-modal/index.js";
import Loading from "../../../Components/reuseable/loading/index.js";
import {
    useGetAdminUsersQuery,
    useCreateAdminUserMutation,
    useUpdateAdminUserMutation,
    useToggleAdminUserStatusMutation,
    useDeleteAdminUserMutation,
    type IPlatformUser,
} from "../../../redux/features/ecommerce/index.js";

const roleOptions = [
    { label: "Customer", value: "customer" },
    { label: "Shop Owner", value: "shop_owner" },
    { label: "Admin", value: "admin" },
];

const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Suspended", value: "suspended" },
    { label: "Inactive", value: "inactive" },
];

export default function UsersManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<IPlatformUser | null>(null);
    const [deletingUser, setDeletingUser] = useState<IPlatformUser | null>(null);

    const [createForm] = Form.useForm();
    const [editForm] = Form.useForm();

    const { data, isLoading } = useGetAdminUsersQuery({ search: searchTerm });
    const [createUser, { isLoading: isCreating }] = useCreateAdminUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateAdminUserMutation();
    const [toggleStatus] = useToggleAdminUserStatusMutation();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteAdminUserMutation();

    const users: IPlatformUser[] = data?.results || [];

    useEffect(() => {
        if (editingUser) {
            editForm.setFieldsValue({
                name: editingUser.name,
                email: editingUser.email,
                role: editingUser.role,
                phoneNumber: editingUser.phoneNumber || "",
                status: editingUser.status || "active",
                password: "",
            });
        }
    }, [editingUser, editForm]);

    const handleCreateUser = async (values: any) => {
        try {
            await createUser(values).unwrap();
            message.success("User created successfully!");
            setIsCreateOpen(false);
            createForm.resetFields();
        } catch (err: any) {
            message.error(err?.data?.message || "Failed to create user.");
        }
    };

    const handleUpdateUser = async (values: any) => {
        if (!editingUser) return;
        try {
            const payload: any = { ...values };
            if (!payload.password) {
                delete payload.password;
            }
            await updateUser({ id: editingUser.id, body: payload }).unwrap();
            message.success("User account updated successfully!");
            setEditingUser(null);
            editForm.resetFields();
        } catch (err: any) {
            message.error(err?.data?.message || "Failed to update user.");
        }
    };

    const handleToggleStatus = async (user: IPlatformUser) => {
        try {
            await toggleStatus(user.id).unwrap();
            const actionVerb = user.status === "suspended" ? "activated" : "suspended";
            message.success(`User account ${actionVerb} successfully!`);
        } catch (err: any) {
            message.error(err?.data?.message || "Failed to update user status.");
        }
    };

    const handleDeleteUser = async () => {
        if (!deletingUser) return;
        try {
            await deleteUser(deletingUser.id).unwrap();
            message.success("User deleted successfully!");
            setDeletingUser(null);
        } catch (err: any) {
            message.error(err?.data?.message || "Failed to delete user.");
        }
    };

    const getDropdownItems = (user: IPlatformUser) => [
        {
            key: "edit",
            label: "Edit Details",
            icon: <Edit2 className="w-4 h-4 text-blue-500" />,
            onClick: () => setEditingUser(user),
        },
        {
            key: "toggle-status",
            label: user.status === "suspended" ? "Activate Account" : "Suspend Account",
            icon:
                user.status === "suspended" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                    <Ban className="w-4 h-4 text-amber-500" />
                ),
            onClick: () => handleToggleStatus(user),
        },
        {
            type: "divider" as const,
        },
        {
            key: "delete",
            label: "Delete User",
            icon: <Trash2 className="w-4 h-4 text-red-500" />,
            danger: true,
            onClick: () => setDeletingUser(user),
        },
    ];

    const getRoleBadge = (role: string) => {
        const lower = role.toLowerCase();
        if (lower === "admin") {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
                    <Shield className="w-3 h-3" />
                    Admin
                </span>
            );
        }
        if (lower === "shop_owner" || lower === "shop owner") {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                    <Shield className="w-3 h-3" />
                    Shop Owner
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                <Shield className="w-3 h-3" />
                Customer
            </span>
        );
    };

    const getStatusBadge = (status: string) => {
        const lower = (status || "").toLowerCase();
        if (lower === "suspended") {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200/60">
                    Suspended
                </span>
            );
        }
        if (lower === "inactive") {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
                    Inactive
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                Active
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1b3a] tracking-tight">
                        Users Management
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 font-normal">
                        Manage all platform users, roles, and account access
                    </p>
                </div>
                <Button
                    type="primary"
                    onClick={() => setIsCreateOpen(true)}
                    className="!bg-primary hover:!bg-primary-hover !rounded-md !h-10 !px-4 !font-semibold !flex !items-center !gap-2 !border-none !text-white w-fit cursor-pointer"
                >
                    <UserPlus className="w-4 h-4" />
                    <span>Invite User</span>
                </Button>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <div className="flex items-center justify-between gap-4 pb-5 border-b border-slate-100">
                    <div className="relative w-full max-w-xs">
                        <Input
                            type="text"
                            prefix={<Search className="w-4 h-4 text-slate-400" />}
                            size="large"
                            placeholder="Search users by name, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="!rounded-md"
                        />
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                        Total Users: {users.length}
                    </span>
                </div>

                <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400">
                                <th className="py-3">User</th>
                                <th className="py-3">Email</th>
                                <th className="py-3">Role</th>
                                <th className="py-3">Joined Date</th>
                                <th className="py-3">Status</th>
                                <th className="py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center">
                                        <Loading title="Loading platform users..." className="min-h-[180px]" />
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-slate-400">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-blue-50 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                                                    <Users className="w-4 h-4" />
                                                </div>
                                                <span className="font-semibold text-slate-800">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-slate-500">{user.email}</td>
                                        <td className="py-4">{getRoleBadge(user.roleName || user.role)}</td>
                                        <td className="py-4 text-slate-500 text-xs">{user.joinedDate || "Recent"}</td>
                                        <td className="py-4">{getStatusBadge(user.status)}</td>
                                        <td className="py-4 text-right">
                                            <Dropdown
                                                menu={{ items: getDropdownItems(user) }}
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

            {/* Create/Invite User Modal */}
            <Modal
                title={<span className="text-lg font-bold text-[#0c1b3a]">Invite / Create New User</span>}
                open={isCreateOpen}
                onCancel={() => setIsCreateOpen(false)}
                footer={null}
                centered
            >
                <Form form={createForm} layout="vertical" onFinish={handleCreateUser} className="mt-4">
                    <FormField
                        type="text"
                        name="name"
                        label="Full Name"
                        placeholder="e.g. Jane Doe"
                        required
                        rules={[{ required: true, message: "Full Name is required" }]}
                        colorClass="!rounded-md"
                        className="!mb-3.5"
                    />

                    <FormField
                        type="email"
                        name="email"
                        label="Email Address"
                        placeholder="user@example.com"
                        required
                        rules={[{ required: true, type: "email", message: "Valid email is required" }]}
                        colorClass="!rounded-md"
                        className="!mb-3.5"
                    />

                    <FormField
                        type="select"
                        name="role"
                        label="Platform Role"
                        placeholder="Select role"
                        options={roleOptions}
                        required
                        rules={[{ required: true, message: "Role is required" }]}
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
                        label="Phone Number (Optional)"
                        placeholder="+8801700000000"
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
                            Create User
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Edit User Modal */}
            <Modal
                title={<span className="text-lg font-bold text-[#0c1b3a]">Edit User Account</span>}
                open={!!editingUser}
                onCancel={() => setEditingUser(null)}
                footer={null}
                centered
            >
                <Form form={editForm} layout="vertical" onFinish={handleUpdateUser} className="mt-4">
                    <FormField
                        type="text"
                        name="name"
                        label="Full Name"
                        placeholder="e.g. Jane Doe"
                        required
                        rules={[{ required: true, message: "Full Name is required" }]}
                        colorClass="!rounded-md"
                        className="!mb-3.5"
                    />

                    <FormField
                        type="email"
                        name="email"
                        label="Email Address"
                        placeholder="user@example.com"
                        required
                        rules={[{ required: true, type: "email", message: "Valid email is required" }]}
                        colorClass="!rounded-md"
                        className="!mb-3.5"
                    />

                    <FormField
                        type="select"
                        name="role"
                        label="Platform Role"
                        placeholder="Select role"
                        options={roleOptions}
                        required
                        rules={[{ required: true, message: "Role is required" }]}
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
                        type="tel"
                        name="phoneNumber"
                        label="Phone Number"
                        placeholder="+8801700000000"
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
                        <Button onClick={() => setEditingUser(null)} className="!rounded-md h-10 px-4">
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
                open={!!deletingUser}
                onCancel={() => setDeletingUser(null)}
                onConfirm={handleDeleteUser}
                loading={isDeleting}
                title="Delete User"
                description={
                    deletingUser ? (
                        <span>
                            Are you sure you want to delete <strong>{deletingUser.name}</strong> ({deletingUser.email})? This action cannot be undone.
                        </span>
                    ) : null
                }
                confirmText="Delete User"
            />
        </div>
    );
}
