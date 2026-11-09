import React from "react";
import { Mail, Shield, User, Calendar, CheckCircle2, AlertCircle } from "lucide-react";

type UserRole = "supplier" | "import" | "export" | "logistic" | string;
type UserStatus = "active" | "inactive" | "pending" | string;

interface UserProfileProps {
    userData: {
        _id?: any;
        fullName: string;
        email: string;
        role?: UserRole;
        profileUrl?: string;
        status?: UserStatus;
        createdAt?: Date | string;
        updatedAt?: Date | string;
    };
}

export default function ViewProfile({ userData }: UserProfileProps) {
    const {
        fullName,
        email,
        role = "User",
        profileUrl,
        status = "active",
        createdAt,
    } = userData || {};

    const getStatusBadge = (status: UserStatus) => {
        switch (status?.toLowerCase()) {
            case "active":
                return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "inactive":
                return "bg-rose-50 text-rose-700 border-rose-100";
            default:
                return "bg-amber-50 text-amber-700 border-amber-100";
        }
    };

    const formatDate = (dateString?: Date | string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="h-40 w-full bg-secondary/10 border-b border-gray-100" />
                <div className="px-6 md:px-8 pb-8 relative -mt-14">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 justify-between">

                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">

                            <div className="w-28 h-28 rounded-xl border-4 border-white bg-gray-100 shadow-sm overflow-hidden flex items-center justify-center text-gray-400">
                                {profileUrl ? (
                                    <img
                                        src={profileUrl}
                                        alt={fullName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-12 h-12 text-gray-300" />
                                )}
                            </div>

                            <div className="mb-1">
                                <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">{fullName}</h2>
                                <p className="text-sm font-medium text-gray-500 mt-0.5 capitalize">
                                    {role} Account
                                </p>
                            </div>
                        </div>

                        <div className="mb-1">
                            <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border capitalize ${getStatusBadge(
                                    status
                                )}`}
                            >
                                {status === "active" ? (
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                    <AlertCircle className="w-3.5 h-3.5" />
                                )}
                                {status}
                            </span>
                        </div>
                    </div>

                    <div className="mt-10 border-t border-gray-100 pt-8">
                        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-6">
                            Account Information
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">

                            <div className="flex items-start gap-3.5">
                                <div className="p-2 bg-gray-50 rounded-lg text-gray-400 mt-0.5">
                                    <User className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="block text-xs font-medium text-gray-400">Full Name</span>
                                    <span className="block text-base font-medium text-gray-900 mt-0.5">{fullName}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5">
                                <div className="p-2 bg-gray-50 rounded-lg text-gray-400 mt-0.5">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div className="break-all">
                                    <span className="block text-xs font-medium text-gray-400">Email Address</span>
                                    <span className="block text-base font-medium text-gray-900 mt-0.5">{email}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5">
                                <div className="p-2 bg-gray-50 rounded-lg text-gray-400 mt-0.5">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="block text-xs font-medium text-gray-400">Business Role</span>
                                    <span className="block text-base font-medium text-gray-900 mt-0.5 capitalize">{role}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5">
                                <div className="p-2 bg-gray-50 rounded-lg text-gray-400 mt-0.5">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="block text-xs font-medium text-gray-400">Member Since</span>
                                    <span className="block text-base font-medium text-gray-900 mt-0.5">{formatDate(createdAt)}</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}