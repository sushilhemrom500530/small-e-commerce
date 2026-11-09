export interface IProduct {
    _id: string;
    owner: string;
    productName: string;
    sku: string;
    category: string;
    purchasePrice: number;
    sellingPrice: number;
    stockQuantity: number;
    productImage: string;
    createdAt: string;
    updatedAt: string;
}

export interface IProductQuery {
    page?: number;
    limit?: number;
    searchTerm?: string;
    category?: string;
}

export interface IProductListResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        meta: {
            totalResult: number;
            currentPage: number;
            limit: number;
            totalPage: number;
        };
        results: IProduct[];
    };
}
export interface IProductResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: IProduct;
}