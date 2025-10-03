import axios from "axios";
import { store } from "@store/store";
import { triggerLogout } from "@utils/authHelper";

const getCommonHeaders = (token = null) => {
  const state = store.getState();
  return {
    "Api-Key": import.meta.env.VITE_API_KEY,
    Language: state.global.language || "es",
    Country: state.global.country || "PE",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// 👉 Axios con baseURL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token);
  });
  failedQueue = [];
};

// 👉 Interceptor de solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    const authRoutes = [
      "/client/data",
      "/auth/logout",
      "/cart/list",
      "/cart/add",
      "/cart/delete",
      "/cart/checkout",
      "/coupon/code",
      "/courses/purchased",
      "/video/auth/",
      "/courses/detail",
      "/redeem/add",
      "/courses/progress/update",
      "/courses/progress/complete",
    ];
    const needsAuth = authRoutes.some((path) => config.url.includes(path));
    config.headers = {
      ...config.headers,
      ...getCommonHeaders(needsAuth ? token : null),
    };
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const is401 = error.response?.status === 401;
    const isNotRetried = !originalRequest._retry;
    const isNotRefresh = !originalRequest.url.includes("/auth/refresh");
    const authRoutes = [
      "/client/data",
      "/cart/list",
      "/cart/add",
      "/cart/delete",
      "/cart/checkout",
      "/coupon/code",
      "/courses/purchased",
      "/video/auth/",
      "/redeem/add",
      "/courses/progress/update",
      "/courses/progress/complete",
    ];
    const isAuthRoute = authRoutes.some((path) => originalRequest.url.includes(path));
    if (is401) console.warn("[Axios] 401 recibido en:", originalRequest.url);

    if (!is401 || !isNotRetried || !isNotRefresh || !isAuthRoute) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      console.log("[Axios] Ya hay un refresh en curso, encolando solicitud:", originalRequest.url);
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch(Promise.reject);
    }

    isRefreshing = true;

    try {
      const expiredToken = localStorage.getItem("access_token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {},
        {
          headers: getCommonHeaders(expiredToken),
          withCredentials: true,
        }
      );

      const newToken = res.data.data.access_token;
      console.log("[Axios] Nuevo token recibido:", newToken);
      localStorage.setItem("access_token", newToken);
      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (err) {
      console.error("[Axios] Error al refrescar token", err);
      processQueue(err, null);
      // localStorage.removeItem("access_token");
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        triggerLogout();
      }
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
