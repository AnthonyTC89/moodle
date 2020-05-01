import React from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import UsersForm from './UsersForm';
import { usersInfo, buttons } from '../Info.json';
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
    this.handleUpDown = this.handleUpDown.bind(this);
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

  async handleUpDown(user, value) {
    this.setState({
      loading: true,
    });
    try {
      const data = { status: user.status + value };
      await axios.put(`api/users/${user.id}`, data);
      this.setState({
        message: 'User updated',
        loading: false,
      });
      await this.getInfo();
    } catch (err) {
      this.setState({
        error: 'error',
        loading: false,
      });
    }
  }

  render() {
    const { users, loading, message, error, userEdit, formVisible } = this.state;
    const { title, status, columns } = usersInfo;
    const { upgrade, downgrade, edit, remove } = buttons;
    return (
      <section className="container">
        <h2>{title}</h2>
        {message === null ? null : <p className="text-success">{message}</p>}
        {error === null ? null : <p className="text-danger">{error}</p>}
        <div className="row row-user">
          <div className="col user-text">
            <h6>{columns.id}</h6>
          </div>
          <div className="col user-text">
            <h6>{columns.username}</h6>
          </div>
          <div className="col user-text">
            <h6>{columns.lastname1}</h6>
          </div>
          <div className="col user-text">
            <h6>{columns.nickname}</h6>
          </div>
          <div className="col user-text">
            <h6>{columns.status}</h6>
          </div>
          <div className="col user-text">
            <h6>{columns.accions}</h6>
          </div>
        </div>
        {formVisible ? <UsersForm user={userEdit} />
          : users.map((user) => (
            <div key={uuidv4()} className="row row-user">
              <div className="col col-text">
                <p>{user.id}</p>
              </div>
              <div className="col col-text">
                <p>{user.username}</p>
              </div>
              <div className="col col-text">
                <p>{user.lastname1}</p>
              </div>
              <div className="col col-text">
                <p>{user.nickname}</p>
              </div>
              <div className="col btn-actions">
                <button
                  className="btn btn-warning"
                  type="button"
                  disabled={loading}
                  onClick={() => this.handleUpDown(user, -1)}
                >
                  {upgrade}
                </button>
                <span>{status[user.status]}</span>
                <button
                  className="btn btn-info"
                  type="button"
                  disabled={loading}
                  onClick={() => this.handleUpDown(user, 1)}
                >
                  {downgrade}
                </button>
              </div>
              <div className="col btn-actions">
                <button
                  className="btn btn-success"
                  type="button"
                  onClick={() => this.handleOpenUserForm(user)}
                >
                  {edit}
                </button>
                <button className="btn btn-danger" type="button" disabled={loading}>
                  {remove}
                </button>
              </div>
            </div>
          ))}
      </section>
    );
  }
}

export default Users;
