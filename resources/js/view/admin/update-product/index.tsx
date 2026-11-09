import { Button } from "antd";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardTitle from "../../../Components/reuseable/dashboard-title/index.js";
import UpdateProductContent from "../../common/update-product/index.js";

export default function UpdateProduct() {
    const navigate = useNavigate();
    const { id } = useParams();

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
                    title="Update Product"
                    subtitle="Update product for your inventory"
                />
            </div>

            <UpdateProductContent id={id as string} />
        </div>
    );
}