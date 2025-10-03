import "./Home.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import CarruselTeachers from "@components/CarruselTeachers/CarruselTeachers";
import ListShortCourses from "@components/ListShortCourses/ListShortCourses";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import api from "@api/axios";
import { useSelector } from "react-redux";

function Home() {
  const { t } = useTranslation();
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isFading, setIsFading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const { language, country } = useSelector((state) => state.global);

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
        const { data } = await api.get("/teachers");
        if (Array.isArray(data?.data)) {
          setTeachers(data.data);
        } else {
          setTeachers([]);
        }
      } catch (err) {
        console.error("Error cargando docentes:", err);
        setTeachers([]);
      } finally {
        setLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, [country, language]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const { data } = await api.get("/courses/list?limit=10");
        if (Array.isArray(data?.data)) {
          // Mapear para generar un curso por full y otro por lite si existe
          const mappedCourses = data.data.flatMap((course) => {
            const coursesArray = [];
            if (course.full) {
              coursesArray.push({
                ...course,
                price: course.full.price,
                price_discount: course.full.discount,
                duration: course.full.duration,
                version: "full",
              });
            }
            if (course.lite) {
              coursesArray.push({
                ...course,
                price: course.lite.price,
                price_discount: course.lite.discount,
                duration: course.lite.duration,
                version: "lite",
              });
            }
            return coursesArray;
          });
          setCourses(mappedCourses);
        } else if (data?.data?.uuid) {
          const course = data.data;
          const coursesArray = [];
          if (course.full) {
            coursesArray.push({
              ...course,
              price: course.full.price,
              price_discount: course.full.discount,
              duration: course.full.duration,
              version: "full",
            });
          }
          if (course.lite) {
            coursesArray.push({
              ...course,
              price: course.lite.price,
              price_discount: course.lite.discount,
              duration: course.lite.duration,
              version: "lite",
            });
          }
          setCourses(coursesArray);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error("Error cargando cursos:", err);
        setCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [country, language]);

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
        <div className="coverage">
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
        <div className="coverage">
          <p className="subt1">{t("home.home2_title")}</p>
          <p className="subt2">{t("home.home2_subt")}</p>
          <div className="steps">
            <span className="line"></span>

            {[1, 2, 3].map((step, i) => (
              <div className="step" key={step}>
                <img src={`/icons/icon-${["desktop", "form", "cards"][i]}-v2.webp`} width="96" height="96" alt="icon" />
                <p className="num">{step}</p>
                <p className="flow">
                  <span>{t(`home.home2_step${step}_line1`)}</span>
                  <br />
                  {t(`home.home2_step${step}_line2`)}
                  <br />
                  {t(`home.home2_step${step}_line3`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="spe">
          {t("home.home2_present_line1")} <span>{t("home.home2_present_line2")}</span>
        </div>
      </div>

      <div className="available-courses">
        <div className="coverage">
          <div className="filter">
            <div className="tit">
              <FontAwesomeIcon className="icon-right" icon={faChevronRight} />
              <p>
                {t("home.home3_title_line1")} <span>{t("home.home3_title_line2")}</span>
              </p>
            </div>

            {categories.length >= 2 && (
              <div className="categories">
                <p className={`btn-fil ${!selectedCategory ? "selected" : ""}`} onClick={() => handleFilterClick("")}>
                  {t("home.home3_all")}
                </p>
                {categories.map((cat) => (
                  <p
                    key={cat}
                    className={`btn-fil ${selectedCategory === cat ? "selected" : ""}`}
                    onClick={() => handleFilterClick(cat)}
                  >
                    {cat}
                  </p>
                ))}
              </div>
            )}
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
        <div className="coverage">
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
        <div className="coverage">
          <p className="flow">
            {t("home.home5_cta_text_line1")}
            <br />
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
