import "./Profile.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser,
  faPenToSquare,
  faBookmark,
  faFontAwesome,
  faClock,
  faCertificate,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import ListUserCourses from "@components/ListUserCourses/ListUserCourses";
import { useAuth } from "@contexts/AuthContext";
import DataUserCourses from "@src/jsons/my-courses.json";

function Profile() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { userData } = useAuth();

  const filteredUserCourses =
    selectedStatus === "all"
      ? DataUserCourses
      : DataUserCourses.filter((usercourse) => usercourse.status === selectedStatus);

  const totalCourses = DataUserCourses.length;

  return (
    <div className="page-profile">
      <div className="con">
        <div className="profile-container">
          <div className="info">
            <FontAwesomeIcon className="btn-edt" icon={faPenToSquare} />
            <div className="hi">
              <div className="imag">
                <img src="/profile.webp" alt="profile" />
              </div>
              <span className="hello">
                Hola, {userData?.first_name || "Usuario"}
              </span>
            </div>

            <div className="contacto">
              <div className="dato">
                <FontAwesomeIcon className="icon" icon={faEnvelope} />
                <p>{userData?.email || "usuario@correo.com"}</p>
              </div>

              <div className="dato">
                <FontAwesomeIcon className="icon" icon={faGlobe} />
                <p>
                  {userData?.country_flag && (
                    <img
                      src={userData.country_flag.replace("w20", "w40")}
                      alt={userData?.country_name}
                      style={{ marginRight: 6, verticalAlign: "middle" }}
                    />
                  )}
                  {userData?.country_name || "País"}
                </p>
              </div>

              <div className="dato">
                <FontAwesomeIcon className="icon" icon={faUser} />
                <p>
                  {userData?.first_name || "Nombre"} {userData?.last_name || "Apellido"}
                </p>
              </div>
            </div>

            <div className="dash">
              <div className="dato">
                <p className="clave">Cursos inscritos</p>
                <p className="valor">
                  {totalCourses}
                  <FontAwesomeIcon icon={faBookmark} />
                </p>
              </div>
              <div className="dato">
                <p className="clave">Cursos completados</p>
                <p className="valor">
                  2
                  <FontAwesomeIcon icon={faFontAwesome} />
                </p>
              </div>
              <div className="dato">
                <p className="clave">Tiempo de visualización</p>
                <p className="valor">
                  2h 11m
                  <FontAwesomeIcon icon={faClock} />
                </p>
              </div>
              <div className="dato">
                <p className="clave">Certificados obtenidos</p>
                <p className="valor">
                  2
                  <FontAwesomeIcon icon={faCertificate} />
                </p>
              </div>
            </div>
          </div>

          <div className="courses">
            <div className="filters">
              <div
                className={`fil ${selectedStatus === "all" ? "active" : ""}`}
                onClick={() => setSelectedStatus("all")}
              >
                <p>Mis cursos</p>
                <span></span>
              </div>
              <div
                className={`fil ${selectedStatus === 2 ? "active" : ""}`}
                onClick={() => setSelectedStatus(2)}
              >
                <p>En curso</p>
                <span></span>
              </div>
              <div
                className={`fil ${selectedStatus === 3 ? "active" : ""}`}
                onClick={() => setSelectedStatus(3)}
              >
                <p>Finalizados</p>
                <span></span>
              </div>
            </div>

            <div className="list-courses">
              <div className="my-courses">
                <ListUserCourses usercourses={filteredUserCourses} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
