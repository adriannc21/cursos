import "./Auth.css";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCheck, faXmark, faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

function Verify() {
  const birthdayRef = useRef(null);
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const { login } = useAuth();
  const { clave } = useParams();
  const [isVerified, setIsVerified] = useState(false);
  const [checkCompleted, setCheckCompleted] = useState(false);
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [isCountryFocused, setIsCountryFocused] = useState(false);
  const [countryId, setCountryId] = useState(null);
  const [countries, setCountries] = useState([]);
  const [birthday, setBirthday] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isBirthdayFocused, setIsBirthdayFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
    match: false,
  });
  const selectedCountry = countries.find((c) => c.id === countryId);
  const getIcon = (condition) => (
    <FontAwesomeIcon icon={condition ? faCircleCheck : faCircleXmark} className={condition ? "valid" : "invalid"} />
  );

  useEffect(() => {
    const confirmarToken = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register-confirmation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Api-Key": import.meta.env.VITE_API_KEY,
          },
          body: JSON.stringify({ token: clave }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.data?.message || "Token inválido");
        }

        setIsVerified(true);
      } catch (err) {
        setErrorMessage(err.message || "Error desconocido");
        setIsVerified(false);
      } finally {
        setCheckCompleted(true);
      }
    };

    const fetchCountries = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/general/countries`, {
          headers: {
            "Content-Type": "application/json",
            "Api-Key": import.meta.env.VITE_API_KEY,
          },
        });
        const json = await res.json();
        setCountries(json.data);
      } catch (err) {
        console.error("Error cargando países:", err);
      }
    };

    confirmarToken();
    fetchCountries();
  }, [clave]);

  return (
    <div className="page-auth verify">
      <div className="auth-container">
        {checkCompleted && (
          <div className="message-verify">
            {isVerified ? (
              <div className="icon-check">
                <FontAwesomeIcon className="icon" icon={faCheck} />
              </div>
            ) : (
              <div className="icon-error">
                <FontAwesomeIcon className="icon" icon={faXmark} />
              </div>
            )}
            <p className="title-ver">{isVerified ? "¡Correo verificado con éxito!" : "Error"}</p>
            <p className="flow">
              {isVerified
                ? "Ya validamos tu dirección de correo electrónico. Ahora completa tus datos para finalizar tu registro y comenzar a disfrutar de todos los beneficios."
                : errorMessage}
            </p>
          </div>
        )}

        {isVerified && (
          <div className="register-verify">
            <p className="title-p">Completa tus datos</p>
            <form
              className="f"
              onSubmit={async (e) => {
                e.preventDefault();

                const allValid = Object.values(passwordValidations).every(Boolean);
                if (!allValid) return;

                const birthDate = new Date(birthday + "T00:00:00");
                const today = new Date();

                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();

                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                  age--;
                }

                const isBirthdayValid = age >= 18;

                if (!isBirthdayValid) {
                  birthdayRef.current.setCustomValidity("Debes tener al menos 18 años.");
                  birthdayRef.current.reportValidity();
                  return;
                } else {
                  birthdayRef.current.setCustomValidity("");
                }

                try {
                  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "Api-Key": import.meta.env.VITE_API_KEY,
                      Language: currentLanguage,
                    },
                    body: JSON.stringify({
                      token: clave,
                      first_name: name,
                      last_name: lastname,
                      country_id: countryId,
                      birthday,
                      password,
                    }),
                  });

                  const data = await response.json();

                  if (!response.ok) throw new Error(data?.message || "Ocurrió un error en el registro.");

                  const token = data?.data?.access_token;
                  if (!token) throw new Error("Token no recibido");

                  await login(token); // ✅ login solo con token
                  navigate("/perfil"); // ✅ redirección directa
                } catch (err) {
                  alert(err.message || "Error al registrar.");
                }
              }}
            >
              <div className={`cam name ${name ? "filled" : ""}`}>
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  maxLength={40}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className={`cam lastname ${lastname ? "filled" : ""}`}>
                <label htmlFor="lastname">Apellido</label>
                <input
                  type="text"
                  name="lastname"
                  id="lastname"
                  maxLength={40}
                  required
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </div>

              <div
                className={`cam country ${isCountryFocused || countryId ? "filled" : ""} ${
                  isCountryFocused ? "focused" : ""
                }`}
                tabIndex={0}
                onFocus={() => setIsCountryFocused(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setIsCountryFocused(false);
                    setDropdownOpen(false);
                  }, 100);
                }}
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <label htmlFor="countryid">País</label>

                <div className="custom-dropdown">
                  <div className="selected-option">
                    {selectedCountry && (
                      <>
                        <img
                          src={selectedCountry.flag}
                          alt={selectedCountry.name}
                          className="flag"
                          width={22}
                          height={16}
                        />
                        {selectedCountry.name}
                      </>
                    )}
                  </div>

                  {dropdownOpen && (
                    <div className="dropdown-list">
                      {countries.map((country) => (
                        <div
                          key={country.id}
                          className="dropdown-item"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setCountryId(country.id);
                          }}
                        >
                          <img src={country.flag} alt={country.name} width={22} height={16} />
                          <span>{country.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={`cam birthday ${birthday ? "filled" : ""} ${isBirthdayFocused ? "focused" : ""}`}>
                <label htmlFor="birthday">Fecha de nacimiento</label>
                <input
                  type="date"
                  name="birthday"
                  id="birthday"
                  ref={birthdayRef}
                  required
                  value={birthday}
                  onChange={(e) => {
                    setBirthday(e.target.value);
                    birthdayRef.current?.setCustomValidity("");
                  }}
                  onFocus={() => setIsBirthdayFocused(true)}
                  onBlur={() => setIsBirthdayFocused(false)}
                />
              </div>

              <div className={`cam password ${password ? "filled" : ""}`}>
                <label htmlFor="password">Contraseña</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  maxLength={20}
                  required
                  value={password}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPassword(value);

                    setPasswordValidations((prev) => ({
                      ...prev,
                      minLength: value.length >= 8,
                      hasUppercase: /[A-Z]/.test(value),
                      hasNumber: /\d/.test(value),
                      match: value === confirmPassword,
                    }));
                  }}
                />
                {password && (
                  <button
                    type="button"
                    tabIndex="-1"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Mostrar u ocultar contraseña"
                  >
                    <FontAwesomeIcon className="icon-eye" icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                )}
              </div>

              <div className={`cam password ${confirmPassword ? "filled" : ""}`}>
                <label htmlFor="confirmPassword">Repetir contraseña</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  maxLength={20}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setConfirmPassword(value);

                    setPasswordValidations((prev) => ({
                      ...prev,
                      match: value === password,
                    }));
                  }}
                />
                {confirmPassword && (
                  <button
                    type="button"
                    tabIndex="-1"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Mostrar u ocultar contraseña"
                  >
                    <FontAwesomeIcon className="icon-eye" icon={showConfirmPassword ? faEyeSlash : faEye} />
                  </button>
                )}
              </div>

              <div className="validators">
                <h1 className="tv">La contraseña debe cumplir los siguientes requisitos:</h1>
                <p className="req">{getIcon(passwordValidations.minLength)} Mínimo 8 caracteres</p>
                <p className="req">{getIcon(passwordValidations.hasUppercase)} Una letra mayúscula</p>
                <p className="req">{getIcon(passwordValidations.hasNumber)} Un número</p>
                <p className="req">{getIcon(passwordValidations.match)} Las contraseñas coinciden</p>
              </div>
              <button type="submit" className="btn-continue hover-op">
                Continuar
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Verify;
