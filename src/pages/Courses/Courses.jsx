import "./Courses.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import ListShortCourses from "@components/ListShortCourses/ListShortCourses";

import DataCourses from "@src/jsons/courses.json";

function Courses() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    "Impresión 3D",
    "Diseño en 3D",
    "Pintado de piezas 3D",
    "Corte y Grabado Láser",
    "Escáneres 3D",
    "Personalizado",
    "impresion3d",
  ];
  const filteredCourses = selectedCategory ? DataCourses.filter((c) => c.category === selectedCategory) : DataCourses;
  const [showModal, setShowModal] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <div className="page-courses">
      <div className="con">
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
              {selectedCategory && DataCourses.some((c) => c.category === selectedCategory)
                ? selectedCategory
                : "Filtrar resultados"}
              <span className="act">
                <FontAwesomeIcon className={`icon-down ${mobileFiltersOpen ? "rotate-up" : ""}`} icon={faChevronDown} />
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
                      const hasCourses = DataCourses.some((c) => c.category === category);
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
                  {selectedCategory === category && <FontAwesomeIcon icon={faCheck} className="icon-check" />}
                </div>
              ))}
            </div>
          </div>
          <div className="courses">
            <p className="title-info">{selectedCategory ? `Cursos de ${selectedCategory}` : "Todos los Cursos"}</p>
            <ListShortCourses courses={filteredCourses} variant={3} />
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
