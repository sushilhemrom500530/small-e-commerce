import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: fetchBaseQuery({
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
    }),
    tagTypes: ["auth", "product", "shop", "shopProduct", "catalog", "category", "shopOwner", "storefront", "user", "dashboard", "sales"],
    endpoints: () => ({}),
});

