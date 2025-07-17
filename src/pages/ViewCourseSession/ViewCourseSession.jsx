import "./ViewCourseSession.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DataCourses from "@src/jsons/courses.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faCirclePlay, faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";

function ViewCourseSession() {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(true);
  const toggleMenu = () => setMenuVisible(!menuVisible);
  const { slug, moduleUrl } = useParams();
  const course = DataCourses.find((c) => c.url === slug);
  const module = course.modules.find((m) => m.url === moduleUrl);
  const [currentSession, setCurrentSession] = useState(module.sessions[0]);
  const currentModuleIndex = course.modules.findIndex((m) => m.url === moduleUrl);
  const isFirstModule = currentModuleIndex === 0;
  const isLastModule = currentModuleIndex === course.modules.length - 1;

  const goToPrevious = () => {
    if (isFirstModule) {
      navigate(`/cursos/${slug}`);
    } else {
      const prevModule = course.modules[currentModuleIndex - 1];
      navigate(`/cursos/${slug}/${prevModule.url}`);
    }
  };

  const goToNext = () => {
    if (isLastModule) {
      navigate(`/cursos/${slug}`);
    } else {
      const nextModule = course.modules[currentModuleIndex + 1];
      navigate(`/cursos/${slug}/${nextModule.url}`);
    }
  };

  const getYoutubeId = (url) => {
    if (!url) return "";
    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1];
    }
    return url.split("v=")[1]?.split("&")[0] ?? "";
  };

  const videoId = getYoutubeId(currentSession.video);
  const iframeSrc = `https://www.youtube.com/embed/${videoId}`;
  useEffect(() => {
    setCurrentSession(module.sessions[0]);
  }, [moduleUrl]);
  
  return (
    <div className="page-viewcoursesession">
      <div className="con">
        <div className="op">
          <div className="dats">
            <p className="module-name" onClick={() => navigate(`/cursos/${slug}`)}>
              {module.title}
            </p>
            <h1 className="session-name">Clase: {currentSession.name}</h1>
            <div className="session-cant">
              <FontAwesomeIcon icon={faCirclePlay} />
              <p>{module.sessions.length} sesiones</p>
            </div>
          </div>
          <div className="view-sessions hover-op" onClick={toggleMenu}>
            <p>{menuVisible ? "Vista Completa" : "Ver Sesiones"}</p>
          </div>
        </div>

        <div className="container">
          <div className={`session-content ${menuVisible ? "" : "max"}`}>
            <div className="session-video">
              {videoId ? <iframe src={iframeSrc} allowFullScreen /> : <p>Video no disponible</p>}
            </div>
          </div>

          {menuVisible && (
            <div className="lateral">
              <div className="menu">
                <p className="tit">Sesiones</p>
                <div className="sessions">
                  {module.sessions.map((session, index) => (
                    <div
                      key={index}
                      onClick={() => setCurrentSession(session)}
                      className={`session-item ${session.name === currentSession.name ? "active" : ""}`}
                    >
                      <FontAwesomeIcon icon={faPlay} className="icon-play" />
                      <p className="name">{session.name}</p>
                      <p className="duration">{session.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="nav-modules">
                <div className="redir hover-op" onClick={goToPrevious}>
                  <FontAwesomeIcon icon={faAnglesLeft} />
                  <p>{isFirstModule ? "Ver todos los módulos" : "Ir al anterior módulo"}</p>
                </div>
                <div className="redir hover-op" onClick={goToNext}>
                  <p>{isLastModule ? "Ver todos los módulos" : "Ir al siguiente módulo"}</p>
                  <FontAwesomeIcon icon={faAnglesRight} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewCourseSession;
