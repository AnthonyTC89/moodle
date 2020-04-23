import Profile from '../../Dashboard/Profile';

const defaultDashboard = {
  Component: Profile,
};

const collection = {
  Profile,
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
