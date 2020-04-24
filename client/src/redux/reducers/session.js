const defaultSession = {
  user: {
    id: '',
    username: '',
    email: '',
    status: 3,
  },
  isLoggedIn: false,
};

const session = (state = defaultSession, { type, user }) => {
  switch (type) {
    case 'UPDATE_SESSION':
      return {
        user,
        isLoggedIn: user != null,
      };
    default:
      return state;
  }
};

export default session;
