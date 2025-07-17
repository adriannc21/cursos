import "./UserCourse.css";

function UserCourse({ image, cantstatus, title, status }) {
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

  const certificateUrl = "/certificados/certificado.pdf"; // Cambia a la ruta real

  return (
    <div className="component-usercourse">
      <div className="pres">
        <img src={image} alt={title} className="course-image" />
        <p className="cantstatus">{cantstatus}% de proceso</p>
        <div className="cantbar">
          <span style={{ width: `${cantstatus}%` }}></span>
        </div>
      </div>
      <p className="title">{title}</p>
      <p className="status">{statusMap[status]}</p>
      <div className="options">
        <button className="btn-view hover-op">{buttonLabelMap[status]}</button>
        {status === 3 && (
          <a href={certificateUrl} download className="btn-download hover-op">
            <img src="/icons/icon-download.svg" alt="" />
          </a>
        )}
      </div>
    </div>
  );
}

export default UserCourse;
