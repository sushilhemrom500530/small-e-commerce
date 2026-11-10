import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { message } from "antd";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || import.meta.env.VITE_PUBLIC_URL || "/api/v1",
    credentials: "include",
    prepareHeaders: (headers: any) => {
        const token =
            Cookies.get("token") ||
            Cookies.get("authToken") ||
            (typeof window !== "undefined"
                ? localStorage.getItem("token") || localStorage.getItem("authToken")
                : null);
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithToast: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error) {
        if (result.error.status === 401) {
            Cookies.remove("token", { path: "/" });
            Cookies.remove("authToken", { path: "/" });
            Cookies.remove("token");
            Cookies.remove("authToken");
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                localStorage.removeItem("authToken");
                localStorage.removeItem("user");
                if (
                    window.location.pathname.startsWith("/admin") ||
                    window.location.pathname.startsWith("/shop-owner") ||
                    window.location.pathname.startsWith("/manager") ||
                    window.location.pathname.startsWith("/dashboard")
                ) {
                    window.location.href = "/auth/login";
                }
            }
        }

        const errorData = result.error.data as any;
        let errorMessage = "An unexpected error occurred. Please try again.";

        if (errorData?.message) {
            errorMessage = errorData.message;
        } else if (Array.isArray(errorData?.errorMessages) && errorData.errorMessages.length > 0) {
            errorMessage = errorData.errorMessages.map((e: any) => e.message || e).join(", ");
        } else if (typeof errorData === "string") {
            errorMessage = errorData;
        } else if (result.error.status === "FETCH_ERROR") {
            errorMessage = "Server connection error. Please check your network or server status.";
        } else if (result.error.status === "TIMEOUT_ERROR") {
            errorMessage = "Request timed out. Please try again.";
        } else if (result.error.status === 404) {
            errorMessage = "Requested resource was not found.";
        } else if (result.error.status === 403) {
            errorMessage = "You do not have permission to perform this action.";
        } else if (result.error.status === 500) {
            errorMessage = "Internal server error. Please try again later.";
        }

        // Avoid duplicate spamming by using a unique key per message
        message.error({
            content: errorMessage,
            key: `api-error-${errorMessage}`,
            duration: 4,
        });
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQueryWithToast,
    tagTypes: ["auth", "product", "shop", "shopProduct", "catalog", "category", "shopOwner", "storefront", "user", "dashboard", "sales", "order"],
    endpoints: () => ({}),
});
