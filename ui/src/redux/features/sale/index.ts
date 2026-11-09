import { baseApi } from "../../api/index.js";

export const saleApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createSale: builder.mutation<any, any>({
            query: (body) => ({
                url: "/sale/create",
                method: "POST",
                body,
            }),
            invalidatesTags: ["sales", "product", "dashboard"],
        }),
    }),
});

export const { useCreateSaleMutation } = saleApi;
