import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries } from "@store/slices/globalSlice";
import { HelmetProvider } from "react-helmet-async"; // 👈 Import necesario
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import ViewCourseRouter from "./routes/ViewCourseRouter";
import { AuthProvider } from "@contexts"; // Quitar CountryProvider
import { Home, Auth, Courses, Profile, ViewCourseSession, Verify, ShoppingCart, ViewCourseModule } from "./pages";
import ScrollToTop from "@components/ScrollToTop/ScrollToTop";
import Layout from "@components/Layout";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/cursos" element={<Courses />} />
        <Route path="/carrito-de-compras" element={<ShoppingCart />} />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mis-cursos/:slug/:moduleId"
          element={
            <ProtectedRoute>
              <ViewCourseSession />
            </ProtectedRoute>
          }
        />
         <Route
          path="/mis-cursos/:slug"
          element={
            <ProtectedRoute>
              <ViewCourseModule />
            </ProtectedRoute>
          }
        />
        <Route path="/cursos/:slug" element={<ViewCourseRouter />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
      <Route
        path="/iniciar-sesion"
        element={
          <ProtectedRoute requireAuth={false} redirectTo="/perfil">
            <Auth isLogin={true} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/registro"
        element={
          <ProtectedRoute requireAuth={false} redirectTo="/perfil">
            <Auth isLogin={false} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/registro/:clave"
        element={
          <ProtectedRoute requireAuth={false} redirectTo="/perfil">
            <Verify />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  const dispatch = useDispatch();
  const countries = useSelector((state) => state.global.countries);
  useEffect(() => {
    if (!countries?.length) {
      dispatch(fetchCountries());
    }
  }, [countries, dispatch]);
  return (
    <HelmetProvider>
      <AuthProvider>
        <ScrollToTop />
        <AppRoutes />
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
