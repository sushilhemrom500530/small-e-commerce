import { baseApi } from "../../api/index.js";

export const metaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminStats: builder.query<any, void>({
            query: () => ({
                url: "/meta/stats",
                method: "GET",
            }),
            providesTags: ["dashboard"],
        }),
    }),
});

export const { useGetAdminStatsQuery } = metaApi;