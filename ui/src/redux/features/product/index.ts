import { baseApi } from "../../api/index.js";
import type { IProductListResponse, IProductQuery, IProductResponse } from "./interface.js";

export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<IProductListResponse, IProductQuery>({
            query: ({ page, limit, searchTerm, category }) => {
                const params: Record<string, string | number> = {};

                if (page) params.page = page;
                if (limit) params.limit = limit;
                if (searchTerm?.trim()) params.searchTerm = searchTerm.trim();
                if (category?.trim()) params.category = category.trim();

                return {
                    url: "/product/get-all",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["product"],
        }),

        getProduct: builder.query<IProductResponse, string>({
            query: (id) => ({
                url: `/product/find/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [
                { type: "product", id },
            ],
        }),

        createProduct: builder.mutation<IProductResponse, FormData>({
            query: (body) => ({
                url: "/product/create",
                method: "POST",
                body,
            }),
            invalidatesTags: ["product", "dashboard"],
        }),


        updateProduct: builder.mutation<
            IProductResponse,
            { id: string; body: FormData }
        >({
            query: ({ id, body }) => ({
                url: `/product/update/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "product", id },
                "product",
                "dashboard",
            ],
        }),

        deleteProduct: builder.mutation<
            {
                success: boolean;
                message: string;
            },
            string
        >({
            query: (id) => ({
                url: `/product/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["product", "dashboard"],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApi;