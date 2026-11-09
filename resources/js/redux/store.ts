import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './api/index.js'
import userReducer from './user-slice/index.js'
import cartReducer from './cart-slice/index.js'


export const store = configureStore({
    reducer: {
        auth: userReducer,
        cart: cartReducer,
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(baseApi.middleware)
    }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

