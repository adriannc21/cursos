import UserCourse from "@components/UserCourse/UserCourse";
import "./ListUserCourses.css";

function ListUserCourses({ usercourses }) {
  return (
    <div className="listusercourses">
      {usercourses.map((usercourse, index) => (
        <UserCourse
          key={index}
          image={usercourse.image}
          cantstatus={usercourse.cantstatus}
          title={usercourse.title}
          status={usercourse.status}
        />
      ))}
    </div>
  );
}

export default ListUserCourses;
