const defaultSession = {
  user: {
    id: '',
    username: '',
    email: '',
    status: 3,
  },
  isLoggedIn: false,
};

const session = (state = defaultSession, { type, newSession }) => {
  switch (type) {
    case 'UPDATE_SESSION':
      return newSession;
    default:
      return state;
  }
};

export default session;
