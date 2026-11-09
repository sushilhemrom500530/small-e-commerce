import type { ILoginRequest, ILoginResponse, IRegisterRequest, IUser } from "../../../types/user/index.js";
import { baseApi } from "../../api/index.js";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<any, IRegisterRequest>({
            query: (body) => ({
                url: "/auth/register",
                method: "POST",
                body,
            }),
            invalidatesTags: ["auth"],
        }),

        login: builder.mutation<ILoginResponse, ILoginRequest>({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body,
            }),
            invalidatesTags: ["auth"],
        }),

        verifyOtp: builder.mutation({
            query: (body) => ({
                url: "/auth/verify-otp",
                method: "POST",
                body,
            }),
        }),

        resendOtp: builder.mutation({
            query: (body) => ({
                url: "/auth/resend-otp",
                method: "POST",
                body,
            }),
        }),

        forgotPassword: builder.mutation({
            query: (body) => ({
                url: "/auth/forgot-password",
                method: "POST",
                body,
            }),
        }),

        forgotOtpVerify: builder.mutation({
            query: (body) => ({
                url: "/auth/forgot-otp-verify",
                method: "POST",
                body,
            }),
        }),

        resetPassword: builder.mutation({
            query: (body) => ({
                url: "/auth/reset-password",
                method: "POST",
                body,
            }),
        }),

        changePassword: builder.mutation({
            query: (body) => ({
                url: "/auth/change-password",
                method: "POST",
                body,
            }),
            invalidatesTags: ["auth"],
        }),

        refreshToken: builder.mutation({
            query: () => ({
                url: "/auth/refresh-token",
                method: "POST",
            }),
        }),
        getMyProfile: builder.query<IUser, void>({
            query: () => ({
                url: "/user/get-my-profile",
                method: "GET",
            }),
            providesTags: ["user"],
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useVerifyOtpMutation,
    useResendOtpMutation,
    useForgotPasswordMutation,
    useForgotOtpVerifyMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useRefreshTokenMutation,
    useGetMyProfileQuery,
} = authApi;