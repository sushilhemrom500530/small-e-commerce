import React from 'react';

interface LowStockTableProps {
    products?: Array<{
        _id?: string;
        id?: string;
        productName?: string;
        name?: string;
        sku?: string;
        stockQuantity?: number;
        stock?: number;
        sellingPrice?: number;
        price?: number;
        category?: string;
    }>;
}

export default function LowStockTable({ products = [] }: LowStockTableProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alert</h2>
            {products.length === 0 ? (
                <p className="text-gray-500 text-sm">No low stock items found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="px-4 py-3">Product</th>
                                <th className="px-4 py-3">SKU</th>
                                <th className="px-4 py-3">Remaining Stock</th>
                                <th className="px-4 py-3">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((item, idx) => (
                                <tr key={item._id || item.id || idx} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{item.productName || item.name}</td>
                                    <td className="px-4 py-3">{item.sku || 'N/A'}</td>
                                    <td className="px-4 py-3 text-red-600 font-semibold">{item.stockQuantity ?? item.stock ?? 0}</td>
                                    <td className="px-4 py-3">${item.sellingPrice ?? item.price ?? 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

