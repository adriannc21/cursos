import "./Course.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faXmark, faClock, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import api from "@api/axios";

function Course({
  uuid,
  title,
  thumbnail,
  price,
  price_discount,
  description,
  duration,
  slug,
  teacher_name,
  category_name,
  version,
}) {
  const navigate = useNavigate();
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const displayLevel = version === "lite" ? "Básico" : "Avanzado";
  const { t } = useTranslation();

  const displayTitle = version === "lite" ? `${title} - Lite` : title;

  useEffect(() => {
    if (showFullscreen && uuid) {
      document.body.style.overflow = "hidden";
      setHasFetched(false);
      api
        .get(`/video/play/${uuid}`)
        .then((res) => {
          if (res.data.success && res.data.data?.url) {
            setVideoSrc(res.data.data.url);
          } else {
            setVideoSrc(null);
          }
        })
        .catch(() => setVideoSrc(null))
        .finally(() => setHasFetched(true));
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showFullscreen, uuid]);

  const handleNavigate = () => {
    navigate(`/cursos/${slug}`, { state: { version } });
  };

  const maxLen = 200;
  const isLong = description.length > maxLen;
  const shortDesc = isLong
    ? description
        .slice(0, maxLen)
        .trim()
        .replace(/\s+\S*$/, "") + " ..."
    : description;

  return (
    <>
      <div className="component-course">
        <div className="pres" onClick={() => setShowFullscreen(true)}>
          <div className="trailer-view">
            <FontAwesomeIcon className="icon-vt" icon={faEye} />
            <p>{t("home_course.view_trailer")}</p>
          </div>
          <img src={thumbnail} alt={displayTitle} width="400" height="225" className="course-image" />
          <p className="title">{displayTitle}</p>
          <p className="det">
            {t("home_course.category")}: {category_name}
          </p>
          <p className="price">{price}</p>
        </div>
        <p className="description">{shortDesc}</p>
        <button className="btn-buy hover-op" onClick={handleNavigate}>
          {t("home_course.buy")}
        </button>
      </div>

      {showFullscreen && (
        <div className="component-course-trailer" onClick={() => setShowFullscreen(false)}>
          <div className="content" onClick={(e) => e.stopPropagation()}>
            <button className="out" onClick={() => setShowFullscreen(false)}>
              {t("home_course.close")}
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <div className="video-t">
              {hasFetched && videoSrc ? (
                <iframe src={videoSrc} allow="encrypted-media" allowFullScreen className="course-iframe" />
              ) : hasFetched && !videoSrc ? (
                <p>{t("home_course.trailer_notfound")}</p>
              ) : null}
            </div>

            <div className="info">
              <div className="redir" onClick={handleNavigate}>
                <p>
                  {displayTitle} <FontAwesomeIcon className="icon-redir" icon={faArrowUpRightFromSquare} />
                </p>
              </div>
              <p className="teacher">
                {t("home_course.by_course")} {teacher_name}
              </p>
              <div className="stats">
                <div className="time">
                  <FontAwesomeIcon className="icon" icon={faClock} />
                  <p className="val">{duration || "00:00"}</p>
                </div>
                <div className="level">
                  <div className="levels">
                    <span className="basic"></span>
                    <span className="inter"></span>
                    <span className="max"></span>
                  </div>
                  <p className="val">{displayLevel}</p>
                </div>
              </div>
              <span className="line"></span>
              <p className="description">
                {shortDesc}
                {isLong && (
                  <span className="view-more" onClick={handleNavigate}>
                    {t("home_course.view_more")}
                  </span>
                )}
              </p>
              <div className="buy-options">
                <div className="price">
                  <p>{price_discount}</p>
                  <span>{price}</span>
                </div>
                <button className="btn-buy hover-op" onClick={handleNavigate}>
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Course;
