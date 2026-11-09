import { Descriptions } from "antd";

export default function ProductDetails({ selectedProduct }: { selectedProduct: any }) {
    return (
        <section>
            <div className="space-y-6">

                <div className="flex justify-start">
                    <img
                        src={selectedProduct.productImage}
                        alt={selectedProduct.productName}
                        className='md:w-72 h-40 object-cover rounded-md'

                    />
                </div>

                <Descriptions
                    bordered
                    column={1}
                    size="middle"
                >
                    <Descriptions.Item label="Product">
                        {selectedProduct.productName}
                    </Descriptions.Item>

                    <Descriptions.Item label="SKU">
                        {selectedProduct.sku}
                    </Descriptions.Item>

                    <Descriptions.Item label="Category">
                        {selectedProduct.category}
                    </Descriptions.Item>

                    <Descriptions.Item label="Purchase Price">
                        ${selectedProduct.purchasePrice}
                    </Descriptions.Item>

                    <Descriptions.Item label="Selling Price">
                        ${selectedProduct.sellingPrice}
                    </Descriptions.Item>

                    <Descriptions.Item label="Stock">
                        {selectedProduct.stockQuantity}
                    </Descriptions.Item>

                    <Descriptions.Item label="Created At">
                        {new Date(
                            selectedProduct.createdAt
                        ).toLocaleString()}
                    </Descriptions.Item>
                </Descriptions>
            </div>
        </section>
    )
}