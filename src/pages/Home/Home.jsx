import Course from "@components/Course/Course";
import DataTeachers from "@src/jsons/teachers.json";
import Carrusel from "@components/Carrusel/Carrusel";
import "./Home.css";

function Home() {
  return (
    <>
      <div className="home">
        <div className="presentation">
          <div className="con">
            <div className="flow">
              <h1>
                Potencia tus conocimientos
                <br /> y aprende con los mejores.
              </h1>
              <p>
                En K3D Lab encontrarás cursos con contenido
                <br /> de calidad, dictados por expertos reconocidos
                <br /> en el mundo de la tecnología 3D.
              </p>
              <button>Inscríbete ahora</button>
            </div>
          </div>
        </div>

        <div className="process">
          <div className="con">
            <p className="subt1">TU APRENDIZAJE A OTRO NIVEL</p>
            <p className="subt2">¿Cómo inscribirte a un cursod e K3D Lab?</p>

            <div className="steps">
              <span className="line"></span>
              <div className="step">
                <img src="/step1.webp" alt="" />
                <p className="num">1</p>
                <p className="flow">
                  <span>Elige el curso que deseas aprender</span>
                  <br />
                  Lee detalladamente de que trata cada
                  <br /> uno para que tomes la decisión correcta.
                </p>
              </div>
              <div className="step">
                <img src="/step2.webp" alt="" />
                <p className="num">2</p>
                <p className="flow">
                  <span>Regístrate</span>
                  <br />
                  con tus datos o con
                  <br /> tu cuenta de Gmail.
                </p>
              </div>
              <div className="step">
                <img src="/step3.webp" alt="" />
                <p className="num">3</p>
                <p className="flow">
                  <span>Realiza el pago del curso</span>
                  <br />
                  A continuación obtendrás
                  <br /> acceso a todo el material.
                </p>
              </div>
            </div>
          </div>
          <div className="spe">
            Lorem ipsum <span>dolor sit amet</span>
          </div>
        </div>

        <div className="available-courses">
          <div className="con">
            <div className="filter">
              <div className="tit">
                <img className="r" src="/icon-up.webp" alt="" />
                <p>
                  Cursos <span>Disponibles</span>
                </p>
              </div>
              <div className="categories">
                <p>Categoria1</p>
                <p>Categoria2</p>
                <p>Categoria3</p>
                <p>Categoria4</p>
              </div>
            </div>
            <div className="list-courses">
              <Course
                image="/img-course.webp"
                title="Curso de Modelado 3D"
                description="Aprende modelado desde cero con herramientas modernas."
                price="99.00"
              />
              <Course
                image="/img-course.webp"
                title="Curso de Modelado 3D"
                description="Aprende modelado desde cero con herramientas modernas."
                price="99.00"
              />
              <Course
                image="/img-course.webp"
                title="Curso de Modelado 3D"
                description="Aprende modelado desde cero con herramientas modernas."
                price="99.00"
              />
              <Course
                image="/img-course.webp"
                title="Curso de Modelado 3D"
                description="Aprende modelado desde cero con herramientas modernas."
                price="99.00"
              />
            </div>
          </div>
        </div>

        <div className="list-teachers">
          <div className="con">
            <h1 className="title">
              Nuestros <span>Docentes</span>
            </h1>
            <div className="list">
              <Carrusel
                teachers={DataTeachers}
                visibleCount={3}
                intervalSeconds={1}
                gapRem={5}
              />
            </div>
          </div>
        </div>
        <div className="redir-ins">
          <div className="con">
            <p className="flow">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque
              impedit adipisci, quis animi. Dicta saepe, ex vel,
            </p>
            <a className="btn-redir" href="#">
              ¡Inscríbete <span>ahora!</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
