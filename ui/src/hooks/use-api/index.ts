import axios from "axios";
import Cookies from "js-cookie";

const useApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

useApi.interceptors.request.use(
    (config) => {
        const token =
            document?.cookie
                ?.split("; ")
                ?.find((row) => row?.startsWith("authToken="))
                ?.split("=")[1] || null;
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
            window.location.href = "/auth/login";
        }
        return Promise.reject(error);
    }
);

export default useApi;