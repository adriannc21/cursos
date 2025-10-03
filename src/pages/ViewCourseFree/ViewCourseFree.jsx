import "./ViewCourseFree.css";
import api from "@api/axios";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCheck, faAward } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Notification from "@components/Notification/Notification";
import { addToCart, clearCartMessage } from "@store/slices/globalSlice";
import { useAuth } from "@contexts/AuthContext";

function ViewCourseFree({ version }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [openModules, setOpenModules] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(version || "full");
  const [videoSrc, setVideoSrc] = useState(null);
  const [hasFetchedVideo, setHasFetchedVideo] = useState(false);
  const { slug } = useParams();
  const country = useSelector((state) => state.global.country);
  const language = useSelector((state) => state.global.language);
  const dispatch = useDispatch();
  const cartMessage = useSelector((state) => state.global.cartMessage);

  const isLite = selectedVersion === "lite";
  const courseTitle = `${courseData?.data?.title}${isLite ? " - Lite" : ""}`;
  const formatDuration = (hms) => {
    if (!hms) return "";
    const [h, m, s] = hms.split(":").map(Number);
    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0 && h === 0) parts.push(`${s}s`);
    return parts.join(" ");
  };

  const formatShortDuration = (hms) => {
    if (!hms) return "";
    const [h, m, s] = hms.split(":").map(Number);
    if (h > 0) {
      return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
    }
    return [m, s].map((n) => String(n).padStart(2, "0")).join(":");
  };

  useEffect(() => {
    dispatch(clearCartMessage());
    return () => dispatch(clearCartMessage());
  }, [dispatch]);

  useEffect(() => {
    if (!slug) return;
    const fetchCourse = async () => {
      try {
        const endpoint = `/courses/detail/${slug}`;
        const res = await api.get(endpoint);
        setCourseData(res.data);
      } catch (err) {
        console.error("❌ Error al obtener curso:", err);
        navigate("/", { replace: true });
      }
    };
    fetchCourse();
  }, [slug, language, country]);

  useEffect(() => {
    if (courseData?.data) {
      setSelectedVersion(version || "full");
      const totalModules = courseData.data.modules?.length || 0;
      setOpenModules([...Array(totalModules).keys()]);
    }
  }, [courseData, version]);

  useEffect(() => {
    const uuid = courseData?.data?.uuid;
    if (!uuid) return;
    setHasFetchedVideo(false);
    api
      .get(`/video/play/${uuid}`)
      .then((res) => {
        if (res.data.success && res.data.data?.url) setVideoSrc(res.data.data.url);
        else setVideoSrc(null);
      })
      .catch(() => setVideoSrc(null))
      .finally(() => setHasFetchedVideo(true));
  }, [courseData]);

  const toggleModule = (index) => {
    if (openModules.includes(index)) setOpenModules(openModules.filter((i) => i !== index));
    else setOpenModules([...openModules, index]);
  };

  return (
    <div className="page-viewcoursefree">
      {cartMessage && (
        <Notification
          key={cartMessage.id}
          id={cartMessage.id}
          type={cartMessage.type}
          title={cartMessage.type === "success" ? "Curso Agregado" : "Aviso"}
          content={cartMessage.content}
          onClose={() => dispatch(clearCartMessage())}
        />
      )}

      <div className="video-container-mb">
        {hasFetchedVideo && videoSrc ? (
          <iframe src={videoSrc} allowFullScreen allow="encrypted-media" />
        ) : (
          <p>Cargando video...</p>
        )}
      </div>

      <div className="about-mb">
        <p className="title">{courseTitle}</p>
        <p className="description">{courseData?.data?.description}</p>
      </div>

      <div className="coverage">
        <div className="container">
          <div className="c1">
            <div className="video-container">
              {hasFetchedVideo && videoSrc ? (
                <iframe src={videoSrc} allowFullScreen allow="encrypted-media" />
              ) : (
                <p>Cargando video...</p>
              )}
            </div>

            <div className="about">
              <p className="title">{courseTitle}</p>
              <p className="description">{courseData?.data?.description}</p>
            </div>

            <div className="utilities">
              <p className="subt">¿Qué necesitas para empezar?</p>
              {courseData?.data?.requirements?.map((item, index) => (
                <div className="ut" key={index}>
                  <div className="con-icon">
                    <FontAwesomeIcon className="icon-check" icon={faCheck} />
                  </div>
                  <p className="s">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="skills">
              <p className="quest">¿Qué aprenderás en el curso de {courseTitle}?</p>
              <div className="sks">
                {courseData?.data?.skills?.map((item, index) => (
                  <div className="sk" key={index}>
                    <FontAwesomeIcon className="icon-check-l" icon={faCheck} />
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="modules-details">
              <p className="title">Temario del curso</p>
              <div className="modules">
                {courseData?.data?.modules?.map((module, index) => (
                  <div className="module" key={index}>
                    <div className="preselect" onClick={() => toggleModule(index)}>
                      <p className="module-name">{module.title}</p>
                      <FontAwesomeIcon
                        className={`icon-down ${openModules.includes(index) ? "rotate" : ""}`}
                        icon={faChevronDown}
                      />
                    </div>
                    <div className={`lessons ${openModules.includes(index) ? "open" : ""}`}>
                      {module.lessons.map((lesson, i) => (
                        <div className={`lesson ${lesson.locked ? "locked" : ""}`} key={i}>
                          <div className="lesson-name">
                            {/* <span className="video">
                              <FontAwesomeIcon className="icon" icon={faPlay} />
                            </span> */}
                            <p>{lesson.title}</p>
                          </div>
                          <p className="lesson-time">{formatShortDuration(lesson.duration)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="c2">
            <div className="mb">
              <div className="p0">
                {selectedVersion && (
                  <div className="prices">
                    {courseData?.data?.lite && (
                      <div
                        className={`price lite ${selectedVersion === "lite" ? "select" : ""}`}
                        onClick={() => setSelectedVersion("lite")}
                      >
                        <p className="text">Accede a la versión Lite</p>
                        <div className="money">
                          <span className="p">{courseData?.data?.lite?.discount}</span>
                          <span className="disc">{courseData?.data?.lite?.price}</span>
                        </div>
                      </div>
                    )}

                    <div
                      className={`price ${selectedVersion === "full" ? "select" : ""}`}
                      onClick={() => setSelectedVersion("full")}
                    >
                      <p className="text">Accede a la versión Full</p>
                      <p className="money">
                        <span className="p">{courseData?.data?.full?.discount}</span>
                        <span className="disc">{courseData?.data?.full?.price}</span>
                      </p>
                    </div>
                  </div>
                )}

                <div
                  className="btn-buy hover-op"
                  onClick={() => {
                    const item = {
                      course_uuid: courseData?.data?.uuid,
                      is_lite: selectedVersion === "lite",
                      // Agrega "- Lite" al título si es la versión lite
                      title: selectedVersion === "lite" ? `${courseData?.data?.title} - Lite` : courseData?.data?.title,
                      thumbnail: courseData?.data?.thumbnail,
                      // Toma el precio correcto según la versión seleccionada
                      price: selectedVersion === "lite" ? courseData?.data?.lite?.discount : courseData?.data?.full?.discount,
                    };
                    dispatch(addToCart({ item, isAuthenticated }));
                  }}
                >
                  <p>Añadir al carrito</p>
                </div>
              </div>

              <div className="p1">
                <div className="membership">
                  <p className="flow">
                    Disfruta acceso ilimitado a todos los cursos con nuestra membresía premium. Aprende sin límites,
                    cuando quieras.
                  </p>
                  <button className="btn-member">Suscribirme Ahora</button>
                </div>
              </div>
            </div>

            <div className="p2">
              <p className="indash">Información del curso:</p>
              <div className="dash">
                <div className="d">
                  <FontAwesomeIcon className="icon" icon={faClock} />
                  <p className="txt">
                    Duración:{" "}
                    <span>
                      {formatDuration(isLite ? courseData?.data?.lite?.duration : courseData?.data?.full?.duration)}
                    </span>
                  </p>
                </div>
                <div className="d">
                  <div className="levels">
                    <span className="basic"></span>
                    <span className="inter"></span>
                    <span className="max"></span>
                  </div>
                  <p className="txt">
                    Nivel: <span>{isLite ? "Básico" : "Avanzado"}</span>
                  </p>
                </div>
              </div>
              <div className="certified">
                <FontAwesomeIcon className="icon" icon={faAward} />
                <p>Certifícate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewCourseFree;
