import Profile from '../../Components/UsersForm';
import Users from '../../Admin/Users';

const defaultDashboard = {
  Component: Users,
};

const collection = {
  Profile,
  Users,
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
