import React from "react";
import { Modal } from "antd";

export interface ResponsiveModalProps {
    open: boolean;
    onCancel: () => void;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    width?: string | number;
    maxHeight?: string;
    description?: React.ReactNode;
}

export default function ResponsiveModal({
    open,
    onCancel,
    title,
    subtitle,
    children,
    footer,
    width = "min(680px, 95vw)",
    maxHeight = "85vh",
    description,
}: ResponsiveModalProps) {
    return (
        <Modal
            title={
                <div className="pr-6">
                    <span className="text-lg font-bold text-[#0c1b3a] block">
                        {title}
                    </span>
                    {subtitle && (
                        <span className="text-xs text-slate-500 font-medium truncate block max-w-md mt-0.5">
                            {subtitle}
                        </span>
                    )}
                </div>
            }
            open={open}
            onCancel={onCancel}
            footer={null}
            centered
            width={width}
            style={{ maxWidth: "95vw" }}
            styles={{
                content: {
                    maxHeight: maxHeight || "85vh",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "1rem",
                    padding: "1.25rem 1.5rem",
                    overflow: "hidden",
                },
                header: {
                    flexShrink: 0,
                    marginBottom: "0.5rem",
                },
                body: {
                    flex: "1 1 auto",
                    minHeight: 0,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    padding: 0,
                },
            }}
        >
            <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                {description && (
                    <div className="text-xs text-slate-500 mb-3 shrink-0">
                        {description}
                    </div>
                )}

                {/* Scrollable Children Body */}
                <div className="flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-2 overscroll-contain">
                    {children}
                </div>

                {/* Pinned Fixed Footer */}
                {footer && (
                    <div className="shrink-0 pt-3 pb-1 mt-3 border-t border-slate-100 flex items-center justify-end gap-3 bg-white">
                        {footer}
                    </div>
                )}
            </div>
        </Modal>
    );
}

