import "./Footer.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faYoutube, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="component-footer">
      <div className="con">
        <Link to="/" className="logo">
          <img src="/logo-v2-rdm.webp" width="160" height="28" alt="logo" />
        </Link>
        <p className="flow">&copy; {new Date().getFullYear()} {t("footer.all_rights_reserved")}</p>
        <nav className="links">
          <a href="https://www.instagram.com/krear3d_peru/" target="t_blank" aria-label="red-social">
            <FontAwesomeIcon className="icon" icon={faInstagram} />
          </a>
          <a href="https://www.facebook.com/krear3d" target="t_blank" aria-label="red-social">
            <FontAwesomeIcon className="icon" icon={faFacebookF} />
          </a>
          <a href="https://www.youtube.com/user/Krear3D" target="t_blank" aria-label="red-social">
            <FontAwesomeIcon className="icon" icon={faYoutube} />
          </a>
          <a href="https://pe.linkedin.com/company/krear-3d" target="t_blank" aria-label="red-social">
            <FontAwesomeIcon className="icon" icon={faLinkedinIn} />
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
