import "./Home.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import CarruselTeachers from "@components/CarruselTeachers/CarruselTeachers";
import ListShortCourses from "@components/ListShortCourses/ListShortCourses";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isFading, setIsFading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(true);

  const categories = Array.isArray(courses) ? [...new Set(courses.map((c) => c?.category_name).filter(Boolean))] : [];

  const filteredCourses = Array.isArray(courses)
    ? selectedCategory
      ? courses.filter((course) => course?.category_name === selectedCategory)
      : courses
    : [];

  const handleFilterClick = (category) => {
    if (category === selectedCategory) return;
    setIsFading(true);
    setTimeout(() => {
      setSelectedCategory(category);
      setIsFading(false);
    }, 300);
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/teachers/list`, {
          headers: { "Api-Key": import.meta.env.VITE_API_KEY },
        });
        const result = await res.json();
        if (Array.isArray(result?.data)) {
          setTeachers(result.data);
        } else {
          console.warn("Datos de docentes no válidos:", result);
          setTeachers([]);
        }
      } catch (err) {
        console.error("Error cargando docentes:", err);
        setTeachers([]);
      } finally {
        setLoadingTeachers(false);
      }
    };

    const fetchCourses = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/courses/latest`, {
          headers: { "Api-Key": import.meta.env.VITE_API_KEY },
        });
        const result = await res.json();
        if (Array.isArray(result?.data)) {
          setCourses(result.data);
        } else {
          console.warn("Datos de cursos no válidos:", result);
          setCourses([]);
        }
      } catch (err) {
        console.error("Error cargando cursos:", err);
        setCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchTeachers();
    fetchCourses();
  }, []);

  return (
    <div className="page-home">
      <Helmet>
        <link rel="preload" as="image" href="/fondo-home-com.webp" type="image/webp" />
      </Helmet>
      <div className="presentation">
        <img
          src="/fondo-home-com.webp"
          alt="Fondo"
          className="bg-image"
          width="1920"
          height="1080"
          fetchpriority="high"
        />
        <div className="con">
          <div className="flow">
            <h1>
              {t("home.home1_title_line1")}
              <br />
              {t("home.home1_title_line2")}
            </h1>
            <p>
              {t("home.home1_subt_line1")}
              <br />
              {t("home.home1_subt_line2")}
              <br />
              {t("home.home1_subt_line3")}
            </p>
            <Link to="/iniciar-sesion" className="btn-insc">
              {t("home.home1_btn")}
            </Link>
          </div>
        </div>
      </div>

      <div className="process">
        <div className="con">
          <p className="subt1">{t("home.home2_title")}</p>
          <p className="subt2">{t("home.home2_subt")}</p>
          <div className="steps">
            <span className="line"></span>

            <div className="step">
              <img src="/icons/icon-desktop-v2.webp" width="96" height="96" alt="icon" />
              <p className="num">1</p>
              <p className="flow">
                <span>{t("home.home2_step1_line1")}</span>
                <br />
                {t("home.home2_step1_line2")}
                <br />
                {t("home.home2_step1_line3")}
              </p>
            </div>

            <div className="step">
              <img src="/icons/icon-form-v2.webp" width="96" height="96" alt="icon" />
              <p className="num">2</p>
              <p className="flow">
                <span>{t("home.home2_step2_line1")}</span>
                <br />
                {t("home.home2_step2_line2")}
                <br />
                {t("home.home2_step2_line3")}
              </p>
            </div>

            <div className="step">
              <img src="/icons/icon-cards-v2.webp" width="96" height="96" alt="icon" />
              <p className="num">3</p>
              <p className="flow">
                <span>{t("home.home2_step3_line1")}</span>
                <br />
                {t("home.home2_step3_line2")}
                <br />
                {t("home.home2_step3_line3")}
              </p>
            </div>
          </div>
        </div>

        <div className="spe">
          {t("home.home2_present_line1")} <span>{t("home.home2_present_line2")}</span>
        </div>
      </div>

      <div className="available-courses">
        <div className="con">
          <div className="filter">
            <div className="tit">
              <FontAwesomeIcon className="icon-right" icon={faChevronRight} />
              <p>
                {t("home.home3_title_line1")} <span>{t("home.home3_title_line2")}</span>
              </p>
            </div>

            <div className="categories">
              <p className={`btn-fil ${!selectedCategory ? "selected" : ""}`} onClick={() => handleFilterClick("")}>
                {t("home.home3_all")}
              </p>
              {categories.length > 0 &&
                categories.map((cat) => (
                  <p
                    key={cat}
                    className={`btn-fil ${selectedCategory === cat ? "selected" : ""}`}
                    onClick={() => handleFilterClick(cat)}
                  >
                    {cat}
                  </p>
                ))}
            </div>
          </div>

          <div className={`list ${isFading ? "fade-out" : ""}`}>
            {!loadingCourses ? (
              filteredCourses.length > 0 ? (
                <ListShortCourses courses={filteredCourses} />
              ) : (
                <p>{t("home.home3_no_courses")}</p>
              )
            ) : (
              <p>{t("home.home3_loading_courses")}</p>
            )}
          </div>
        </div>
      </div>

      <div className="list-teachers">
        <div className="con">
          <div className="title">
            <FontAwesomeIcon className="icon-right" icon={faChevronRight} />
            <p>
              {t("home.home4_title_line1")} <span>{t("home.home4_title_line2")}</span>
            </p>
          </div>

          <div className="list">
            {!loadingTeachers ? (
              teachers.length > 0 ? (
                <CarruselTeachers teachers={teachers} visibleCount={2} intervalSeconds={10} gapRem={2} />
              ) : (
                <p>{t("home.home4_no_teachers")}</p>
              )
            ) : (
              <p>{t("home.home4_loading_teachers")}</p>
            )}
          </div>
        </div>
      </div>

      <div className="redir-ins">
        <div className="con">
          <p className="flow">
            {t("home.home5_cta_text_line1")} <br />
            {t("home.home5_cta_text_line2")}
          </p>
          <Link className="btn-redir" to="/iniciar-sesion">
            {t("home.home5_cta_btn_line1")} <span>{t("home.home5_cta_btn_line2")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
