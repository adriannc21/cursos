import Logo from "@assets/logo.png";
import "./Nav.css";

function Nav() {
  return (
    <div className="nav">
      <div className="con">
        <a href="/">
          <img className="logo" src={Logo} alt="Krear 3D Lab" />
        </a>
        <div className="redirs">
          <button className="btn-login">Iniciar Sesión</button>
          <button className="btn-viewcourses">Ver Cursos</button>
        </div>
      </div>
    </div>
  );
}

export default Nav;
