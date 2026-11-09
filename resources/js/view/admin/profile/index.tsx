import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store.js";
import DashboardTitle from "../../../Components/reuseable/dashboard-title/index.js";
import ViewProfile from "../../common/profile/index.js";
import { useGetMyProfileQuery } from "../../../redux/features/user/index.js";
import Loading from "../../../Components/reuseable/loading/index.js";

export default function Profile() {
    const { user: authUser } = useSelector((state: RootState) => state.auth);
    const { data, isLoading } = useGetMyProfileQuery();

    const fetchedUser = (data as any)?.results || (data as any)?.data || data;
    const userData = (fetchedUser || authUser || {}) as any;

    if (isLoading && !fetchedUser && !authUser) {
        return <Loading title="Loading profile..." />;
    }

    return (
        <div>
            <DashboardTitle
                title="My Profile"
                subtitle="View and manage your account details and business role"
            />
            <ViewProfile userData={userData} />
        </div>
    );
}
