import { Table, Input, Select, Button, Space, Tooltip, ConfigProvider, Modal, message, Descriptions } from 'antd';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useDeleteProductMutation, useGetProductsQuery } from '../../../redux/features/product/index.js';
import Loading from '../../../Components/reuseable/loading/index.js';
import { Link } from 'react-router-dom';
import ProductDetails from './view/index.js';
import type { RootState } from '../../../redux/store.js';
import { useSelector } from 'react-redux';

export default function ProductsContent() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("");

    const { user } = useSelector((state: RootState) => state.auth);

    const { data, isLoading } = useGetProductsQuery({
        page,
        limit,
        searchTerm,
        category,
    });
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [viewOpen, setViewOpen] = useState(false);

    const [deleteProduct, { isLoading: deleting }] =
        useDeleteProductMutation();


    const productData = data?.data?.results || [];
    const meta = data?.data?.meta;

    if (isLoading) {
        return <Loading title="Loading Products..." />
    }

    const handleView = (product: any) => {
        setSelectedProduct(product);
        setViewOpen(true);
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "Delete Product",
            content:
                "Are you sure you want to delete this product? This action cannot be undone.",
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",
            centered: true,

            async onOk() {
                try {
                    const res = await deleteProduct(id).unwrap();

                    message.success(res.message);
                } catch (error: any) {
                    message.error(
                        error?.data?.message || "Failed to delete product."
                    );
                }
            },
        });
    };


    const columns = [
        {
            title: 'Image',
            dataIndex: 'productImage',
            key: 'image',
            render: (img: string) => (
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                    <img src={img} alt="product" className="object-cover w-full h-full" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/40' }} />
                </div>
            )
        },
        {
            title: 'Product',
            dataIndex: 'productName',
            key: 'productName',
            className: 'font-medium text-gray-900'
        },
        {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
            className: 'text-gray-500 text-sm'
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category'
        },
        {
            title: 'Buy',
            dataIndex: 'purchasePrice',
            key: 'buy',
            render: (val: number) => `$${val}`
        },
        {
            title: 'Sell',
            dataIndex: 'sellingPrice',
            key: 'sell',
            render: (val: number) => `$${val}`
        },
        {
            title: 'Stock',
            dataIndex: 'stockQuantity',
            key: 'stock',
            render: (val: number) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${val < 15 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {val}
                </span>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space size="small">
                    <Tooltip title="View">
                        <Button
                            type="text"
                            size="small"
                            icon={<Eye className="w-4 h-4 text-blue-600" />}
                            onClick={() => handleView(record)}
                        />
                    </Tooltip>

                    {
                        user?.role !== "employee" &&
                        <>
                            <Link to={`/admin/dashboard/product/update/${record._id}`}>
                                <Tooltip title="Edit">
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<Edit className="w-4 h-4 text-amber-600" />}
                                    />
                                </Tooltip>
                            </Link>

                            <Tooltip title="Delete">
                                <Button
                                    type="text"
                                    danger
                                    size="small"
                                    onClick={() => handleDelete(record._id)}
                                    icon={<Trash2 className="w-4 h-4 text-red-600" />}
                                />
                            </Tooltip>
                        </>
                    }
                </Space>
            )
        }
    ];


    return (
        <>
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <Input
                    placeholder="Search Product..."
                    prefix={<Search className="w-4 h-4 text-gray-400" />}
                    className="max-w-md h-10"
                    allowClear
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                    }}
                />

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Select
                        defaultValue="all"
                        className="w-full sm:w-40 h-10 [&>.ant-select-selector]:!h-10 [&>.ant-select-selector]:!items-center"
                        options={[
                            { value: 'all', label: 'All Categories' },
                            { value: 'smartphones', label: 'Smartphones' },
                            { value: 'laptops', label: 'Laptops' },
                            { value: 'accessories', label: 'Accessories' }
                        ]}
                    />
                    <Select
                        defaultValue="all"
                        className="w-full sm:w-40 h-10 [&>.ant-select-selector]:!h-10 [&>.ant-select-selector]:!items-center"
                        options={[
                            { value: 'all', label: 'All Status' },
                            { value: 'in-stock', label: 'In Stock' },
                            { value: 'low-stock', label: 'Low Stock' },
                            { value: 'out-of-stock', label: 'Out of Stock' }
                        ]}
                    />
                </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <ConfigProvider
                    theme={{
                        components: {
                            Table: {
                                headerBg: '#f8fafc',
                                headerColor: '#475569',
                                rowHoverBg: '#f1f5f9',
                            },
                        },
                    }}
                >
                    <Table
                        columns={columns}
                        dataSource={productData}
                        rowKey="_id"
                        pagination={{
                            current: meta?.currentPage ?? 1,
                            pageSize: meta?.limit ?? 10,
                            total: meta?.totalResult ?? 0,
                            showSizeChanger: true,
                            hideOnSinglePage: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} products`,
                            className: "px-6 pt-4 pb-2",
                            onChange: (page, pageSize) => {
                                setPage(page);
                                setLimit(pageSize);
                            },
                        }}
                        className="w-full"
                        scroll={{ x: "max-content" }}
                    />
                </ConfigProvider>
            </div>

            <Modal
                title="Product Details"
                open={viewOpen}
                footer={null}
                onCancel={() => setViewOpen(false)}
                width={700}
            >
                {selectedProduct && (
                    <ProductDetails selectedProduct={selectedProduct} />
                )}
            </Modal>
        </>
    )
}