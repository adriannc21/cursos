import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // 🔹 nuevo

  const validateToken = async (token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/client/data`, {
        method: "GET",
        headers: {
          "Api-Key": import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${token}`,
          Language: "es",
        },
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user_data", JSON.stringify(data.data));
        setUserData(data.data);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const tryRefresh = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Api-Key": import.meta.env.VITE_API_KEY,
        },
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        const newToken = data.data.access_token;
        localStorage.setItem("access_token", newToken);
        setAccessToken(newToken);
        return await validateToken(newToken);
      }
    } catch {}
    return false;
  };

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Api-Key": import.meta.env.VITE_API_KEY,
        },
      });
    } catch (err) {
      console.error("Error en logout:", err);
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
    setAccessToken(null);
    setIsAuthenticated(false);
    setUserData(null);
  };

  const login = async (token) => {
    if (!token) return false;
    localStorage.setItem("access_token", token);
    setAccessToken(token);
    const isValid = await validateToken(token);
    setIsAuthenticated(isValid);
    return isValid;
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }

      const valid = await validateToken(token);
      if (valid) {
        setAccessToken(token);
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      const refreshed = await tryRefresh();
      setIsAuthenticated(refreshed);

      if (!refreshed) logout();
      setLoading(false); // 🔹 finalizar loading en cualquier caso
    };

    bootstrapAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuthenticated,
        userData,
        login,
        logout,
        loading, // 🔹 expón loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
