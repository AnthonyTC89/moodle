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
    const { session } = props;
    this.state = {
      loading: false,
      id: session.user.id,
      username: session.user.username,
      email: session.user.email,
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
      const { id, username, email, password, confirmation } = this.state;
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

      const res = id !== null
        ? await axios.put(`api/products/${id}`, data)
        : await axios.post('api/products', data);

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
    const { id, username, email, password, confirmation,
      loading, message, error } = this.state;
    const btnText = id === null ? 'Registrar' : ' Actualizar';
    const headerText = id === null ? 'Registro de Estudiantes' : 'Perfil de Usuario';
    return (
      <form onSubmit={this.handleSubmit}>
        <h2 className="text-info">{headerText}</h2>
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
          {loading ? 'Espere...' : btnText}
        </button>
      </form>
    );
  }
}

SigninForm.propTypes = {
  session: PropTypes.object.isRequired,
  changeSession: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  session: state.session,
});

const mapDispatchToProps = (dispatch) => ({
  changeSession: (session) => dispatch(updateSession(session)),
});

const SigninFormWrapper = connect(mapStateToProps, mapDispatchToProps)(SigninForm);

export default SigninFormWrapper;
