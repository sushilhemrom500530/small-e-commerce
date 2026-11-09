import { Button } from 'antd';
import { Plus } from 'lucide-react';
import ProductsContent from '../../common/products/index.js';
import DashboardTitle from '../../../Components/reuseable/dashboard-title/index.js';
import { Link } from 'react-router-dom';

export default function Products() {

    return (
        <div className="space-y-6 max-w-full">
            <DashboardTitle
                title="Products"
                subtitle="Manage your inventory products"
            >
                <Link to='/manager/dashboard/product/add' >
                    <Button type="primary" className="!bg-secondary hover:!bg-secondary/90 h-10 px-4 font-medium flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Add Product
                    </Button>
                </Link>
            </DashboardTitle>

            <ProductsContent />

        </div>
    );
}