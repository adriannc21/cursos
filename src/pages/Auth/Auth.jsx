import "./Auth.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { useAuth } from "@contexts/AuthContext";
import api from "@api/axios";

function Auth({ isLogin }) {
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
  const [registerMessage, setRegisterMessage] = useState("");

  useEffect(() => {
    setIsLoginView(location.pathname === "/iniciar-sesion");
  }, [location.pathname]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setShowError("");

    try {
      const { data } = await api.post("/auth/login", { email, password }, { withCredentials: true });
      if (!data.success) {
        throw new Error(data?.data?.message || "Error al iniciar sesión.");
      }

      const access_token = data?.data?.access_token;
      if (!access_token) throw new Error("Token inválido.");

      const success = await login(access_token);
      if (success) {
        navigate("/perfil");
      } else {
        throw new Error("Error guardando el token.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.data?.message || err.message || "Error desconocido";
      setShowError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setShowError("");

    try {
      const { data } = await api.post("/auth/register", { email: regEmail });

      if (!data.success) throw new Error(data?.data?.message || "Error al registrar");

      setRegisterMessage(data.data.message || "Revisa tu correo");
      setShowModal(true);
    } catch (error) {
      setShowError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-auth">
      <div className="auth-container">
        <div className={`login ${!isLoginView ? "no-visible" : ""}`}>
          <div className="container">
            <Link to="/" className="btn home">
              <img src="/logo-v1.svg" alt="" />
            </Link>
            <h1 className="title">Inicio de Sesión</h1>
            <p className="flow-ini">Accede y sigue aprendiendo con beneficios exclusivos.</p>
            <form onSubmit={handleLogin} className="f">
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
              <button type="submit" className="btn-login" disabled={isSubmitting}>
                {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
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

        <div className={`register ${isLoginView ? "no-visible" : ""}`}>
          <div className="container">
            {showModal ? (
              <div className="confirmation-message">
                <h1 className="title">{registerMessage}</h1>
                <div className="icon-email">
                  <FontAwesomeIcon icon={faEnvelope} className="icon" />
                </div>
                <p className="flow-ini">
                  Te hemos enviado un enlace para verificar tu cuenta. Por favor, revisa tu bandeja de entrada o carpeta
                  de spam.
                </p>
              </div>
            ) : (
              <>
                <Link to="/" className="btn home">
                  <img src="/logo-v1.svg" alt="" />
                </Link>
                <h1 className="title">Crea una cuenta</h1>
                <p className="flow-ini">Ingresa tu correo y te enviaremos un enlace para verificar tu cuenta.</p>
                <form className="f" onSubmit={handleRegister}>
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
