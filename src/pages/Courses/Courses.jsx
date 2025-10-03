import "./Courses.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import ListFullCourses from "@components/ListFullCourses/ListFullCourses";
import api from "@api/axios";

function Courses() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { language, country } = useSelector((state) => state.global);

  const categories = [
    "Impresión 3D",
    "Diseño en 3D",
    "Pintado de piezas 3D",
    "Corte y Grabado Láser",
    "Escáneres 3D",
    "Personalizado",
  ];

  const filteredCourses = selectedCategory
    ? courses.filter((c) => c.category_name === selectedCategory)
    : courses;

  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const { data } = await api.get("/courses/list");

        if (data?.success && data.data) {
          // Aseguramos array
          const rawCourses = Array.isArray(data.data) ? data.data : [data.data];

          // Normalizamos full/lite -> duplicamos si es necesario
          const normalized = rawCourses.flatMap((course) => {
            const list = [];

            if (course.full) {
              list.push({
                ...course,
                version: "full",
                price: course.full.price,
                price_discount: course.full.discount,
                duration: course.full.duration,
              });
            }

            if (course.lite) {
              list.push({
                ...course,
                version: "lite",
                price: course.lite.price,
                price_discount: course.lite.discount,
                duration: course.lite.duration,
              });
            }

            return list;
          });

          setCourses(normalized);
        } else {
          console.warn("⚠️ Respuesta inesperada de cursos:", data);
          setCourses([]);
        }
      } catch (err) {
        console.error("❌ Error al cargar cursos:", err);
        setCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [language, country]);

  return (
    <div className="page-courses">
      <div className="coverage">
        <div className="container">
          <div className="filters">
            <div
              className="tit"
              onClick={() => {
                if (window.innerWidth <= 768) {
                  setMobileFiltersOpen((prev) => !prev);
                }
              }}
            >
              {selectedCategory && courses.some((c) => c.category_name === selectedCategory)
                ? selectedCategory
                : "Filtrar resultados"}
              <span className="act">
                <FontAwesomeIcon
                  className={`icon-down ${mobileFiltersOpen ? "rotate-up" : ""}`}
                  icon={faChevronDown}
                />
              </span>
            </div>

            <div className={`list-filters ${mobileFiltersOpen ? "visible" : ""}`}>
              {categories.map((category, index) => (
                <div
                  key={index}
                  className={`filter ${selectedCategory === category ? "active" : ""}`}
                  onClick={() => {
                    if (selectedCategory === category) {
                      setSelectedCategory(null);
                    } else {
                      const hasCourses = courses.some((c) => c.category_name === category);
                      if (!hasCourses) {
                        setShowModal(true);
                      } else {
                        setSelectedCategory(category);
                      }
                    }

                    if (window.innerWidth <= 768) {
                      setMobileFiltersOpen(false);
                    }
                  }}
                >
                  {category}
                  {selectedCategory === category && (
                    <FontAwesomeIcon icon={faCheck} className="icon-check" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="courses">
            <p className="title-info">
              {selectedCategory ? `Cursos de ${selectedCategory}` : "Todos los Cursos"}
            </p>

            {!loadingCourses ? (
              <ListFullCourses courses={filteredCourses} />
            ) : (
              <p>Cargando cursos...</p>
            )}
          </div>

          {showModal && (
            <div className="modal-nr" onClick={() => setShowModal(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <FontAwesomeIcon className="icon-clock" icon={faClock} />
                <span>¡Próximamente!</span>
                <p className="flow">
                  ¡Estamos preparando contenido increíble para esta categoría! Muy pronto tendrás acceso a nuevos cursos
                  pensados especialmente para ti.
                </p>
                <button className="btn-out hover-op" onClick={() => setShowModal(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Courses;
