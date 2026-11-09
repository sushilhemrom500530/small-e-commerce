import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Reducer } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import type { IAuthPayload, IInitialState } from "../../types/user";
import { initialState } from "../../types/user/index.js";

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<IAuthPayload>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            if (typeof window !== "undefined") {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                localStorage.removeItem("authToken");
            }
            Cookies.remove("token", { path: "/" });
            Cookies.remove("authToken", { path: "/" });
            Cookies.remove("token");
            Cookies.remove("authToken");
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;

const authReducer: Reducer<IInitialState> = authSlice.reducer;

export default authReducer;

