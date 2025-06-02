import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="con">
        <a href="/">
          <img className="logo" src="/logo-v2.png" alt="logo" />
        </a>
        <p className="flow">
          &copy; {new Date().getFullYear()} K3DLAB. Todos los derechos
          reservados.
        </p>
        <nav className="links">
          <a href="https://www.facebook.com/krear3d" target="t_blank">
            <img src="/icon-facebook.png" alt="" />
          </a>
          <a href="https://www.instagram.com/krear3d_peru/" target="t_blank">
            <img src="/icon-instagram.png" alt="" />
          </a>
          <a href="https://www.youtube.com/user/Krear3D" target="t_blank">
            <img src="/icon-youtube.png" alt="" />
          </a>
          <a href="https://pe.linkedin.com/company/krear-3d" target="t_blank">
            <img src="/icon-linkedin.png" alt="" />
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
