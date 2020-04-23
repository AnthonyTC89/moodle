import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import updateSession from '../redux/actions/updateSession';
import './Profile.css';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.session.user.id,
      username: props.session.user.username,
      email: props.session.user.email,
      password: '',
      confirmation: '',
      message: null,
      error: null,
      loading: false,
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
    const { id, username, email, password, confirmation } = this.state;
    if (password.trim() !== '') {
      if (confirmation.trim() === '') {
        this.setState({
          error: 'Ingrese su confirmación de contraseña',
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

    const { changeSession } = this.props;
    const data = { username, email };
    if (password !== '') {
      const salt = parseInt(process.env.REACT_APP_BCRYPT_SALT, 10);
      data.password_digest = bcrypt.hashSync(password, salt);
    }
    try {
      const res = await axios.put(`api/users/${id}`, data);
      if (res.status === 200) { // OK - Updated
        this.setState({
          message: 'Información actualizada exitosamente',
          loading: false,
          password: '',
          confirmation: '',
        });
      }
      const user = {
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
        status: res.data.status,
      };
      changeSession(user);
    } catch (err) {
      this.setState({
        error: 'Error al actualizar',
        loading: false,
        password: '',
        confirmation: '',
      });
    }
  }

  render() {
    const { username, email, password, confirmation, message, error, loading } = this.state;
    return (
      <section className="container">
        <form className="form-row" onSubmit={this.handleSubmit}>
          <h2 className="text-primary">Perfil de Usuario</h2>
          {message === null ? null : <p className="text-success">{message}</p>}
          {error === null ? null : <p className="text-danger">{error}</p>}
          <input
            className="form-control input-text"
            onChange={this.handleChange}
            name="username"
            value={username}
            required
            disabled
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
          />
          <input
            className="form-control input-text"
            onChange={this.handleChange}
            name="confirmation"
            placeholder="confirmación"
            value={confirmation}
            type="password"
            required={password !== ''}
            disabled={password === ''}
          />
          <button type="submit" className="btn btn-primary btn-dashboard">
            {loading ? 'Espere...' : 'Actualizar'}
          </button>
        </form>
      </section>
    );
  }
}

Profile.propTypes = {
  session: PropTypes.object.isRequired,
  changeSession: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  session: state.session,
});

const mapDispatchToProps = (dispatch) => ({
  changeSession: (user) => dispatch(updateSession(user)),
});

const ProfileWrapper = connect(mapStateToProps, mapDispatchToProps)(Profile);

export default ProfileWrapper;
