import React from 'react';
import { Button } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardTitle from '../../../Components/reuseable/dashboard-title/index.js';
import AddProductContent from '../../common/add-product/index.js';

export default function AddProduct() {
    const navigate = useNavigate();

    return (
        <div className="space-y-6 max-w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Button
                    type="text"
                    icon={<ArrowLeft className="w-5 h-5 text-gray-600" />}
                    onClick={() => navigate(-1)}
                    className="hover:bg-gray-100 flex items-center justify-center w-10 h-10 -ml-2"
                />
                <DashboardTitle
                    title="Add New Product"
                    subtitle="Create a new product for your inventory"
                />
            </div>

            <AddProductContent />
        </div>
    );
}