import {
    Package,
    DollarSign,
    TriangleAlert,
    ShoppingCart,
    TrendingUp,
} from "lucide-react";
import { SalesSummary, StatCard } from '../../../Components/reuseable/common-card/index.js';
import { useGetAdminStatsQuery } from "../../../redux/features/dashboard/index.js";
import LowStockTable from "../../../Components/dashboard/low-stock-table/index.js";
import Loading from "../../../Components/reuseable/loading/index.js";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store.js";


export default function Dashboard() {
    const { data, isLoading, error } = useGetAdminStatsQuery();
    const { user } = useSelector((state: RootState) => state.auth);
    const stats = data?.data;

    if (isLoading) {
        return <Loading title="Loading Dashboard..." />;
    }

    if (error) {
        return <div>Something went wrong.</div>;
    }

    return (
        <div>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome Back, {user?.fullName}
                        </h1>

                        <p className="mt-1 text-gray-500">
                            Inventory & Sales Overview
                        </p>
                    </div>
                    {
                        user?.role !== "employee" && <div className="md:text-right">
                            <p className="text-sm text-gray-500">
                                Tuesday
                            </p>

                            <h3 className="font-semibold">
                                July 07, 2026
                            </h3>
                        </div>
                    }

                </div>

                {/* Stats */}
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <StatCard
                        title="Products"
                        amount={stats?.totalProducts ?? 0}
                        icon={<Package className="w-6 h-6 text-blue-600" />}
                    />
                    {
                        user?.role !== "employee" && <StatCard
                            title="Sales"
                            amount={stats?.totalSales ?? 0}
                            icon={<DollarSign className="w-6 h-6 text-green-600" />}
                        />
                    }


                    <StatCard
                        title="Low Stock"
                        amount={stats?.lowStockProducts ?? 0}
                        icon={<TriangleAlert className="w-6 h-6 text-orange-500" />}
                    />
                </div>

                {/* Tables */}
                <div className="grid gap-6 xl:grid-cols-3">
                    <div className="xl:col-span-2">
                        <LowStockTable products={stats?.recentProducts || []} />
                    </div>
                    {
                        user?.role !== "employee" && <SalesSummary totalRevenue={stats?.totalRevenue ?? 0} />
                    }
                </div>

            </div>
        </div>
    );
}
