import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Reducer } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  specs?: string[];
  shopName?: string;
}

export interface CartState {
  items: CartItem[];
  shippingFee: number;
}

const DEFAULT_ITEM: CartItem = {
  id: "wireless-headphones-1",
  name: "Wireless Headphones",
  price: 89.99,
  originalPrice: 120.0,
  image: "/images/product-headphone-main@2x.jpg",
  quantity: 1,
  specs: ["Bluetooth 5.0", "Noise Cancellation", "Long Battery"],
  shopName: "Tech World",
};

const loadInitialState = (): CartState => {
  try {
    const saved = localStorage.getItem("shopease_cart");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { items: parsed, shippingFee: 0 };
      }
    }
  } catch {
    // ignore json error
  }
  // Default seeded item matching mockup reference
  return {
    items: [DEFAULT_ITEM],
    shippingFee: 0,
  };
};

const initialState: CartState = loadInitialState();

const saveState = (items: CartItem[]) => {
  try {
    localStorage.setItem("shopease_cart", JSON.stringify(items));
  } catch {
    // ignore storage error
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((it) => it.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push({ ...action.payload });
      }
      saveState(state.items);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((it) => it.id !== id);
      } else {
        const item = state.items.find((it) => it.id === id);
        if (item) {
          item.quantity = quantity;
        }
      }
      saveState(state.items);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((it) => it.id !== action.payload);
      saveState(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveState([]);
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions;

const cartReducer: Reducer<CartState> = cartSlice.reducer;
export default cartReducer;
