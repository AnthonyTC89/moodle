import UsersForm from '../../Components/UsersForm';
import Users from '../../Admin/Users';
import AcademicPeriods from '../../Admin/AcademicPeriods';
import Courses from '../../Components/Courses';

const defaultDashboard = {
  Component: UsersForm,
};

const collection = {
  UsersForm,
  Users,
  AcademicPeriods,
  Courses,
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
