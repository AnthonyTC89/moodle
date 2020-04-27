import UsersForm from '../../Components/UsersForm';
import Users from '../../Admin/Users';
import AcademicPeriods from '../../Admin/AcademicPeriods';
import Courses from '../../Components/Courses';
import Subjects from '../../Components/Subjects';
import CoursesShow from '../../Components/CoursesShow';

const defaultDashboard = {
  Component: UsersForm,
};

const collection = {
  UsersForm,
  Users,
  AcademicPeriods,
  Courses,
  Subjects,
  CoursesShow,
};

const dashboard = (state = defaultDashboard, { type, component }) => {
  switch (type) {
    case 'UPDATE_DASHBOARD':
      return {
        Component: collection[component],
      };
    default:
      return state;
  }
};

export default dashboard;
