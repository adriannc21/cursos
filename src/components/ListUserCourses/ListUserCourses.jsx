import "./ListUserCourses.css";
import UserCourse from "@components/UserCourse/UserCourse";

function ListUserCourses({ usercourses, errorMessage }) {
  return (
    <div className="component-listusercourses">
      {usercourses.length === 0 ? (
        <p className="no-courses">{errorMessage || "No tienes cursos disponibles"}</p>
      ) : (
        usercourses.map((course) => (
          <UserCourse
            key={course.uuid}
            image={course.thumbnail}
            cantstatus={parseInt(course.progress)}
            title={course.title}
            status={course.state}
            slug={course.slug}
            lite={course.lite}
          />
        ))
      )}
    </div>
  );
}

export default ListUserCourses;
