import React from "react";
import { Modal, Button } from "antd";
import { Trash2, Package } from "lucide-react";

export interface DeleteConfirmModalProps {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void | Promise<void>;
    loading?: boolean;
    title?: string;
    description?: React.ReactNode;
    itemPreview?: {
        name: string;
        thumbnail?: string | null;
        subtitle?: string | null;
    };
    note?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    icon?: React.ReactNode;
}

export default function DeleteConfirmModal({
    open,
    onCancel,
    onConfirm,
    loading = false,
    title = "Confirm Deletion",
    description = "Are you sure you want to proceed with this action? This cannot be undone.",
    itemPreview,
    note,
    confirmText = "Yes, Delete",
    cancelText = "Cancel",
    icon,
}: DeleteConfirmModalProps) {
    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            centered
            width="min(460px, 95vw)"
            styles={{
                content: {
                    borderRadius: "1rem",
                    padding: "1.5rem",
                },
            }}
        >
            <div className="flex flex-col items-center text-center">
                {/* Warning Icon Badge */}
                <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-3.5 shadow-2xs shrink-0">
                    {icon || <Trash2 className="w-7 h-7" />}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#0c1b3a]">
                    {title}
                </h3>

                {/* Description */}
                <div className="text-sm text-slate-500 mt-2">
                    {description}
                </div>

                {/* Optional Item Preview Card */}
                {itemPreview && (
                    <div className="w-full mt-4 p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3 text-left">
                        <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                            {itemPreview.thumbnail ? (
                                <img
                                    src={itemPreview.thumbnail}
                                    alt={itemPreview.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Package className="w-5 h-5 text-slate-300" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="font-semibold text-slate-800 text-sm block truncate">
                                {itemPreview.name}
                            </span>
                            {itemPreview.subtitle && (
                                <span className="text-xs font-bold text-primary block mt-0.5">
                                    {itemPreview.subtitle}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Optional Notice Box */}
                {note && (
                    <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-800 text-left mt-3 w-full">
                        ℹ️ <strong>Note:</strong> {note}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 w-full mt-6">
                    <Button
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-xl h-10 px-5 font-medium text-slate-600 hover:text-slate-800 flex-1"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="primary"
                        danger
                        loading={loading}
                        onClick={onConfirm}
                        className="rounded-xl h-10 px-5 font-semibold flex-1 shadow-xs"
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
