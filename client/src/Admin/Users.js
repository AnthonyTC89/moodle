import React from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
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
        <div className="row row-user">
          <div className="col-2 user-id">id</div>
          <div className="col-2 user-username">username</div>
          <div className="col-4 user-email">email</div>
          <div className="col-2 user-status">status</div>
          <div className="col-2 btn-actions">actions</div>
        </div>
        {formVisible ? <UsersForm user={userEdit} />
          : users.map((user) => (
            <div key={uuidv4()} className="row row-user">
              <div className="col-2 user-id">
                <p>{user.id}</p>
              </div>
              <div className="col-2 user-username">
                <p>{user.username}</p>
              </div>
              <div className="col-4 user-email">
                <p>{user.email}</p>
              </div>
              <div className="col-2 user-status">
                <p>{user.status}</p>
              </div>
              <div className="col-2 btn-actions">
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
            </div>
          ))}
      </section>
    );
  }
}

export default Users;
