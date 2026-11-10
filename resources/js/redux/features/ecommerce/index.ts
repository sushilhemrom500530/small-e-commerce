import { baseApi } from "../../api/index.js";

export interface IShop {
    id: number;
    ownerId: number;
    name: string;
    slug: string;
    description?: string | null;
    logo?: string | null;
    status: "active" | "inactive";
    owner?: {
        id: number;
        name: string;
        email: string;
        phoneNumber?: string | null;
    };
    productsCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface ICatalogProduct {
    id: number;
    name: string;
    description?: string | null;
    thumbnail?: string | null;
    categoryId?: number | null;
    categoryName?: string | null;
    categorySlug?: string | null;
    createdBy?: number;
    creatorName?: string;
    creatorRole?: string;
    isAddedToCurrentShop?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface IShopProduct {
    id: number;
    shopId: number;
    productId: number;
    name: string;
    catalogDescription?: string | null;
    details?: string | null;
    effectiveDetails: string;
    price: number;
    formattedPrice?: string;
    thumbnail?: string | null;
    catalogThumbnail?: string | null;
    effectiveThumbnail: string;
    isActive: boolean;
    isCustomized?: boolean;
    category?: {
        id: number;
        name: string;
        slug: string;
    } | null;
    shop?: {
        id: number;
        name: string;
        slug: string;
    } | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IShopOwner {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string | null;
    status: string;
    shopName?: string | null;
    shopId?: number | null;
    shopSlug?: string | null;
    joinedDate?: string;
    createdAt?: string;
}

export interface ICategory {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    productsCount?: number;
}

export interface IOrder {
    id: number;
    orderId: string;
    orderNumber: string;
    customer: string;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    shippingAddress?: string;
    date: string;
    itemsCount: number;
    total: string;
    totalAmount: number;
    currency: string;
    status: "Pending" | "Processing" | "Delivered" | "Cancelled" | string;
    deliveredAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export const ecommerceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Admin: Shops
        getAdminShops: builder.query<{ results: IShop[] }, { search?: string; status?: string } | void>({
            query: (params) => ({
                url: "/admin/shops",
                method: "GET",
                params: params || {},
            }),
            providesTags: ["shop"],
        }),
        createAdminShop: builder.mutation<{ results: IShop }, Partial<IShop>>({
            query: (body) => ({
                url: "/admin/shops",
                method: "POST",
                body,
            }),
            invalidatesTags: ["shop", "storefront"],
        }),
        updateAdminShop: builder.mutation<{ results: IShop }, { id: number; body: Partial<IShop> }>({
            query: ({ id, body }) => ({
                url: `/admin/shops/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["shop", "storefront"],
        }),
        deleteAdminShop: builder.mutation<{ results: null }, number>({
            query: (id) => ({
                url: `/admin/shops/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["shop", "storefront"],
        }),

        // Admin: Shared Products Catalog
        getAdminProducts: builder.query<{ results: ICatalogProduct[] }, { search?: string; categoryId?: number } | void>({
            query: (params) => ({
                url: "/admin/products",
                method: "GET",
                params: params || {},
            }),
            providesTags: ["product", "catalog"],
        }),
        createAdminProduct: builder.mutation<{ results: ICatalogProduct }, Partial<ICatalogProduct>>({
            query: (body) => ({
                url: "/admin/products",
                method: "POST",
                body,
            }),
            invalidatesTags: ["product", "catalog"],
        }),
        updateAdminProduct: builder.mutation<{ results: ICatalogProduct }, { id: number; body: Partial<ICatalogProduct> }>({
            query: ({ id, body }) => ({
                url: `/admin/products/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["product", "catalog", "shopProduct", "storefront"],
        }),
        deleteAdminProduct: builder.mutation<{ results: null }, number>({
            query: (id) => ({
                url: `/admin/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["product", "catalog", "shopProduct", "storefront"],
        }),

        // Admin: Shop Owners
        getAdminShopOwners: builder.query<{ results: IShopOwner[] }, { search?: string } | void>({
            query: (params) => ({
                url: "/admin/shop-owners",
                method: "GET",
                params: params || {},
            }),
            providesTags: ["shopOwner"],
        }),
        createAdminShopOwner: builder.mutation<{ results: IShopOwner }, any>({
            query: (body) => ({
                url: "/admin/shop-owners",
                method: "POST",
                body,
            }),
            invalidatesTags: ["shopOwner", "shop"],
        }),

        // Shop Owner: Shared Catalog
        getShopCatalog: builder.query<{ results: ICatalogProduct[] }, { search?: string; categoryId?: number } | void>({
            query: (params) => ({
                url: "/shop/catalog",
                method: "GET",
                params: params || {},
            }),
            providesTags: ["catalog"],
        }),
        addCatalogToShop: builder.mutation<{ results: IShopProduct }, { productId: number; price?: number; details?: string; thumbnail?: string }>({
            query: ({ productId, ...body }) => ({
                url: `/shop/products/${productId}/add`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["catalog", "shopProduct", "storefront", "shop"],
        }),

        // Shop Owner: My Products
        getMyShopProducts: builder.query<{ results: IShopProduct[] }, { search?: string; categoryId?: number } | void>({
            query: (params) => ({
                url: "/shop/my-products",
                method: "GET",
                params: params || {},
            }),
            providesTags: ["shopProduct"],
        }),
        createShopProduct: builder.mutation<{ results: IShopProduct }, any>({
            query: (body) => ({
                url: "/shop/products",
                method: "POST",
                body,
            }),
            invalidatesTags: ["shopProduct", "catalog", "product", "storefront", "shop"],
        }),
        updateShopProduct: builder.mutation<{ results: IShopProduct }, { id: number; body: Partial<IShopProduct> & { categoryId?: number; name?: string } }>({
            query: ({ id, body }) => ({
                url: `/shop/products/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["shopProduct", "storefront", "catalog", "product", "shop"],
        }),
        deleteShopProduct: builder.mutation<{ results: null }, number>({
            query: (id) => ({
                url: `/shop/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["shopProduct", "catalog", "storefront", "shop"],
        }),

        // Shop Owner: My Shop Profile
        getMyShopProfile: builder.query<{ results: IShop }, void>({
            query: () => ({
                url: "/shop/my-shop",
                method: "GET",
            }),
            providesTags: ["shop"],
        }),
        updateMyShopProfile: builder.mutation<{ results: IShop }, Partial<IShop>>({
            query: (body) => ({
                url: "/shop/my-shop",
                method: "PUT",
                body,
            }),
            invalidatesTags: ["shop", "storefront"],
        }),

        // Public Categories
        getCategories: builder.query<{ results: ICategory[] }, void>({
            query: () => ({
                url: "/categories",
                method: "GET",
            }),
            providesTags: ["category"],
        }),

        // Customer Storefront
        getStoreShops: builder.query<{ results: IShop[] }, { search?: string } | void>({
            query: (params) => ({
                url: "/store/shops",
                method: "GET",
                params: params || {},
            }),
            providesTags: ["storefront"],
        }),
        getStoreShop: builder.query<{ results: IShop }, string>({
            query: (slug) => ({
                url: `/store/${slug}`,
                method: "GET",
            }),
            providesTags: ["storefront"],
        }),
        getStoreShopProducts: builder.query<{ results: IShopProduct[] }, { slug: string; search?: string; category?: string }>({
            query: ({ slug, ...params }) => ({
                url: `/store/${slug}/products`,
                method: "GET",
                params,
            }),
            providesTags: ["storefront"],
        }),
        getStoreProductDetail: builder.query<{ results: IShopProduct }, { slug: string; productId: string | number }>({
            query: ({ slug, productId }) => ({
                url: `/store/${slug}/products/${productId}`,
                method: "GET",
            }),
            providesTags: ["storefront"],
        }),

        // Shop Owner: Orders
        getShopOrders: builder.query<{ results: IOrder[] }, { search?: string; status?: string } | void>({
            query: (params) => ({
                url: "/shop/orders",
                method: "GET",
                params: params || {},
            }),
            providesTags: ["order"],
        }),
        updateOrderStatus: builder.mutation<{ results: IOrder }, { id: number; status: string }>({
            query: ({ id, status }) => ({
                url: `/shop/orders/${id}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["order"],
        }),
    }),
});

export const {
    useGetAdminShopsQuery,
    useCreateAdminShopMutation,
    useUpdateAdminShopMutation,
    useDeleteAdminShopMutation,
    useGetAdminProductsQuery,
    useCreateAdminProductMutation,
    useUpdateAdminProductMutation,
    useDeleteAdminProductMutation,
    useGetAdminShopOwnersQuery,
    useCreateAdminShopOwnerMutation,
    useGetShopCatalogQuery,
    useAddCatalogToShopMutation,
    useGetMyShopProductsQuery,
    useCreateShopProductMutation,
    useUpdateShopProductMutation,
    useDeleteShopProductMutation,
    useGetMyShopProfileQuery,
    useUpdateMyShopProfileMutation,
    useGetCategoriesQuery,
    useGetStoreShopsQuery,
    useGetStoreShopQuery,
    useGetStoreShopProductsQuery,
    useGetStoreProductDetailQuery,
    useGetShopOrdersQuery,
    useUpdateOrderStatusMutation,
} = ecommerceApi;
