import "./Nav.css";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@contexts";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faBars } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { setCountry } from "@store/slices/globalSlice";

function Nav() {
  const { userData, isAuthenticated, logout, loading } = useAuth();
  const [showCoursesMenu, setShowCoursesMenu] = useState(false);
  const { t } = useTranslation();
  const userMenuRef = useRef(null);
  const countryRef = useRef(null);
  const location = useLocation();
  const userInitial = userData?.first_name?.trim()?.charAt(0)?.toUpperCase() || "";
  const cart = useSelector((state) => state.global.cart);
  const cartCount = cart.length;
  const dispatch = useDispatch();
  const countries = useSelector((state) => state.global.countries);
  const country = useSelector((state) => state.global.country);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (countryRef.current && !countryRef.current.contains(e.target)) {
        setCountryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const selectedCountry = countries.find((c) => c.iso === country);

  const handleChangeCountry = (newIso) => {
    dispatch(setCountry(newIso));
    setCountryDropdownOpen(false);
  };

  return (
    <nav className="component-nav">
      <div className="coverage">
        <Link to="/" className="inicio">
          <img
            className="logo"
            src="/logo-v1.svg"
            width="112"
            height="19"
            alt="logo-k3dlab"
            loading="lazy"
          />
        </Link>

        <div className="links1">
          <div
            className="hover-container"
            onMouseEnter={() => setShowCoursesMenu(true)}
            onMouseLeave={() => setShowCoursesMenu(false)}
          >
            <Link to="/cursos" className="btn courses">
              <p>Cursos</p>
            </Link>

            {showCoursesMenu && (
              <div className="courses-dropdown" onClick={(e) => e.stopPropagation()}>
                <div className="list">
                  <Link to="#">Impresión 3D</Link>
                </div>
              </div>
            )}
          </div>
          {/* <Link to="#" className="btn teachers">
            <p>Profesores</p>
          </Link> */}
        </div>

        <div className="country-selector" ref={countryRef} onClick={() => setCountryDropdownOpen((prev) => !prev)}>
          <div className="selected-country">
            {selectedCountry && (
              <>
                <img src={selectedCountry.flag} alt={selectedCountry.name} className="flag" />
                <span className="iso">{selectedCountry.iso}</span>
                <FontAwesomeIcon icon={faChevronDown} className="chevron" />
              </>
            )}
          </div>
          {countryDropdownOpen && (
            <div className="dropdown-country-list">
              <div className="scroll-container">
                {countries.map((countryItem) => (
                  <div
                    key={countryItem.id}
                    className={`dropdown-item ${country === countryItem.iso ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChangeCountry(countryItem.iso);
                    }}
                  >
                    <img src={countryItem.flag} alt={countryItem.iso} className="flag" />
                    <span className="iso">{countryItem.iso}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="redirs">
          <Link to="/carrito-de-compras" className="btn shoppingcart" aria-label="Carrito de compras">
            <img src="/icons/icon-shopcar-black.svg" alt="Cart" loading="lazy" />
            <span className="count-cart">{cartCount}</span>
          </Link>

          {/* Solo condicionar login/usuario, nav base siempre visible */}
          {!loading && !isAuthenticated && (
            <Link to="/iniciar-sesion" className="btn login" aria-label={t("nav.login")}>
              <p>{t("nav.login")}</p>
              <FontAwesomeIcon className="icon-login" icon={faUser} />
            </Link>
          )}

          {!loading && isAuthenticated && (
            <div className="user-menu" ref={userMenuRef}>
              <button
                type="button"
                className="us"
                onClick={() => {
                  setUserMenuOpen((prev) => !prev);
                  setCountryDropdownOpen(false);
                }}
              >
                {userInitial}
              </button>

              {userMenuOpen && (
                <div className="menu" role="menu">
                  <span className="trin" aria-hidden="true"></span>
                  <p className="hello" tabIndex={-1}>
                    <span>Hola, {userData?.first_name}</span>
                  </p>
                  <span className="line" aria-hidden="true"></span>
                  <Link to="/perfil" className="menu-item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                    {t("nav.profile")}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="menu-item"
                    role="menuitem"
                  >
                    {t("nav.logout")}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="menu-mobile" onClick={() => setMobileMenuOpen((prev) => !prev)}>
            <FontAwesomeIcon icon={faBars} className="icon" />
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-fullscreen-menu">
          <div className="links1-mobile">
            <Link to="/cursos" className="btn courses">
              <p>Cursos</p>
            </Link>
            <Link to="#" className="btn teachers">
              <p>Profesores</p>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Nav;
