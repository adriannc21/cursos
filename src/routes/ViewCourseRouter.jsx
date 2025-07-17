import { useAuth } from "@contexts";
import ViewCourseModule from "@pages/ViewCourseModule/ViewCourseModule";
import ViewCourseFree from "@pages/ViewCourseFree/ViewCourseFree";

const ViewCourseRouter = () => {
  const { user } = useAuth();

  return user ? <ViewCourseModule /> : <ViewCourseFree />;
};

export default ViewCourseRouter;
