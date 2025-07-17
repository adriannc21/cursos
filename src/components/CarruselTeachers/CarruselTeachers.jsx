import "./CarruselTeachers.css";
import { useEffect } from "react";
import Teacher from "@components/Teacher/Teacher";
import { swiffyslider } from "swiffy-slider";
import "swiffy-slider/css";

window.swiffyslider = swiffyslider;

function CarruselTeachers({
  teachers = [],
  visibleCount = 1,
  intervalSeconds = 3,
  gapRem = 1,
}) {
  useEffect(() => {
    window.swiffyslider.init();
  }, []);

  return (
    <div className="component-carruselteachers">
      {teachers.length === 0 ? (
        <p>No hay docentes disponibles.</p>
      ) : (
        <div
          className={`swiffy-slider slider-item-snapstart slider-item-show${visibleCount} slider-nav-autoplay`}
          data-slider-nav-autoplay-interval={intervalSeconds * 1000}
          style={{
            "--swiffy-slider-item-gap": `${gapRem}rem`,
          }}
        >
          <ul className="slider-container">
            {teachers.map((t, i) => (
              <li key={i} className="slide">
                <Teacher {...t} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CarruselTeachers;
