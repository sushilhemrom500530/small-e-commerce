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
    maxHeight = "90vh",
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
            style={{ top: "3vh", maxHeight }}
            styles={{
                content: {
                    maxHeight,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "1rem",
                    padding: "1.25rem 1.5rem",
                },
                body: {
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    maxHeight: `calc(${maxHeight} - 85px)`,
                },
            }}
        >
            <div className="flex flex-col h-full max-h-[calc(90vh-95px)] min-h-0">
                {description && (
                    <div className="text-xs text-slate-500 mb-3 shrink-0">
                        {description}
                    </div>
                )}

                {/* Scrollable Children Body */}
                <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 min-h-0">
                    {children}
                </div>

                {/* Pinned Sticky Footer if provided */}
                {footer && (
                    <div className="sticky bottom-0 bg-white pt-3 pb-1 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 mt-3 z-10">
                        {footer}
                    </div>
                )}
            </div>
        </Modal>
    );
}

