/* global VdoPlayer */

import "./ViewCourseSession.css";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import api from "@api/axios";

function ViewCourseSession() {
  const { slug, moduleId } = useParams();
  const navigate = useNavigate();

  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [menuVisible, setMenuVisible] = useState(true);
  const [currentSession, setCurrentSession] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);

  const iframeRef = useRef(null);

  const formatDuration = (duration) => {
    if (!duration) return "";
    const parts = duration.split(":");
    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parts[1]?.padStart(2, "0") || "00";
    const seconds = parts[2]?.padStart(2, "0") || "00";
    return hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
  };

  useEffect(() => {
    let mounted = true;
    setModuleData(null);
    setCurrentSession(null);
    setVideoSrc(null);
    setLoading(true);

    const fetchModule = async () => {
      try {
        const res = await api.get(`/courses/purchased/module/${moduleId}`);
        if (!res.data.success || !res.data.data) {
          navigate(`/cursos/${slug}`, { replace: true });
          return;
        }

        if (mounted) {
          const lessons = res.data.data.lessons || [];
          const mod = {
            title: res.data.data.title,
            prev: res.data.data.previous_module_uuid,
            next: res.data.data.next_module_uuid,
            sessions: lessons.map((lesson) => ({
              uuid: lesson.uuid,
              name: lesson.title,
              duration: formatDuration(lesson.duration || ""),
            })),
          };

          setModuleData(mod);
          if (mod.sessions.length) selectSession(mod.sessions[0]);
        }
      } catch {
        navigate(`/cursos/${slug}`, { replace: true });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchModule();
    return () => {
      mounted = false;
    };
  }, [slug, moduleId, navigate]);

  const selectSession = async (session) => {
    setCurrentSession(session);
    setLoadingVideo(true);
    setVideoSrc(null);

    if (!session.uuid) {
      setLoadingVideo(false);
      return;
    }

    try {
      const res = await api.get(`/video/auth/${session.uuid}`);
      if (res.data.success && res.data.data?.url) setVideoSrc(res.data.data.url);
    } catch (err) {
      console.error("Error al cargar video:", err);
    } finally {
      setLoadingVideo(false);
    }
  };

  useEffect(() => {
    if (!iframeRef.current || !currentSession) return;

    let player = null;
    let intervalId = null;
    let lastSentTime = 0;
    let completed = false;

    try {
      player = VdoPlayer.getInstance(iframeRef.current);
      const videoEl = player.video;

      const sendProgress = async (currentTime, duration) => {
        if (completed && currentTime !== duration) return;
        if (currentTime <= lastSentTime && currentTime !== duration) return;

        lastSentTime = currentTime;

        try {
          await api.post("/courses/progress/update", {
            lesson_uuid: currentSession.uuid,
            current_time: currentTime,
            duration: duration,
          });
        } catch (err) {
          console.error("❌ Error enviando progreso:", err);
        }
      };

      const onTimeUpdate = () => {
        const duration = Math.floor(videoEl.duration || 0);
        const ct = Math.floor(videoEl.currentTime || 0);
        if (!ct || !duration) return;

        if (ct === duration) {
          onEnded();
          return;
        }

        if (ct % 15 === 0 || ct === 1) {
          sendProgress(ct, duration);
        }
      };

      const onEnded = async () => {
        if (completed) return;
        completed = true;
        const duration = Math.floor(videoEl.duration || 0);

        if (lastSentTime < duration) {
          await sendProgress(duration, duration);
        }

        try {
          await api.post("/courses/progress/complete", {
            lesson_uuid: currentSession.uuid,
          });
        } catch (err) {
          console.error("❌ Error enviando finalización:", err);
        }

        if (intervalId) clearInterval(intervalId);
      };

      videoEl.addEventListener("timeupdate", onTimeUpdate);
      videoEl.addEventListener("ended", onEnded);

      intervalId = setInterval(() => {
        const duration = Math.floor(videoEl.duration || 0);
        const ct = Math.floor(videoEl.currentTime || 0);

        if (ct && duration && ct <= duration) {
          if (ct - lastSentTime >= 15 || ct === duration) {
            sendProgress(ct, duration);
          }
        }
      }, 1000);

      return () => {
        videoEl.removeEventListener("timeupdate", onTimeUpdate);
        videoEl.removeEventListener("ended", onEnded);
        if (intervalId) clearInterval(intervalId);
      };
    } catch (err) {
      console.error("Error inicializando VdoCipher Player:", err);
    }
  }, [videoSrc, currentSession]);

  if (loading) return <p>Cargando módulo...</p>;
  if (!moduleData) return null;

  const isFirstModule = !moduleData.prev;
  const isLastModule = !moduleData.next;

  return (
    <div className="page-viewcoursesession">
      <div className="coverage">
        <div className="op">
          <div className="dats">
            <p className="module-name" onClick={() => navigate(`/cursos/${slug}`)}>
              Módulo: {moduleData.title}
            </p>
            <h1 className="session-name">Clase: {currentSession?.name}</h1>
          </div>
          <div className="view-sessions hover-op" onClick={() => setMenuVisible((v) => !v)}>
            <p>{menuVisible ? "Vista Completa" : "Ver Sesiones"}</p>
          </div>
        </div>
        <div className="container">
          <div className={`session-content ${menuVisible ? "" : "max"}`}>
            <div className="session-video">
              {loadingVideo ? (
                <p>Cargando video...</p>
              ) : videoSrc ? (
                <iframe
                  ref={iframeRef}
                  src={videoSrc}
                  title="Video sesión"
                  width="100%"
                  height="400"
                  allow="encrypted-media"
                  allowFullScreen
                />
              ) : (
                <p>Video no disponible</p>
              )}
            </div>
          </div>
          {menuVisible && (
            <div className="lateral">
              <div className="menu">
                <p className="tit">Sesiones</p>
                <div className="sessions">
                  {moduleData.sessions.map((session) => {
                    const isActive = currentSession?.uuid
                      ? session.uuid === currentSession.uuid
                      : session.name === currentSession?.name;

                    return (
                      <div
                        key={session.uuid || session.name}
                        onClick={() => selectSession(session)}
                        className={`session-item ${isActive ? "active" : ""}`}
                        style={{ cursor: "pointer" }}
                      >
                        <FontAwesomeIcon icon={faPlay} className="icon-play" />
                        <p className="name">{session.name}</p>
                        <p className="duration">{session.duration}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="nav-modules">
                <div
                  className="redir hover-op"
                  onClick={() =>
                    isFirstModule ? navigate(`/mis-cursos/${slug}`) : navigate(`/mis-cursos/${slug}/${moduleData.prev}`)
                  }
                >
                  <FontAwesomeIcon icon={faAnglesLeft} />
                  <p>{isFirstModule ? "Ver todos los módulos" : "Ir al anterior módulo"}</p>
                </div>
                <div
                  className="redir hover-op"
                  onClick={() =>
                    isLastModule ? navigate(`/mis-cursos/${slug}`) : navigate(`/mis-cursos/${slug}/${moduleData.next}`)
                  }
                >
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
