import axios from "axios";
import Cookies from "js-cookie";

const useApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_PUBLIC_URL || "/api/v1",
});

useApi.interceptors.request.use(
    (config) => {
        const token =
            Cookies.get("token") ||
            Cookies.get("authToken") ||
            (typeof window !== "undefined"
                ? localStorage.getItem("token") || localStorage.getItem("authToken")
                : null) ||
            document?.cookie
                ?.split("; ")
                ?.find((row) => row?.startsWith("authToken=") || row?.startsWith("token="))
                ?.split("=")[1] ||
            null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

useApi.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            Cookies.remove("authToken");
            Cookies.remove("token");
            if (typeof window !== "undefined") {
                localStorage.removeItem("authToken");
                localStorage.removeItem("token");
            }
        }
        return Promise.reject(error);
    }
);

export default useApi;