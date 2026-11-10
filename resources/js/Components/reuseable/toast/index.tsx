import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { message as antdMessage } from "antd";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
    id: string;
    type: ToastType;
    message: string;
    description?: string;
    duration?: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

class ToastManager {
    private toasts: ToastItem[] = [];
    private listeners: Set<ToastListener> = new Set();
    private isDispatchingInternally = false;

    private notify() {
        this.listeners.forEach((listener) => {
            try {
                listener([...this.toasts]);
            } catch (err) {
                console.error("Toast listener error:", err);
            }
        });
    }

    public subscribe(listener: ToastListener) {
        this.listeners.add(listener);
        listener([...this.toasts]);
        return () => {
            this.listeners.delete(listener);
        };
    }

    public show(type: ToastType, messageText: string, description?: string, duration = 3500) {
        if (!messageText || typeof messageText !== "string") {
            messageText = String(messageText || "");
        }

        const id = Math.random().toString(36).substring(2, 9);
        const newToast: ToastItem = { id, type, message: messageText, description, duration };

        // Keep maximum 4 concurrent toasts
        this.toasts = [...this.toasts.slice(-3), newToast];
        this.notify();

        if (duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration);
        }

        return id;
    }

    public success(messageText: string, description?: string, duration = 3500) {
        return this.show("success", messageText, description, duration);
    }

    public error(messageText: string, description?: string, duration = 4500) {
        return this.show("error", messageText, description, duration);
    }

    public info(messageText: string, description?: string, duration = 3500) {
        return this.show("info", messageText, description, duration);
    }

    public warning(messageText: string, description?: string, duration = 4000) {
        return this.show("warning", messageText, description, duration);
    }

    public remove(id: string) {
        this.toasts = this.toasts.filter((t) => t.id !== id);
        this.notify();
    }

    public clear() {
        this.toasts = [];
        this.notify();
    }
}

export const toast = new ToastManager();

// Parse content from string or Ant Design message config object
const parseMessageContent = (content: any): { message: string; description?: string } => {
    if (!content) return { message: "" };
    if (typeof content === "string") return { message: content };
    if (typeof content === "object") {
        const msg = content.content || content.message || content.title || "";
        const desc = content.description;
        return { message: String(msg), description: desc ? String(desc) : undefined };
    }
    return { message: String(content) };
};

// Safe bridge to Ant Design's static message:
// Whenever ANY component in the codebase calls message.success() / message.error(),
// it will automatically trigger the custom persistent toast!
if (typeof window !== "undefined") {
    try {
        const originalSuccess = antdMessage.success.bind(antdMessage);
        const originalError = antdMessage.error.bind(antdMessage);
        const originalWarning = antdMessage.warning.bind(antdMessage);
        const originalInfo = antdMessage.info.bind(antdMessage);

        (antdMessage as any).success = (content: any, duration?: number, onClose?: any) => {
            const { message: msgText, description } = parseMessageContent(content);
            if (msgText) {
                toast.success(msgText, description, duration ? duration * 1000 : 3500);
            }
            try {
                return originalSuccess(content, duration, onClose);
            } catch {
                return () => { };
            }
        };

        (antdMessage as any).error = (content: any, duration?: number, onClose?: any) => {
            const { message: msgText, description } = parseMessageContent(content);
            if (msgText) {
                toast.error(msgText, description, duration ? duration * 1000 : 4500);
            }
            try {
                return originalError(content, duration, onClose);
            } catch {
                return () => { };
            }
        };

        (antdMessage as any).warning = (content: any, duration?: number, onClose?: any) => {
            const { message: msgText, description } = parseMessageContent(content);
            if (msgText) {
                toast.warning(msgText, description, duration ? duration * 1000 : 4000);
            }
            try {
                return originalWarning(content, duration, onClose);
            } catch {
                return () => { };
            }
        };

        (antdMessage as any).info = (content: any, duration?: number, onClose?: any) => {
            const { message: msgText, description } = parseMessageContent(content);
            if (msgText) {
                toast.info(msgText, description, duration ? duration * 1000 : 3500);
            }
            try {
                return originalInfo(content, duration, onClose);
            } catch {
                return () => { };
            }
        };
    } catch (e) {
        console.warn("Could not attach toast bridge to antd message:", e);
    }
}

export function ToastContainer() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    useEffect(() => {
        return toast.subscribe((updated) => {
            setToasts(updated);
        });
    }, []);

    if (toasts.length === 0) return null;

    return (
        <aside
            aria-live="polite"
            aria-label="Notifications"
            className="fixed top-5 right-5 z-[9999999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none px-4 sm:px-0"
        >
            {toasts.map((item) => {
                const isSuccess = item.type === "success";
                const isError = item.type === "error";
                const isWarning = item.type === "warning";

                const borderColor = isSuccess
                    ? "border-emerald-200"
                    : isError
                        ? "border-rose-200"
                        : isWarning
                            ? "border-amber-200"
                            : "border-blue-200";

                const iconBg = isSuccess
                    ? "bg-emerald-50 text-emerald-600"
                    : isError
                        ? "bg-rose-50 text-rose-600"
                        : isWarning
                            ? "bg-amber-50 text-amber-600"
                            : "bg-blue-50 text-blue-600";

                const badgeBg = isSuccess
                    ? "bg-emerald-500"
                    : isError
                        ? "bg-rose-500"
                        : isWarning
                            ? "bg-amber-500"
                            : "bg-blue-500";

                return (
                    <div
                        key={item.id}
                        role="alert"
                        className={`pointer-events-auto bg-white rounded-2xl border ${borderColor} shadow-2xl p-4 flex items-start gap-3.5 transition-all duration-300 animate-[toastSlideInRight_0.25s_ease-out] relative overflow-hidden`}
                    >
                        {/* Status Accent Bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${badgeBg}`} />

                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg} ml-1`}>
                            {isSuccess && <CheckCircle2 className="w-5 h-5" />}
                            {isError && <AlertCircle className="w-5 h-5" />}
                            {isWarning && <AlertTriangle className="w-5 h-5" />}
                            {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5" />}
                        </div>

                        <div className="flex-1 min-w-0 pt-0.5">
                            <p className="text-sm font-bold text-slate-800 leading-snug">
                                {item.message}
                            </p>
                            {item.description && (
                                <p className="text-xs text-slate-500 mt-1 leading-normal">
                                    {item.description}
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => toast.remove(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 -mr-1"
                            aria-label="Close notification"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                );
            })}
        </aside>
    );
}

export default toast;