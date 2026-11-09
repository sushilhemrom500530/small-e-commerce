import { useNavigate } from 'react-router-dom';
import DashboardTitle from '../../../Components/reuseable/dashboard-title/index.js';
import CreateSalesContent from '../../common/create-sales/index.js';

export default function ViewSalesHistory() {
    return (
        <div className="space-y-6 max-w-full">
            <DashboardTitle
                title="Sales History"
                subtitle="View sales history by selecting one or more products."
            />
            <CreateSalesContent />
        </div>
    );
}