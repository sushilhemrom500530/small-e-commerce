/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useCallback } from "react";
import { message } from "antd";
import useApi from './../use-api/index';
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";


export interface LoginPayload {
    email: string;
    password: string;
    remember?: boolean;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface VerifyOtpPayload {
    email?: string;
    otp: string;
}

export interface VerifyUserEmailPayload {
    token?: string;
    otp: string;
}

export interface ResetPasswordPayload {
    newPassword: string;
    confirmPassword: string;
}

export interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
    role: string;
}

export function useAuthService() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    /** 🔹 Login */
    const login = useCallback(async (payload: LoginPayload) => {
        setLoading(true);
        try {
            const response = await useApi.post("/auth/login", payload);
            const { data, status } = response;

            if (status >= 400) {
                const errorMsg = data?.message || "Login failed";
                const errorMessages = data?.errorMessages;

                if (errorMessages && Array.isArray(errorMessages) && errorMessages.length > 0) {
                    const uniqueMessages = Array.from(new Set(errorMessages.map((err: any) => err.message)));
                    uniqueMessages.forEach((msg: any) => {
                        message.error(msg);
                    });
                } else {
                    message.error(errorMsg);
                }
                return data; // Return failure data
            }

            message.success("Login successful");
            return data;
        } catch (error: any) {
            // This will only be triggered for 5xx or Network errors now
            console.error("Login unexpected error:", error);
            if (error?.message === 'Network Error') {
                message.error('Server is offline, please try again later');
                return; // gracefully exit without throwing
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    /** 🔹 Register */
    const register = useCallback(async (payload: RegisterPayload) => {
        setLoading(true);
        try {
            const response = await useApi.post("/auth/register", payload);
            const { data, status, } = response;

            if (status >= 400) {
                const errorMsg = data?.message || "Registration failed";
                const errorMessages = data?.errorMessages;

                if (errorMessages && Array.isArray(errorMessages) && errorMessages.length > 0) {
                    const uniqueMessages = Array.from(new Set(errorMessages.map((err: any) => err.message)));
                    uniqueMessages.forEach((msg: any) => {
                        message.error(msg);
                    });
                } else {
                    message.error(errorMsg);
                }
                return data; // Return failure data
            }

            message.success(response?.data?.message || "Registration successful");
            return data;
        } catch (error: any) {
            // This will only be triggered for 5xx or Network errors now
            console.error("Registration unexpected error:", error);
            if (error?.message === 'Network Error') {
                message.error('Server is offline, please try again later');
                return; // gracefully exit without throwing
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    /** 🔹 Forgot Password */
    const forgotPassword = useCallback(async (payload: ForgotPasswordPayload) => {
        setLoading(true);
        try {
            const response = await useApi.post("/auth/forgot-password", payload);
            const { data, status } = response;
            if (status >= 400) {
                message.error(data?.message || "Failed to send OTP");
                return data;
            }
            message.success("OTP sent to your email");
            return data;
        } catch (error: any) {
            console.error("Forgot password unexpected error:", error);
            if (error?.message === 'Network Error') {
                message.error('Server is offline, please try again later');
                return; // gracefully exit
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    /** 🔹 Verify OTP */
    const verifyOtp = useCallback(async (payload: VerifyOtpPayload) => {
        setLoading(true);

        try {
            const token = Cookies.get("forget_token");

            if (!token) {
                message.error("Token not found");
                return;
            }

            const response = await useApi.post(
                "/auth/forgot-otp-verify",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const { data, status } = response;

            if (status >= 400) {
                message.error(data?.message || "Invalid OTP");
                return data;
            }

            message.success("OTP verified successfully");
            return data;

        } catch (error: any) {
            console.error("Verify OTP unexpected error:", error);

            if (error?.message === 'Network Error') {
                message.error('Server is offline, please try again later');
                return; // gracefully exit
            }

            message.error(
                error?.response?.data?.message || "Something went wrong"
            );

            throw error;

        } finally {
            setLoading(false);
        }
    }, []);
    /** 🔹 email Verification */
    const verifyUserEmail = useCallback(async (payload: VerifyUserEmailPayload) => {
        setLoading(true);

        try {
            const token = Cookies.get("verify_token");

            if (!token) {
                message.error("Token not found");
                return;
            }

            const response = await useApi.post(
                "/auth/verify-otp",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const { data, status } = response;

            if (status >= 400) {
                message.error(data?.message || "Invalid OTP");
                return data;
            }

            message.success("OTP verified successfully");
            return data;

        } catch (error: any) {
            console.error("Verify OTP unexpected error:", error);

            if (error?.message === 'Network Error') {
                message.error('Server is offline, please try again later');
                return; // gracefully exit
            }

            message.error(
                error?.response?.data?.message || "Something went wrong"
            );

            throw error;

        } finally {
            setLoading(false);
        }
    }, []);


    const resendOtp = useCallback(async (payload: ForgotPasswordPayload) => {
        setLoading(true);
        try {
            const response = await useApi.post("/auth/resend-otp", payload);
            const { data, status } = response;
            if (status >= 400) {
                message.error(data?.message || "Invalid Request");
                return data;
            }
            message.success("OTP Send successfully. Please check your email");
            return data;
        } catch (error: any) {
            console.error("Resend OTP unexpected error:", error);
            if (error?.message === 'Network Error') {
                message.error('Server is offline, please try again later');
                return; // gracefully exit
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    /** 🔹 Reset Password */
    const resetPassword = useCallback(async (payload: ResetPasswordPayload) => {
        setLoading(true);
        try {
            const token = Cookies.get("verify_token");

            if (!token) {
                message.error("Token not found");
                return;
            }

            const response = await useApi.post("/auth/reset-password", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { data, status } = response;
            if (status >= 400) {
                message.error(data?.message || "Reset failed");
                return data;
            }
            message.success("Password reset successful");
            return data;
        } catch (error: any) {
            console.error("Reset password unexpected error:", error);
            if (error?.message === 'Network Error') {
                message.error('Server is offline, please try again later');
                return; // gracefully exit
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    /** 🔹 Get My Profile */
    const getMe = useCallback(async () => {
        try {
            const response = await useApi.get("/users/get-my-profile");
            const { data, status } = response;
            if (status >= 400) {
                return null;
            }
            return data?.data;
        } catch (error) {
            console.error("Get profile unexpected error:", error);
            return null;
        }
    }, []);

    const logoutUser = () => {
        // Remove token cookie
        Cookies.remove("token");
        message.success("User Logout Successfully")
        // Redirect to login
        router.push("/auth/login");
    }

    return { register, login, forgotPassword, verifyOtp, verifyUserEmail, resetPassword, loading, logoutUser, resendOtp, getMe };
}
