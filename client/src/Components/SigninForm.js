/* eslint-disable camelcase */
import React from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import updateSession from '../redux/actions/updateSession';
import { buttons, signinInfo } from '../Info.json';
import './SigninForm.css';

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
      const data = { username, email };
      if (password !== '') {
        if (password.trim() !== '') {
          if (password.trim().length < 6) {
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
        data.password_digest = bcrypt.hashSync(password, salt);
      }
      if (id === null) {
        const URL_API = process.env.REACT_APP_URL_APISPERU_DNI;
        const TOKEN_API = process.env.REACT_APP_TOKEN_APISPERU;
        const req = `${URL_API}${username}${TOKEN_API}`;
        const infoAPI = await axios.get(req);
        data.type_doc = 'DNI';
        data.num_doc = username;
        data.nickname = infoAPI.data.nombres;
        data.lastname1 = infoAPI.data.apellidoPaterno;
        data.lastname2 = infoAPI.data.apellidoMaterno;
      }
      const res = id === null
        ? await axios.post('api/users', data)
        : await axios.put(`api/users/${id}`, data);

      const user = {
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
        status: res.data.status,
        typeDoc: res.data.type_doc,
        numDoc: res.data.num_doc,
        abrev: res.data.abrev,
        nickname: res.data.nickname,
        lastname1: res.data.lastname1,
        lastname2: res.data.lastname2,
        mobile: res.data.mobile,
        address: res.data.address,
        information: res.data.information,
        degree: res.data.degree,
        biography: res.data.biography,
      };
      this.setState({
        loading: false,
        message: 'Información actualizada exitosamente',
      });
      changeSession(user);
    } catch (err) {
      this.setState({
        error: 'DNI inválido',
        loading: false,
      });
    }
  }

  render() {
    const { id, username, email, password, confirmation, loading, message, error } = this.state;
    const { signin, update, wait } = buttons;
    const { title } = signinInfo;
    const btnText = id === null ? signin : update;
    return (
      <form className="row w-100" onSubmit={this.handleSubmit}>
        <div className="col-12 form-header">
          <h2>{id === null ? title : null}</h2>
          {message === null ? null : <p className="text-success">{message}</p>}
          {error === null ? null : <p className="text-danger">{error}</p>}
        </div>
        <div className="col">
          <input
            className="form-control input-text"
            onChange={this.handleChange}
            placeholder="DNI"
            name="username"
            value={username}
            disabled={id !== null}
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
            required={id === null}
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
            required={password !== ''}
          />
          <button type="submit" className="btn btn-primary btn-home" disabled={loading}>
            {loading ? wait : btnText}
          </button>
        </div>
      </form>
    );
  }
}

SigninForm.propTypes = {
  changeSession: PropTypes.func.isRequired,
  session: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  session: state.session,
});

const mapDispatchToProps = (dispatch) => ({
  changeSession: (session) => dispatch(updateSession(session)),
});

const SigninFormWrapper = connect(mapStateToProps, mapDispatchToProps)(SigninForm);

export default SigninFormWrapper;
