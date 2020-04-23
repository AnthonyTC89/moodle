/* eslint-disable camelcase */
import React from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import updateSession from '../redux/actions/updateSession';
// import { HTTPresponses } from '../Info.json';
import './SigninForm.css';

class SigninForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      username: '',
      email: '',
      password: '',
      confirmation: '',
      message: null,
      error: null,
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
      const { username, email, password, confirmation } = this.state;
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
      const res = await axios.post('/api/users', data);
      const user = {
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
        status: res.data.status,
      };
      this.setState({
        loading: false,
      });
      changeSession({ user, isLoggedIn: true });
    } catch (err) {
      this.setState({
        error: 'error',
        loading: false,
      });
    }
  }

  render() {
    const { username, email, password, confirmation,
      loading, message, error } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <h2 className="text-info">Registro de Estudiantes</h2>
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
        <button type="submit" className="btn btn-primary btn-home" disabled={loading}>
          {loading ? 'Espere...' : 'Registrar'}
        </button>
      </form>
    );
  }
}

SigninForm.propTypes = {
  changeSession: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  changeSession: (session) => dispatch(updateSession(session)),
});

const SigninFormWrapper = connect(null, mapDispatchToProps)(SigninForm);

export default SigninFormWrapper;
