import Cookies from "js-cookie";

export type UserRole = "admin" | "shop_owner" | "customer" | "manager" | "employee";

export type UserStatus =
    | "pending"
    | "active"
    | "inactive"
    | "suspended"
    | "deleted";

export interface IUser {
    _id: string;

    fullName: string;

    name?: string;

    email: string;

    role: UserRole;

    dateOfBirth: string;

    phone: string;

    profileUrl?: string;

    coverImage?: Record<string, any>;

    gender?: string;

    fcmToken?: string;

    provider?: "google" | "apple";

    providerId?: string;

    isDeleted?: boolean;

    status?: UserStatus;

    createdAt?: string;

    updatedAt?: string;
}

export interface IApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface ILoginData {
    results: IUser;
    token: string;
}

export type ILoginResponse = IApiResponse<ILoginData>;

export interface IRegisterRequest {
    fullName: string;
    email: string;
    password: string;
    dateOfBirth: string;
    phone: string;
    gender?: string;
    role?: UserRole;
}

export interface IRegisterData {
    token: string;
}

export type IRegisterResponse = IApiResponse<IRegisterData>;


export interface IOtpVerifyRequest {
    otp: string;
}

export type IOtpVerifyResponse = IApiResponse<{
    user: IUser;
}>;

export interface IResendOtpRequest {
    email: string;
}

export type IResendOtpResponse = IApiResponse<null>;

export interface IForgotPasswordRequest {
    email: string;
}

export type IForgotPasswordResponse = IApiResponse<null>;

export interface IForgotOtpVerifyRequest {
    otp: string;
}

export interface IForgotOtpVerifyData {
    resetToken: string;
}

export type IForgotOtpVerifyResponse =
    IApiResponse<IForgotOtpVerifyData>;

export interface IResetPasswordRequest {
    password: string;
    confirmPassword: string;
}

export type IResetPasswordResponse = IApiResponse<null>;

export interface IChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export type IChangePasswordResponse = IApiResponse<null>;

export interface IAuthPayload {
    user: IUser;
    token: string;
}


export interface IInitialState {
    user: IUser | null;
    token: string | null;
    isAuthenticated: boolean;
}

const storedToken = Cookies.get("token") || null;
const storedUser = localStorage.getItem("user");
const parsedUser: IUser | null = storedUser ? JSON.parse(storedUser) : null;

const defaultDevAdmin: IUser = {
    _id: "admin-1",
    fullName: "Admin",
    email: "admin@gmail.com",
    role: "admin",
    dateOfBirth: "1990-01-01",
    phone: "+1 234 567 8900",
    status: "active",
};

const defaultDevShopOwner: IUser = {
    _id: "owner-1",
    fullName: "Shop Owner",
    email: "shopowner@gmail.com",
    role: "shop_owner",
    dateOfBirth: "1992-05-15",
    phone: "+1 234 567 8901",
    status: "active",
};

const isAdminRoute = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
const isShopOwnerRoute =
    typeof window !== "undefined" &&
    (window.location.pathname.startsWith("/shop-owner") || window.location.pathname.startsWith("/manager"));

export const initialState: IInitialState = {
    user: parsedUser || (isAdminRoute ? defaultDevAdmin : isShopOwnerRoute ? defaultDevShopOwner : null),
    token: storedToken || (isAdminRoute || isShopOwnerRoute ? "dev-session-token" : null),
    isAuthenticated: !!storedToken && !!parsedUser ? true : (isAdminRoute || isShopOwnerRoute),
};
