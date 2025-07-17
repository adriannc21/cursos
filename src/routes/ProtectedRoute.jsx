import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";

const ProtectedRoute = ({ children, redirectTo = "/iniciar-sesion", requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null; // puedes cambiarlo por <Loading /> si deseas
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/perfil" replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
