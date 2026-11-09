import { useState } from "react";
import { UserPlus, Search, Shield, MoreVertical } from "lucide-react";
import { Button } from "antd";

interface UserItem {
    id: number;
    name: string;
    email: string;
    role: "Admin" | "Shop Owner" | "Customer";
    joinedDate: string;
    status: "Active" | "Inactive";
}

const initialUsers: UserItem[] = [
    { id: 1, name: "Admin", email: "admin@example.com", role: "Admin", joinedDate: "Jan 01, 2026", status: "Active" },
    { id: 2, name: "John Doe", email: "john@techworld.com", role: "Shop Owner", joinedDate: "Jan 12, 2026", status: "Active" },
    { id: 3, name: "Sarah Khan", email: "sarah@fashionhub.com", role: "Shop Owner", joinedDate: "Feb 05, 2026", status: "Active" },
    { id: 4, name: "Alice Brown", email: "alice@gmail.com", role: "Customer", joinedDate: "Feb 15, 2026", status: "Active" },
    { id: 5, name: "Bob Smith", email: "bob@gmail.com", role: "Customer", joinedDate: "Mar 02, 2026", status: "Active" },
];

export default function UsersManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [users] = useState<UserItem[]>(initialUsers);

    const filtered = users.filter(
        (u) =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    className="!bg-[#4353ff] hover:!bg-[#3234a8] !rounded-xl !h-10 !px-4 !font-semibold !flex !items-center !gap-2 !border-none !text-white w-fit cursor-pointer"
                >
                    <UserPlus className="w-4 h-4" />
                    <span>Invite User</span>
                </Button>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
                <div className="relative w-full max-w-xs pb-5 border-b border-slate-100">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl placeholder-slate-400 text-slate-700 focus:outline-none focus:border-[#4353ff]"
                    />
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
                            {filtered.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="py-4 font-semibold text-slate-800">{user.name}</td>
                                    <td className="py-4 text-slate-500">{user.email}</td>
                                    <td className="py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            user.role === "Admin"
                                                ? "bg-purple-50 text-purple-700"
                                                : user.role === "Shop Owner"
                                                ? "bg-blue-50 text-blue-700"
                                                : "bg-slate-100 text-slate-700"
                                        }`}>
                                            <Shield className="w-3 h-3" />
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4 text-slate-500">{user.joinedDate}</td>
                                    <td className="py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

