import React from 'react';
import { Button } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardTitle from '../../../Components/reuseable/dashboard-title/index.js';
import CreateSalesContent from '../../common/create-sales/index.js';

export default function CreateSales() {
    const navigate = useNavigate();

    return (
        <div className="space-y-6 max-w-full">
            <DashboardTitle
                title="Create New Sale"
                subtitle="Create a sales order by selecting one or more products."
            />
            <CreateSalesContent />
        </div>
    );
}