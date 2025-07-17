import "./Nav.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@contexts";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faUser } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

function Nav() {
  const { userData, isAuthenticated, logout, loading } = useAuth();
  const { t, i18n } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setShowMenu(!showMenu);

  const userInitial = userData?.first_name?.trim()?.charAt(0)?.toUpperCase() || "";
  const currentLang = i18n.language;
  const isSpanish = currentLang === "es";

  const changeLang = (lang) => i18n.changeLanguage(lang);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return null;

  return (
    <div className="component-nav">
      <div className="con">
        <Link to="/" className="inicio">
          <img className="logo" src="/logo-v1-rdm.webp" width="160" height="28" alt="logo-k3dlab" />
        </Link>

        <div className="language">
          {isSpanish ? (
            <div className="lang" onClick={() => changeLang("en")}>
              <div className="flag">
                <img src="/icons/flag-spain.svg" alt="ES" />
              </div>
              <p>ES</p>
            </div>
          ) : (
            <div className="lang" onClick={() => changeLang("es")}>
              <div className="flag">
                <img src="/icons/flag-usa.svg" alt="EN" />
              </div>
              <p>EN</p>
            </div>
          )}
        </div>

        <div className="redirs">
          {!isAuthenticated && (
            <Link to="/iniciar-sesion" className="btn login">
              <p>{t("nav.login")}</p>
              <FontAwesomeIcon className="icon-login" icon={faUser} />
            </Link>
          )}

          <Link to="/cursos" className="btn viewcourses">
            <p>{t("nav.view_courses")}</p>
            <FontAwesomeIcon className="icon-book" icon={faBook} />
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/carrito-de-compras" className="btn shoppingcart">
                <img src="/icons/icon-shopcar.svg" alt="Cart" />
              </Link>

              <div className="user-menu" ref={menuRef}>
                <span className="us" onClick={toggleMenu}>
                  {userInitial}
                </span>

                {showMenu && (
                  <div className="menu">
                    <span className="trin"></span>
                    <p className="hello">
                      <span>Hola, {userData?.first_name}</span>
                      {userData?.country_flag && (
                        <img
                          src={userData.country_flag}
                          alt={userData.country_name}
                          title={userData.country_name}
                          style={{ marginLeft: "0.5rem", verticalAlign: "middle" }}
                        />
                      )}
                    </p>
                    <span className="line"></span>

                    <Link to="/perfil" className="menu-item" onClick={() => setShowMenu(false)}>
                      {t("nav.profile")}
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setShowMenu(false);
                        navigate("/");
                      }}
                      className="menu-item"
                    >
                      {t("nav.logout")}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;
