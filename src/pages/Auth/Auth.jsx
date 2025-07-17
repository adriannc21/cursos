import "./Auth.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { useTranslation } from "react-i18next";
import { useAuth } from "@contexts/AuthContext";

function Auth({ isLogin }) {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginView, setIsLoginView] = useState(isLogin);
  const [showError, setShowError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setIsLoginView(location.pathname === "/iniciar-sesion");
  }, [location.pathname]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setShowError("");

    try {
      const url = `${import.meta.env.VITE_API_URL}/auth/login`;
      const headers = {
        "Content-Type": "application/json",
        "Api-Key": import.meta.env.VITE_API_KEY,
        Language: currentLanguage,
      };
      const body = { email, password };

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.data?.message || "Error al iniciar sesión.");
      }

      const access_token = data?.data?.access_token;
      if (!access_token) throw new Error("Token inválido.");

      const success = await login(access_token); // solo guarda y setea
      if (success) {
        navigate("/perfil");
      } else {
        throw new Error("Error guardando el token.");
      }
    } catch (err) {
      console.error("❌ ERROR login:", err);
      setShowError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": import.meta.env.VITE_API_KEY,
          Language: currentLanguage,
        },
        body: JSON.stringify({ email: regEmail }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.data?.message || "Error al registrar");

      setShowModal(true);
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-auth">
      <div className="auth-container">
        {/* Login */}
        <div className={`login ${!isLoginView ? "no-visible" : ""}`}>
          <div className="container">
            <h1 className="title">Inicio de Sesión</h1>
            <p className="flow-ini">Accede y sigue aprendiendo con beneficios exclusivos.</p>
            <form onSubmit={handleLogin} className="f" noValidate>
              <div className={`cam email ${email ? "filled" : ""}`}>
                <label htmlFor="email">Email</label>
                <input
                  maxLength={50}
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={`cam password ${password ? "filled" : ""}`}>
                <label htmlFor="password">Contraseña</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={30}
                  required
                />
                {password && (
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Mostrar u ocultar contraseña"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                )}
              </div>

              {!!showError && <p className="messages">{showError}</p>}

              <button type="submit" className="btn-login">
                Iniciar Sesión
              </button>
            </form>

            <div className="redir-register">
              <p>¿No tienes una cuenta?</p>
              <button type="button" className="link" onClick={() => navigate("/registro")}>
                Regístrate
              </button>
            </div>
          </div>
        </div>

        {/* Register */}
        <div className={`register ${isLoginView ? "no-visible" : ""}`}>
          <div className="container">
            {showModal ? (
              <div className="confirmation-message">
                <h1 className="title">Revisa tu correo</h1>
                <div className="icon-email">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <p className="flow-ini">
                  Te hemos enviado un enlace para verificar tu cuenta. Por favor, revisa tu bandeja de entrada.
                </p>
                <button className="btn-return hover-op" onClick={() => setShowModal(false)}>
                  Volver
                </button>
              </div>
            ) : (
              <>
                <h1 className="title">Crea una cuenta</h1>
                <p className="flow-ini">Ingresa tu correo y te enviaremos un enlace para verificar tu cuenta.</p>
                <form className="f" onSubmit={handleRegister} noValidate>
                  <div className={`cam email ${regEmail ? "filled" : ""}`}>
                    <label htmlFor="regEmail">Email</label>
                    <input
                      id="regEmail"
                      maxLength={50}
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="terms">
                    <input type="checkbox" name="tyc" id="tyc" required />
                    <label htmlFor="tyc">Acepto los Términos y Condiciones</label>
                  </div>
                  <button type="submit" className="btn-register" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando correo de verificación..." : "Crear cuenta"}
                  </button>
                </form>

                <div className="redir-login">
                  <p>¿Tienes una cuenta?</p>
                  <button type="button" className="link" onClick={() => navigate("/iniciar-sesion")}>
                    Inicia sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
