import React, { useState, useEffect } from 'react';
import { Button, message, Input, Drawer, Empty } from 'antd';
import { Search, ShoppingBag, Receipt, Package, Trash2, Plus, Minus, } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../../../redux/features/product/index.js';
import { useCreateSaleMutation } from '../../../redux/features/sale/index.js';
import Loading from '../../../Components/reuseable/loading/index.js';

interface ICartItem {
    _id: string;
    name: string;
    price: number;
    stock: number;
    quantity: number;
}

export default function CreateSalesContent() {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [cart, setCart] = useState<ICartItem[]>([]);
    const [isMobileCartOpen, setIsMobileCartOpen] = useState(false); // Controls mobile drawer

    const { data, isFetching } = useGetProductsQuery({
        page: 1,
        limit: 50,
        searchTerm: debouncedSearch,
    });

    const [createSale, { isLoading: isCreating }] = useCreateSaleMutation();

    const currentProducts = data?.data?.results || [];

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const addToCart = (product: any) => {
        if (product.stockQuantity <= 0) {
            return message.warning('This product is out of stock.');
        }

        setCart(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) {
                if (existing.quantity >= product.stockQuantity) {
                    message.warning('Maximum stock limit reached');
                    return prev;
                }
                return prev.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, {
                _id: product._id,
                name: product.productName,
                price: product.sellingPrice,
                stock: product.stockQuantity,
                quantity: 1
            }];
        });
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item._id === id) {
                const newQty = item.quantity + delta;
                if (newQty > item.stock) {
                    message.warning('Maximum stock limit reached');
                    return item;
                }
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item._id !== id));
    };

    const handleSave = async () => {
        try {
            if (cart.length === 0) {
                return message.error('Please add at least one product to the cart.');
            }

            const formattedProducts = cart.map(item => ({
                product: item._id,
                quantity: item.quantity,
            }));

            const payload = {
                products: formattedProducts,
            };

            const res = await createSale(payload).unwrap();
            message.success(res.message || 'Sale completed successfully!');
            setCart([]);
            setIsMobileCartOpen(false);
            navigate(-1);
        } catch (error: any) {
            message.error(error?.data?.message || 'Failed to create sale. Please try again.');
        }
    };

    // Derived totals
    const totals = cart.reduce((acc, item) => {
        acc.items += 1;
        acc.quantity += item.quantity;
        acc.grandTotal += (item.price * item.quantity);
        return acc;
    }, { items: 0, quantity: 0, grandTotal: 0 });

    // Reusable  
    const CartContent = () => (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50/30">
                {cart.length === 0 ? (
                    <div className="m-auto flex flex-col items-center text-gray-400">
                        <ShoppingBag className="w-12 h-12 mb-3 text-gray-200" />
                        <p className="font-medium text-sm">Cart is empty</p>
                    </div>
                ) : (
                    cart.map(item => (
                        <div key={item._id} className="bg-white border text-sm border-slate-200 rounded-xl p-3 flex flex-col gap-2">
                            <div className="flex justify-between items-start gap-2">
                                <div className="font-semibold text-gray-800 leading-tight break-words max-w-[80%]">
                                    {item.name}
                                </div>
                                <Button
                                    type="text"
                                    size="small"
                                    danger
                                    onClick={() => removeFromCart(item._id)}
                                    icon={<Trash2 className="w-4 h-4" />}
                                    className="h-6 w-6 rounded-md hover:bg-red-50 -mt-1 -mr-1"
                                />
                            </div>

                            <div className="flex justify-between items-end mt-1">
                                <div className="font-bold text-blue-600">
                                    ${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>

                                <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100">
                                    <Button
                                        type="text"
                                        size="small"
                                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white border border-transparent hover:border-gray-200"
                                        onClick={() => updateQuantity(item._id, -1)}
                                        icon={<Minus className="w-3 h-3" />}
                                    />
                                    <span className="font-bold text-gray-700 min-w-[16px] text-center">{item.quantity}</span>
                                    <Button
                                        type="text"
                                        size="small"
                                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white border border-transparent hover:border-gray-200"
                                        onClick={() => updateQuantity(item._id, 1)}
                                        icon={<Plus className="w-3 h-3" />}
                                        disabled={item.quantity >= item.stock}
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Cart Footer Summary */}
            <div className="border-t border-slate-200 bg-white sticky bottom-0 left-0 right-0 z-10 pb-safe">
                <div className="p-4 sm:p-5 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Items Count</span>
                        <span className="font-bold text-gray-700">{totals.items}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Total Quantity</span>
                        <span className="font-bold text-gray-700">{totals.quantity}</span>
                    </div>
                    <div className="h-px bg-gray-100 w-full my-1"></div>
                    <div className="flex justify-between items-end">
                        <span className="font-bold text-gray-800 mb-0.5">Grand Total</span>
                        <span className="text-2xl font-extrabold text-emerald-600 tracking-tight">
                            ${totals.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>

                <div className="p-4 pt-0 flex gap-2">
                    <Button
                        size="large"
                        className="flex-[1] h-12 rounded-xl text-gray-600 font-semibold hidden sm:inline-block"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        loading={isCreating}
                        onClick={handleSave}
                        disabled={cart.length === 0}
                        icon={<Receipt className="w-4 h-4" />}
                        className="flex-[2] w-full h-12 rounded-xl !bg-secondary hover:!bg-secondary/90 font-bold flex items-center justify-center gap-2"
                    >
                        Create Sale
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 items-start h-[calc(100vh-64px)] md:h-[calc(100vh-140px)] pb-20 xl:pb-0">

            {/* Left Side */}
            <div className="bg-white rounded-2xl border border-slate-200 h-full overflow-hidden flex flex-col">

                <div className="p-4 sm:p-6 border-b border-gray-50 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-secondary/10 text-secondary rounded-xl">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Products</h2>
                            <p className="text-xs sm:text-sm text-gray-500 font-medium">Select items to add to cart</p>
                        </div>
                    </div>

                    <div className="w-full sm:w-80">
                        <Input
                            placeholder="Search products..."
                            prefix={<Search className="w-4 h-4 text-gray-400" />}
                            className="h-11 rounded-xl bg-gray-50 border-transparent hover:border-blue-200 focus:border-blue-500 focus:bg-white transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            allowClear
                        />
                    </div>
                </div>

                {/* Product Layout */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
                    {isFetching ? (
                        <Loading title="Loading Products..." />
                    ) : currentProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
                            <Empty description="No products found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </div>
                    ) : (
                        /* Mobile */
                        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-max">
                            {currentProducts.map((p: any) => (
                                <div
                                    key={p._id}
                                    onClick={() => addToCart(p)}
                                    className={`
                                        bg-white border rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-200
                                        flex flex-row sm:flex-col items-center text-left sm:text-center group relative overflow-hidden gap-3 sm:gap-0
                                        ${p.stockQuantity > 0
                                            ? 'border-gray-200 hover:border-secondary active:bg-slate-50'
                                            : 'border-gray-100 opacity-60 cursor-not-allowed grayscale-[0.5]'}
                                    `}
                                >

                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-50 rounded-full flex-shrink-0 flex items-center justify-center text-gray-400 sm:mb-3 group-hover:scale-105 transition-transform">
                                        {p.productImage ? (
                                            <img src={p.productImage} alt={p.productName} className="w-full h-full object-cover rounded-full" />
                                        ) : (
                                            <Package className="w-6 h-6 sm:w-8 sm:h-8" />
                                        )}
                                    </div>


                                    <div className="flex-1 sm:w-full flex flex-col sm:items-center">
                                        <h3 className="font-semibold text-gray-800 text-sm line-clamp-1 sm:line-clamp-2 sm:mb-1">
                                            {p.productName}
                                        </h3>
                                        <span className="text-[11px] text-gray-400 mb-1 sm:mb-2">SKU: {p.sku}</span>
                                    </div>


                                    <div className="text-right sm:text-center sm:mt-auto flex flex-col items-end sm:items-center justify-center min-w-[80px]">
                                        <div className="font-semibold text-black/90 text-base sm:text-lg sm:mb-1">
                                            ${p.sellingPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                        {p.stockQuantity > 0 ? (
                                            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                                                In Stock ({p.stockQuantity})
                                            </span>
                                        ) : (
                                            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                                                Out of Stock
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side */}
            <div className="hidden xl:flex bg-white rounded-2xl border border-slate-200  h-full overflow-hidden flex-col">
                <div className="p-5 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-gray-700" />
                        <h2 className="text-lg font-bold text-gray-900">Checkout Cart</h2>
                    </div>
                    {totals.quantity > 0 && (
                        <div className="w-6 h-6 bg-primary/10 text-secondary rounded-full flex items-center justify-center text-xs font-bold">
                            {totals.quantity}
                        </div>
                    )}
                </div>
                <CartContent />
            </div>

            {/* Mobile Bottom Floating Action Bar & Slide-up Drawer */}
            <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex items-center justify-between z-40 pb-safe">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-medium">Total Price</span>
                    <span className="text-xl font-extrabold text-emerald-600">
                        ${totals.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
                <Button
                    type="primary"
                    size="large"
                    onClick={() => setIsMobileCartOpen(true)}
                    className="bg-blue-600 font-bold px-6 h-12 rounded-xl flex items-center gap-2 !bg-secondary hover:!bg-secondary/90 "
                >
                    <ShoppingBag className="w-4 h-4" />
                    <span>View Cart ({totals.quantity})</span>
                </Button>
            </div>

            {/* Ant Design Mobile Drawer */}
            <Drawer
                title={
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-gray-700" />
                        <span className="font-bold text-gray-800">Checkout Cart ({totals.quantity})</span>
                    </div>
                }
                placement="bottom"
                onClose={() => setIsMobileCartOpen(false)}
                open={isMobileCartOpen}
                height="85vh"
                styles={{ body: { padding: 0 } }}
                className="xl:hidden rounded-t-2xl overflow-hidden"
            >
                <CartContent />
            </Drawer>

        </div>
    );
}