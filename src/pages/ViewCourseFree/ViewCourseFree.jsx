import "./ViewCourseFree.css";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPaperclip, faAward } from "@fortawesome/free-solid-svg-icons";
import { faClock, faCirclePlay } from "@fortawesome/free-regular-svg-icons";

function ViewCourseFree() {
  const COUNTDOWN_DURATION = 2 * 60 * 60 * 1000;
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_DURATION);

  useEffect(() => {
    let expiresAt = localStorage.getItem("offerCountdownExpiresAt");
    if (!expiresAt) {
      expiresAt = Date.now() + COUNTDOWN_DURATION;
      localStorage.setItem("offerCountdownExpiresAt", expiresAt);
    } else {
      expiresAt = parseInt(expiresAt);
    }
    const updateCountdown = () => {
      const now = Date.now();
      const remaining = expiresAt - now;
      if (remaining <= 0) {
        const newExpiresAt = now + COUNTDOWN_DURATION;
        localStorage.setItem("offerCountdownExpiresAt", newExpiresAt);
        expiresAt = newExpiresAt;
        setTimeLeft(COUNTDOWN_DURATION);
      } else {
        setTimeLeft(remaining);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [COUNTDOWN_DURATION]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="page-viewcoursefree">
      <div className="video-container-mb">
        <iframe src="https://www.youtube.com/embed/bdF68B_2PJE" allowFullScreen />
      </div>
      <div className="about-mb">
        <p className="title">Diseño 3D</p>
        <p className="description">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi, architecto nemo? Delectus earum asperiores
          commodi nobis dicta beatae quisquam. Ipsa numquam praesentium architecto quae fugiat! Amet, laboriosam natus!
          Quis, eius!
        </p>
      </div>
      <div className="con">
        <div className="container">
          <div className="c1">
            <div className="video-container">
              <iframe src="https://www.youtube.com/embed/bdF68B_2PJE" allowFullScreen />
            </div>
            <div className="about">
              <p className="title">Diseño 3D</p>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi, architecto nemo? Delectus earum
                asperiores commodi nobis dicta beatae quisquam. Ipsa numquam praesentium architecto quae fugiat! Amet,
                laboriosam natus! Quis, eius!
              </p>
            </div>
            <div className="utilities">
              <p className="subt">¿Qué necesitas para empezar?</p>
              <div className="ut">
                <div className="con-icon">
                  <FontAwesomeIcon className="icon-check" icon={faCheck} />
                </div>
                <p className="s">Computadora con acceso a internet.</p>
              </div>
              <div className="ut">
                <div className="con-icon">
                  <FontAwesomeIcon className="icon-check" icon={faCheck} />
                </div>
                <p className="s">Conocimientos previos en programas de diseño 3d.</p>
              </div>
            </div>
            <div className="skills">
              <p className="quest">¿Que aprenderás en el curso de Diseño 3D?</p>
              <div className="sks">
                <div className="sk">
                  <FontAwesomeIcon className="icon-check-l" icon={faCheck} />
                  <p>
                    Capacidad 1 Lorem ipsum dolor, sit ametasdas sad consectetur adipisicing elit. Nulla suscipit
                    consequatur
                  </p>
                </div>
                <div className="sk">
                  <FontAwesomeIcon className="icon-check-l" icon={faCheck} />
                  <p>
                    Capacidad 2 Lorem ipsum dolor, sit amet asdadconsectetur adipisicing elit. Nulla suscipit
                    consequatur
                  </p>
                </div>
                <div className="sk">
                  <FontAwesomeIcon className="icon-check-l" icon={faCheck} />
                  <p>
                    Capacidad 3 Lorem ipsum dolor, sitsds amet consectetur adipisicing elit. Nulla suscipit consequatur
                  </p>
                </div>
                <div className="sk">
                  <FontAwesomeIcon className="icon-check-l" icon={faCheck} />
                  <p>
                    Capacidad 3 Lorem ipsum dolor, sit amet asdas as consectetur adipisicing elit. Nulla suscipit
                    consequatur
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="c2">
            <div className="p1">
              <div className="ofert">
                <p className="exc">¡Oferta por tiempo limitado!</p>
                <div className="time">{formatTime(timeLeft)}</div>
                <div className="price">
                  <p>S/ 99.00</p> <span>120.00</span>
                </div>
              </div>
              <div className="btn-buy hover-op">Cómpralo ahora</div>
              <div className="membership">
                <p className="flow">
                  Disfruta acceso ilimitado a todos los cursos con nuestra membresía premium. Aprende sin límites,
                  cuando quieras.
                </p>
                <button className="btn-member">Suscribirme Ahora</button>
              </div>
            </div>
            <div className="p2">
              <p className="indash">Información del curso:</p>
              <div className="dash">
                <div className="d">
                  <FontAwesomeIcon className="icon" icon={faClock} />
                  <p className="txt">
                    Duración: <span>1h 12m</span>
                  </p>
                </div>
                <div className="d">
                  <FontAwesomeIcon className="icon" icon={faCirclePlay} />
                  <p className="txt">
                    Sesiones: <span>4</span>
                  </p>
                </div>
                <div className="d">
                  <div className="levels">
                    <span className="basic"></span>
                    <span className="inter"></span>
                    <span className="max"></span>
                  </div>
                  <p className="txt">
                    Nivel: <span>Basico</span>
                  </p>
                </div>
                <div className="d">
                  <FontAwesomeIcon className="icon" icon={faPaperclip} />
                  <p className="txt">
                    Archivos: <span>2</span>
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
