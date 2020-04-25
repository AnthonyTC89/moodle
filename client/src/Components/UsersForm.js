/* eslint-disable camelcase */
import React from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import updateSession from '../redux/actions/updateSession';
// import { HTTPresponses } from '../Info.json';
import './UsersForm.css';

class SigninForm extends React.Component {
  constructor(props) {
    super(props);
    const { user, session } = props;
    this.state = {
      loading: false,
      id: user === null ? session.user.id : user.id,
      username: user === null ? session.user.username : user.username,
      email: user === null ? session.user.email : user.email,
      status: user === null ? session.user.status : user.status,
      password: '',
      confirmation: '',
      message: null,
      error: null,
      editing: user !== null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.setState({
      message: null,
      error: null,
      loading: true,
    });
    try {
      const { changeSession } = this.props;
      const { id, username, email, password, confirmation, status } = this.state;
      if (password.trim() !== '') {
        if (confirmation.trim() === '' || confirmation.length < 6) {
          this.setState({
            error: 'La contraseña no es segura (mínimo 6)',
            loading: false,
          });
          return;
        }
        if (password.trim() !== confirmation.trim()) {
          this.setState({
            error: 'Su contraseña no coincide',
            loading: false,
          });
          return;
        }
      }
      const salt = parseInt(process.env.REACT_APP_BCRYPT_SALT, 10);
      const password_digest = bcrypt.hashSync(password, salt);
      const data = { username, email, password_digest };
      if (status !== null) {
        data.status = status;
      }
      const res = id !== null
        ? await axios.put(`api/users/${id}`, data)
        : await axios.post('api/users', data);

      const user = {
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
        status: res.data.status,
      };
      this.setState({
        loading: false,
      });
      changeSession(user);
    } catch (err) {
      this.setState({
        error: 'error',
        loading: false,
      });
    }
  }

  render() {
    const { id, username, email, password, confirmation, status, editing,
      loading, message, error } = this.state;
    const { session } = this.props;
    const btnText = id === null ? 'Registrar' : ' Actualizar';
    const headerText = id === null ? 'Registro de Estudiantes' : 'Perfil de Usuario';
    return (
      <form onSubmit={this.handleSubmit}>
        <h2 className="text-info">{headerText}</h2>
        {editing ? <p>editando</p> : <p>no editando</p>}
        {message === null ? null : <p className="text-success">{message}</p>}
        {error === null ? null : <p className="text-danger">{error}</p>}
        <input
          className="form-control input-text"
          onChange={this.handleChange}
          placeholder="Documento de Identidad (DNI u otro)"
          name="username"
          value={username}
          required
        />
        <input
          className="form-control input-text"
          onChange={this.handleChange}
          name="email"
          placeholder="Ingrese su email aqui"
          value={email}
          type="email"
          required
        />
        <input
          className="form-control input-text"
          onChange={this.handleChange}
          name="password"
          placeholder="password"
          type="password"
          value={password}
          maxLength={12}
          required
        />
        <input
          className="form-control input-text"
          onChange={this.handleChange}
          name="confirmation"
          placeholder="confirmación"
          value={confirmation}
          type="password"
          disabled={password === ''}
          maxLength={12}
          required
        />
        { session.user.status === 1
          ? (
            <input
              className="form-control input-text"
              onChange={this.handleChange}
              name="status"
              min="1"
              max="3"
              value={status}
              type="number"
            />
          ) : null}
        <button type="submit" className="btn btn-primary btn-home" disabled={loading}>
          {loading ? 'Espere...' : btnText}
        </button>
      </form>
    );
  }
}

SigninForm.propTypes = {
  user: PropTypes.object,
  session: PropTypes.object.isRequired,
  changeSession: PropTypes.func.isRequired,
};

SigninForm.defaultProps = {
  user: null,
};

const mapStateToProps = (state) => ({
  session: state.session,
});

const mapDispatchToProps = (dispatch) => ({
  changeSession: (session) => dispatch(updateSession(session)),
});

const SigninFormWrapper = connect(mapStateToProps, mapDispatchToProps)(SigninForm);

export default SigninFormWrapper;
