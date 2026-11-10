import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export interface IPaginationMeta {
    currentPage?: number;
    limit?: number;
    totalResult?: number;
    totalPages?: number;
}

export interface PaginationProps {
    /** Pagination meta object returned by backend, if available */
    meta?: IPaginationMeta | null;
    /** Current active page (1-based index) */
    currentPage?: number;
    /** Total number of pages */
    totalPages?: number;
    /** Total number of items across all pages */
    totalResult?: number;
    /** Number of items per page */
    limit?: number;
    /** Page change callback */
    onPageChange: (page: number) => void;
    /** Optional container class */
    className?: string;
    /** Whether to show "Showing X to Y of Z items" text */
    showTotal?: boolean;
    /** Custom noun for item count (e.g. "products", "shops", "orders") */
    itemName?: string;
}

export default function Pagination({
    meta,
    currentPage: propCurrentPage,
    totalPages: propTotalPages,
    totalResult: propTotalResult,
    limit: propLimit,
    onPageChange,
    className = "",
    showTotal = true,
    itemName = "results",
}: PaginationProps) {
    const currentPage = meta?.currentPage ?? propCurrentPage ?? 1;
    const limit = meta?.limit ?? propLimit ?? 10;
    const totalResult = meta?.totalResult ?? propTotalResult ?? 0;
    const totalPages =
        meta?.totalPages ??
        propTotalPages ??
        (totalResult > 0 ? Math.ceil(totalResult / limit) : 1);

    // If 1 or fewer pages and no more than 10 total results, omit or show nothing
    if (totalPages <= 1 && totalResult <= 10) {
        return null;
    }

    const fromItem = totalResult > 0 ? (currentPage - 1) * limit + 1 : 0;
    const toItem = totalResult > 0 ? Math.min(currentPage * limit, totalResult) : 0;

    const handlePageClick = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        onPageChange(page);
    };

    /**
     * Build page pills with smart ellipsis window.
     */
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible + 2) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }

        // Always show page 1
        pages.push(1);

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        if (start > 2) {
            pages.push("...");
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages - 1) {
            pages.push("...");
        }

        // Always show last page
        pages.push(totalPages);

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div
            className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 select-none ${className}`}
            aria-label="Pagination"
        >
            {/* Left: Summary text */}
            {showTotal && (
                <div className="text-xs sm:text-sm text-slate-500 font-medium text-center sm:text-left">
                    {totalResult > 0 ? (
                        <>
                            Showing <span className="font-semibold text-slate-800">{fromItem}</span> to{" "}
                            <span className="font-semibold text-slate-800">{toItem}</span> of{" "}
                            <span className="font-semibold text-slate-800">{totalResult}</span> {itemName}
                        </>
                    ) : (
                        <>
                            Page <span className="font-semibold text-slate-800">{currentPage}</span> of{" "}
                            <span className="font-semibold text-slate-800">{totalPages}</span>
                        </>
                    )}
                </div>
            )}

            {/* Right: Controls & Page Pills */}
            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">
                {/* First Page (desktop only) */}
                <button
                    type="button"
                    onClick={() => handlePageClick(1)}
                    disabled={currentPage <= 1}
                    aria-label="First page"
                    title="First page"
                    className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                    <ChevronsLeft className="w-4 h-4" />
                </button>

                {/* Previous Page */}
                <button
                    type="button"
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage <= 1}
                    aria-label="Previous page"
                    title="Previous page"
                    className="inline-flex items-center justify-center px-2.5 sm:px-3 h-8 rounded-lg text-xs font-semibold text-slate-600 hover:text-primary hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer gap-1"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden xs:inline">Prev</span>
                </button>

                {/* Mobile compact current page indicator */}
                <span className="sm:hidden text-xs font-semibold text-slate-700 px-2 py-1 bg-slate-100 rounded-lg">
                    {currentPage} / {totalPages}
                </span>

                {/* Desktop Numeric Pills */}
                <div className="hidden sm:flex items-center gap-1">
                    {pages.map((p, idx) => {
                        if (typeof p === "string") {
                            return (
                                <span
                                    key={`ellipsis-${idx}`}
                                    className="w-8 h-8 flex items-center justify-center text-xs text-slate-400 font-semibold"
                                >
                                    …
                                </span>
                            );
                        }

                        const isActive = p === currentPage;
                        return (
                            <button
                                key={p}
                                type="button"
                                onClick={() => handlePageClick(p)}
                                aria-current={isActive ? "page" : undefined}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    isActive
                                        ? "bg-primary text-white shadow-xs"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-primary"
                                }`}
                            >
                                {p}
                            </button>
                        );
                    })}
                </div>

                {/* Next Page */}
                <button
                    type="button"
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    aria-label="Next page"
                    title="Next page"
                    className="inline-flex items-center justify-center px-2.5 sm:px-3 h-8 rounded-lg text-xs font-semibold text-slate-600 hover:text-primary hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer gap-1"
                >
                    <span className="hidden xs:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                </button>

                {/* Last Page (desktop only) */}
                <button
                    type="button"
                    onClick={() => handlePageClick(totalPages)}
                    disabled={currentPage >= totalPages}
                    aria-label="Last page"
                    title="Last page"
                    className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                    <ChevronsRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

