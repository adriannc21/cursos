import "./Course.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faXmark, faUser, faClock, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

function Course({
  title,
  trailer_url,
  thumbnail,
  price,
  price_discount,
  description,
  duration,
  slug,
  teacher_name,
  category_name,
  total_sells,
  full,
}) {
  const navigate = useNavigate();
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    if (showFullscreen) {
      document.body.style.overflow = "hidden";
      setVideoLoading(true);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showFullscreen]);

  const handleNavigate = () => navigate(`/cursos/${slug}`);

  const getYoutubeId = (url) =>
    url?.includes("youtu.be/") ? url.split("youtu.be/")[1] : url?.split("v=")[1]?.split("&")[0] ?? "";

  const iframeSrc = trailer_url ? `https://www.youtube.com/embed/${getYoutubeId(trailer_url)}?autoplay=1&mute=1` : null;

  const maxLen = 200;
  const isLong = description.length > maxLen;
  const shortDesc = isLong
    ? description
        .slice(0, maxLen)
        .trim()
        .replace(/\s+\S*$/, "") + " ..."
    : description;

  const levelText = full ? "Nivel Avanzado" : "Nivel Básico";
  const courseType = full ? "Full" : "Lite";
  const displayTitle = `${title} - ${courseType}`;

  return (
    <>
      <div className="component-course">
        <div className="pres" onClick={() => setShowFullscreen(true)}>
          <div className="trailer-view">
            <FontAwesomeIcon className="icon-vt" icon={faEye} />
            <p>{t("home_course.view_trailer")}</p>
          </div>
          <img src={thumbnail} alt={title} width="400" height="225" className="course-image" />
          <p className="title">{displayTitle}</p>
          <p className="det">
            {t("home_course.category")}: {category_name}
          </p>
          <p className="price">{price_discount || price}</p>
        </div>
        <p className="description">{shortDesc}</p>
        <button className="btn-buy hover-op">{t("home_course.buy")}</button>
      </div>

      {showFullscreen && (
        <div className="component-course-trailer" onClick={() => setShowFullscreen(false)}>
          <div className="content" onClick={(e) => e.stopPropagation()}>
            <button className="out" onClick={() => setShowFullscreen(false)}>
              {t("home_course.close")}
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <div className="video-t">
              {iframeSrc ? (
                <>
                  {videoLoading && <div className="loader" />}
                  <iframe
                    src={iframeSrc}
                    allowFullScreen
                    onLoad={() => setVideoLoading(false)}
                    style={{ display: videoLoading ? "none" : "flex" }}
                  />
                </>
              ) : (
                <p>{t("home_course.trailer_notfound")}</p>
              )}
            </div>

            <div className="info">
              <div className="redir" onClick={handleNavigate}>
                <p>{displayTitle}</p>
                <FontAwesomeIcon className="icon-redir" icon={faArrowUpRightFromSquare} />
              </div>
              <p className="teacher">
                {t("home_course.by_course")} {teacher_name}
              </p>
              <div className="stats">
                <div className="time">
                  <FontAwesomeIcon className="icon" icon={faClock} />
                  <p className="val">{duration || "00:00"}</p>
                </div>
                <div className="users">
                  <FontAwesomeIcon className="icon" icon={faUser} />
                  <p className="val">{total_sells}</p>
                </div>
                <div className="level">
                  <div className="levels">
                    <span className="basic"></span>
                    <span className="inter"></span>
                    <span className="max"></span>
                  </div>
                  <p className="val">{levelText}</p>
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
                <button className="btn-buy">{t("home_course.buy_now")}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Course;
