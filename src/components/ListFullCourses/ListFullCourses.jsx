import Course from "@components/Course/Course";
import "./ListFullCourses.css";

function ListFullCourses({ courses = [] }) {
  if (!Array.isArray(courses) || courses.length === 0) {
    return <p className="no-courses-msg">No hay cursos disponibles.</p>;
  }

  return (
    <div className="component-listfullcourses">
      {courses.map((course, index) => (
        <Course
          key={index}
          title={course.title}
          thumbnail={course.thumbnail}
          price={course.price}
          price_discount={course.price_discount}
          description={course.description}
          duration={course.duration}
          slug={course.slug}
          teacher_name={course.teacher_name}
          category_name={course.category_name}
          total_sells={course.total_sells}
          level={course.level}
          uuid={course.uuid}
          version={course.version}
        />
      ))}
    </div>
  );
}

export default ListFullCourses;
