import React from 'react';
import axios from 'axios';
import UsersForm from '../Components/UsersForm';
import './Users.css';

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loading: false,
      message: null,
      error: null,
      userEdit: null,
      formVisible: false,
    };
    this.handleCloseUserForm = this.handleCloseUserForm.bind(this);
    this.handleOpenUserForm = this.handleOpenUserForm.bind(this);
  }

  componentDidMount() {
    this.getInfo();
  }

  async getInfo() {
    this.setState({
      loading: true,
      message: null,
      error: null,
    });
    try {
      const res = await axios.get('/api/users');
      this.setState({
        users: res.data,
        loading: false,
      });
    } catch (err) {
      this.setState({
        error: 'Error en el Servidor',
        loading: false,
      });
    }
  }

  handleOpenUserForm(userEdit) {
    this.setState({
      formVisible: true,
      userEdit,
    });
  }

  handleCloseUserForm() {
    this.setState({
      formVisible: false,
    });
  }

  render() {
    const { users, loading, message, error, userEdit, formVisible } = this.state;
    return (
      <section className="container">
        <h2>usuarios</h2>
        {message === null ? null : <p className="text-success">{message}</p>}
        {error === null ? null : <p className="text-danger">{error}</p>}
        {formVisible ? <UsersForm user={userEdit} />
          : users.map((user) => (
            <div className="row">
              <p>{user.id}</p>
              <p>{user.username}</p>
              <button
                className="btn btn-success"
                type="button"
                onClick={() => this.handleOpenUserForm(user)}
              >
                Edit
              </button>
              <button className="btn btn-danger" type="button" disabled={loading}>
                Eliminar
              </button>
            </div>
          ))}
      </section>
    );
  }
}

export default Users;
