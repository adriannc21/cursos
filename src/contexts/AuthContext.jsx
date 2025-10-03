import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerLogout } from "@utils/authHelper";
import api from "@api/axios";
import { store } from "@store/store";
import { fetchCart, clearCart } from "@store/slices/globalSlice";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Refactor: función de validación central
  const validateToken = async () => {
    const res = await api.get("/client/data");
    if (res.data?.success) {
      const user = res.data.data;
      setUserData(user);
      localStorage.setItem("user_data", JSON.stringify(user));
      setIsAuthenticated(true);
      return true;
    }

    console.warn("⚠️ Respuesta sin éxito en /client/data:", res.data);
    return false;
  };

  const syncCartAfterLogin = async () => {
    const state = store.getState();
    const cart = state.global.cart;

    if (!cart.length) return;

    const items = cart.map(({ course_uuid, is_lite }) => ({
      course_uuid,
      is_lite,
    }));

    try {
      await api.post("/cart/add", { items });
      console.log("🛒 Cart sincronizado con el backend.");
      store.dispatch(clearCart());
    } catch (error) {
      console.error("❌ Error al sincronizar el cart con el backend:", error);
    }
  };

  // ✅ Login: guardar token y validar
  const login = async (token) => {
    if (!token) {
      console.warn("⚠️ No se proporcionó token para login.");
      return false;
    }
    console.log("🔐 Iniciando sesión. Guardando token...");
    localStorage.setItem("access_token", token);

    const valid = await validateToken();
    if (!valid) {
      console.warn("❌ Token proporcionado en login no válido.");
      return false;
    }
    await syncCartAfterLogin();
    store.dispatch(fetchCart());
    return true;
  };

  // 🔒 Logout completo
  const logout = async () => {
    console.log("🔓 Cerrando sesión...");
    try {
      await api.post("/auth/logout");
      console.log("✅ Sesión cerrada correctamente en backend.");
    } catch (err) {
      console.error("⚠️ Error al cerrar sesión en backend:", err);
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
    setIsAuthenticated(false);
    setUserData(null);
    console.log("🧹 Token y datos limpiados. Redirigiendo a /iniciar-sesion");

    navigate("/iniciar-sesion"); // ✅ SIN recargar la página
  };

  // 🔁 Bootstrap
  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.log("🕳️ No hay token en localStorage. Usuario no autenticado.");
        setLoading(false);
        return;
      }

      const valid = await validateToken();
      if (!valid) {
        console.log("⚠️ Token inválido al iniciar. Ejecutando logout...");
        await logout();
      }

      setLoading(false);
    };

    bootstrap();
  }, []);

  useEffect(() => {
    registerLogout(logout);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userData,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
