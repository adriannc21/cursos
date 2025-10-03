import "./UserCourse.css";
import { useNavigate } from "react-router-dom";

function UserCourse({ image, cantstatus, title, status, slug }) {
  const navigate = useNavigate();

  const statusMap = {
    1: "Pendiente",
    2: "En curso",
    3: "Finalizado",
  };

  const buttonLabelMap = {
    1: "Iniciar",
    2: "Continuar",
    3: "Revisar",
  };

  const certificateUrl = "/certificados/certificado.pdf";

  const handleClick = () => {
    navigate(`/mis-cursos/${slug}`);
  };

  return (
    <div className="component-usercourse">
      <div className="pres">
        <img src={image} alt={title} className="course-image" />
        <p className="cantstatus">{cantstatus}% de progreso</p>
        <div className="cantbar">
          <span style={{ width: `${cantstatus}%` }}></span>
        </div>
      </div>
      <p className="title">{title}</p>
      <p className="status">{statusMap[status]}</p>
      <div className="options">
        <button className="btn-view hover-op" onClick={handleClick}>
          {buttonLabelMap[status]}
        </button>
        {status === 3 && (
          <a href={certificateUrl} download className="btn-download hover-op">
            <img src="/icons/icon-download.svg" alt="Descargar certificado" />
          </a>
        )}
      </div>
    </div>
  );
}

export default UserCourse;
