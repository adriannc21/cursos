import "./ViewCourseModule.css";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "@api/axios";

function ViewCourseModule() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const stateData = location.state?.purchasedData;
      if (stateData && mounted) {
        const normalized = stateData.data || stateData;
        setPayload(normalized);
        setLoading(false);
        console.log("Curso cargado desde state:", normalized);
        return;
      }

      try {
        const res = await api.get(`/courses/purchased/${slug}`);
        const data = res.data;
        const p = data?.data;

        const hasData =
          (data?.success && ((Array.isArray(p) && p.length > 0) || (p && Object.keys(p).length > 0))) ||
          data?.purchased === true;

        if (!hasData) {
          navigate(`/cursos/${slug}`, { replace: true });
          return;
        }

        if (mounted) {
          setPayload(p || data);
          console.log("Curso cargado desde API:", p || data);
        }
      } catch {
        if (mounted) navigate(`/cursos/${slug}`, { replace: true });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [slug, location.state, navigate]);

  if (loading) return <p>Cargando curso...</p>;
  if (!payload) return null;

  const teachers =
    Array.isArray(payload.teachers) && payload.teachers.length > 0
      ? payload.teachers
      : [
          {
            name: payload.teacher_name,
            photo_url: payload.teacher_image,
            speciality: "Especialidad no disponible",
          },
        ];

  // Solo usamos la versión que pasó el router
  const version = location.state?.version;
  const courseTitle = version === "lite" ? `${payload.title} - Lite` : payload.title;

  return (
    <div className="page-viewcoursemodule">
      <div className="coverage">
        <div className="container">
          <div className="banner">
            <div className="data">
              <p className="name-course">{courseTitle}</p>
              {payload.teacher_names && (
                <p className="name-teacher">
                  con <span>{payload.teacher_names}</span>
                </p>
              )}
            </div>
            <div className="sec">
              <p className="category">{payload.category}</p>
              <img src="/logo-v3.webp" alt="logo" />
            </div>
          </div>

          <div className="c">
            <div className="c1">
              <div className="about">
                <h1>Acerca del curso</h1>
                <div className="flow">{payload.description}</div>
              </div>

              <div className="module-list">
                <h1 className="subt">Módulos del curso</h1>
                <div className="modules">
                  {payload.modules.map((m, i) => {
                    const progress = m.progress;
                    return (
                      <div key={i} className="module-item" style={{ position: "relative" }}>
                        <div className="dats">
                          <p className="number">Módulo {String(i + 1).padStart(2, "0")}</p>
                          <p className="title">{m.title}</p>
                        </div>

                        <div className="prog">
                          <div className="progress">{progress}</div>
                          <div className="bar">
                            <span style={{ width: progress }}></span>
                          </div>
                          <button className="btn-view" onClick={() => navigate(`/mis-cursos/${slug}/${m.uuid}`)}>
                            Ver módulo
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="c2">
              <div className="teacher-info">
                {teachers.map((t, i) => (
                  <div className="master" key={i}>
                    <div className="photo">
                      <img src={t.photo_url} alt={t.name} />
                    </div>
                    <h1 className="name">{t.name}</h1>
                    <p className="tit">{t.speciality}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewCourseModule;
