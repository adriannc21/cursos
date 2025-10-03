import "./Profile.css";
import { useState, useEffect } from "react";
import api from "@api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser,
  faPenToSquare,
  faClock,
  faCertificate,
  faGlobe,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import ListUserCourses from "@components/ListUserCourses/ListUserCourses";
import { useAuth } from "@contexts/AuthContext";

function Profile() {
  const [courses, setCourses] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);

  const { userData } = useAuth();

  useEffect(() => {
    api
      .get("/courses/purchased")
      .then((res) => {
        const data = res?.data;
        if (data.success && Array.isArray(data.data)) {
          setCourses(data.data);
        } else {
          setCourses([]);
        }
      })
      .catch((err) => {
        console.error("Error al obtener cursos:", err);
        setCourses([]);
      });
  }, []);

  const handleRedeem = async () => {
    if (!coupon.trim()) return;

    setLoading(true);

    try {
      const res = await api.post("/redeem/add", { code: coupon.trim() });

      if (res.data.success) {
        setCoupon("");
        const updated = await api.get("/courses/purchased");
        if (updated.data.success) {
          setCourses(updated.data.data);
        }
      }
    } catch (err) {
      console.error("Error al aplicar cupón:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-profile">
      <div className="coverage">
        <div className="profile-container">
          <div className="info">
            <FontAwesomeIcon className="btn-edt" icon={faPenToSquare} />
            <div className="hi">
              <div className="imag">
                <img src="/profile.webp" alt="profile" />
              </div>
              <span className="hello">Hola, {userData?.first_name || "Usuario"}</span>
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
                    <img className="flag" src={userData.country_flag} alt={userData?.country_name} />
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

              <div className="dato">
                <FontAwesomeIcon className="icon" icon={faCalendar} />
                <p>{userData?.birthday || "Fecha de Nacimiento"}</p>
              </div>
            </div>

            <div className="dash">
              <div className="dato">
                <p className="clave">
                  Tiempo de <br /> visualización
                </p>
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
            <div className="coupons">
              <input
                className="in-cuop"
                type="text"
                placeholder="Código de canje"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button className="btn-coup" onClick={handleRedeem} disabled={loading}>
                {loading ? "Aplicando..." : "Canjear curso"}
              </button>
            </div>

            <div className="list-courses">
              <div className="my-courses">
                <ListUserCourses usercourses={courses} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
