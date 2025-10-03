import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@contexts";
import ViewCourseFree from "@pages/ViewCourseFree/ViewCourseFree";
import api from "@api/axios";

const ViewCourseRouter = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const version = location.state?.version || "full"; // Versión que quiere abrir el usuario
  const [loading, setLoading] = useState(true);
  const [showFreeView, setShowFreeView] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkPurchase = async () => {
      if (!isAuthenticated) {
        if (mounted) {
          setShowFreeView(true);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await api.get(`/courses/purchased/${slug}`);
        const payload = res.data?.data;
        let purchasedVersion = null;

        // Detecta qué versión tiene el usuario
        if (res.data?.success) {
          if (Array.isArray(payload) && payload.length > 0) {
            purchasedVersion = payload[0].lite ? "lite" : "full";
          } else if (payload && Object.keys(payload).length > 0) {
            purchasedVersion = payload.lite ? "lite" : "full";
          }
        }

        if (purchasedVersion) {
          if (purchasedVersion === "full") {
            // Siempre mostrar full si tiene full
            navigate(`/mis-cursos/${slug}`, {
              replace: true,
              state: { purchasedData: res.data, version: "full" },
            });
          } else if (purchasedVersion === version) {
            // Si tiene la versión que quiere abrir
            navigate(`/mis-cursos/${slug}`, {
              replace: true,
              state: { purchasedData: res.data, version },
            });
          } else {
            // Si tiene lite y quiere full → mostrar free
            if (mounted) setShowFreeView(true);
          }
          return;
        }

        // No tiene nada comprado → mostrar free
        if (mounted) setShowFreeView(true);
      } catch {
        if (mounted) setShowFreeView(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkPurchase();

    return () => { mounted = false; };
  }, [slug, isAuthenticated, navigate, version]);

  if (loading) return <p>Cargando curso...</p>;
  return showFreeView ? <ViewCourseFree version={version} /> : null;
};

export default ViewCourseRouter;
