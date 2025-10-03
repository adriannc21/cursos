import "./Footer.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faYoutube, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setLanguage } from "@store/slices/globalSlice";

function Footer() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const currentLang = i18n.language;

  const switchLang = () => {
    const newLang = currentLang === "es" ? "en" : "es";
    i18n.changeLanguage(newLang);
    dispatch(setLanguage(newLang));
    setOpen(false);
  };

  return (
    <footer className="component-footer">
      <div className="coverage">
        <Link to="/" className="logo">
          <img src="/logo-v2-rdm.webp" width="160" height="28" alt="logo" />
        </Link>

        <p className="flow">
          &copy; {new Date().getFullYear()} {t("footer.all_rights_reserved")}
        </p>

        <div className="links">
          <div className="redes">
            <a
              className="red"
              href="https://www.instagram.com/krear3d_peru/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="instagram"
            >
              <FontAwesomeIcon className="icon" icon={faInstagram} />
            </a>
            <a
              className="red"
              href="https://www.facebook.com/krear3d"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="facebook"
            >
              <FontAwesomeIcon className="icon" icon={faFacebookF} />
            </a>
            <a
              className="red"
              href="https://www.youtube.com/user/Krear3D"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="youtube"
            >
              <FontAwesomeIcon className="icon" icon={faYoutube} />
            </a>
            <a
              className="red"
              href="https://pe.linkedin.com/company/krear-3d"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="linkedin"
            >
              <FontAwesomeIcon className="icon" icon={faLinkedinIn} />
            </a>
          </div>

          <div className="language" onClick={() => setOpen(!open)}>
            <div className="current-lang">
              <img src="/icons/icon-translate.svg" alt="language" className="lang-icon" />
              <span>{currentLang === "es" ? "Español" : "English"}</span>
              <FontAwesomeIcon icon={faChevronUp} className="arrow" />
            </div>

            {open && (
              <div className="list-lang" onClick={switchLang}>
                <div className="option">
                  <span>{currentLang === "es" ? "English" : "Español"}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
