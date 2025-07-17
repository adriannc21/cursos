import "./ViewCourseModule.css";
import { useParams, useNavigate } from "react-router-dom";
import DataCourses from "@src/jsons/courses.json";
import DataComments from "@src/jsons/comments.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt, faLock } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

function ViewCourseModule() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const course = DataCourses.find((c) => c.url === slug);
  const averageStars = DataComments.reduce((sum, comment) => sum + comment.stars, 0) / DataComments.length;
  if (!course) {
    return <p>Curso no encontrado</p>;
  }

  return (
    <div className="page-viewcoursemodule">
      <div className="con">
        <div className="container">
          <div className="banner">
            <div className="data">
              <p className="name-course">{course.title}</p>
              <p className="name-teacher">
                con <span>Pedro Lopez</span>
              </p>
            </div>
            <div className="sec">
              <p className="category">Impresión 3D</p>
              <img src="/logo-v3.webp" alt="logo" />
            </div>
          </div>
          <div className="c">
            <div className="c1">
              <div className="about">
                <h1>Acerca del curso</h1>
                <div className="flow">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente maiores vel ad voluptas ipsam.
                  Aliquid praesentium quibusdam, voluptatum quaerat accusantium rem assumenda quia, similique id
                  delectus sapiente soluta, tempora placeat! Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Dolorem consequatur corporis sed suscipit dicta fuga quam delectus cupiditate omnis, ea est deleniti
                  adipisci facilis ipsum quasi eaque vitae atque necessitatibus.
                </div>
              </div>
              <div className="module-list">
                <h1 className="subt">Modulos del curso</h1>
                <div className="modules">
                  {course.modules.map((module, index) => {
                    const isLocked = index >= course.modules.length - 2;

                    return (
                      <div
                        key={index}
                        className={`module-item ${isLocked ? "locked" : ""}`}
                        style={{ position: "relative" }}
                      >
                        {isLocked && (
                          <div className="overlay-lock">
                            <FontAwesomeIcon icon={faLock} className="lock-icon" />
                            <p className="lock-message">Adquiere la versión Full para acceder</p>
                            <button className="btn-upgrade" onClick={() => navigate("/membresia")}>
                              Comprar versión Full
                            </button>
                          </div>
                        )}

                        <p className="number">Módulo {String(index + 1).padStart(2, "0")}</p>
                        <p className="title">{module.title}</p>
                        <p className="progress">Progreso {isLocked ? 0 : module.progress}%</p>
                        <div className="bar">
                          <span style={{ width: `${isLocked ? 0 : module.progress}%` }}></span>
                        </div>
                        <button
                          className={`btn-view ${!isLocked ? "hover-op" : ""}`}
                          disabled={isLocked}
                          onClick={() => !isLocked && navigate(`/cursos/${slug}/${module.url}`)}
                        >
                          {isLocked ? "Bloqueado" : "Ir al módulo"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="comments-container">
                <h1 className="tit">Comentarios de estudiantes</h1>
                <div className="comments">
                  {DataComments.map((comment, index) => (
                    <div key={index} className="comment">
                      <div className="photo">
                        <img src={comment.image} alt={comment.name} />
                      </div>
                      <div className="dat">
                        <p className="name">{comment.name}</p>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => {
                            const decimal = comment.stars % 1;
                            let roundedStars = 0;

                            if (decimal < 0.25) {
                              roundedStars = Math.floor(comment.stars);
                            } else if (decimal < 0.75) {
                              roundedStars = Math.floor(comment.stars) + 0.5;
                            } else {
                              roundedStars = Math.ceil(comment.stars);
                            }

                            if (i < Math.floor(roundedStars)) {
                              return <FontAwesomeIcon key={i} icon={faStar} className="star" />;
                            } else if (i === Math.floor(roundedStars) && roundedStars % 1 === 0.5) {
                              return <FontAwesomeIcon key={i} icon={faStarHalfAlt} className="star" />;
                            } else {
                              return <FontAwesomeIcon key={i} icon={faStarRegular} className="star" />;
                            }
                          })}
                        </div>
                        <p className="flow">{comment.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="c2">
              <div className="teacher-info">
                <p></p>
                <div className="master">
                  <div className="photo">
                    <img src="/JENNIFER-1.webp" alt="" />
                  </div>
                  <h1 className="name">Pedro Lopez</h1>
                  <p className="tit">Especialista en impresion 3D</p>
                  <p className="flow">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora iure ipsa doloribus cum culpa sint
                    error, nobis, nostrum nisi sed eaque quod suscipit vel perferendis. Ipsum provident enim a quae.
                  </p>
                </div>
              </div>
              <div className="points">
                <p className="number">{averageStars.toFixed(1)}</p>
                <div className="stars">
                  {(() => {
                    let roundedStars = 0;
                    const decimal = averageStars % 1;
                    if (decimal < 0.25) {
                      roundedStars = Math.floor(averageStars);
                    } else if (decimal < 0.75) {
                      roundedStars = Math.floor(averageStars) + 0.5;
                    } else {
                      roundedStars = Math.ceil(averageStars);
                    }
                    const stars = [];
                    for (let i = 0; i < 5; i++) {
                      if (i < Math.floor(roundedStars)) {
                        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="star" />);
                      } else if (i === Math.floor(roundedStars) && roundedStars % 1 === 0.5) {
                        stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} className="star" />);
                      } else {
                        stars.push(<FontAwesomeIcon key={i} icon={faStarRegular} className="star" />);
                      }
                    }
                    return stars;
                  })()}
                </div>
                <p className="r">Calificación del curso</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewCourseModule;
