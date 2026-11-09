import DashboardTitle from "../../../Components/reuseable/dashboard-title/index.js";
import ViewProfile from "../../common/profile/index.js";
import { useGetMyProfileQuery } from "../../../redux/features/user/index.js";
import type { IUser } from "../../../types/user/index.js";
import Loading from "../../../Components/reuseable/loading/index.js";

export default function Profile() {
    const { data, isLoading } = useGetMyProfileQuery();
    const userData = data?.data as IUser;

    if (isLoading) {
        return <Loading title="Loading profile..." />
    }

    return (
        <div>
            <DashboardTitle
                title="My Profile"
                subtitle="View and manage your account details and business role"
            />
            <ViewProfile userData={userData ?? {}} />
        </div>
    )
}