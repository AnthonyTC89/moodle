/* eslint-disable camelcase */
import React from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import updateSession from '../redux/actions/updateSession';
import { buttons } from '../Info.json';
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
      password: '',
      confirmation: '',
      status: user === null ? session.user.status : user.status,
      typeDoc: user === null ? session.user.typeDoc : user.typeDoc,
      numDoc: user === null ? session.user.numDoc : user.numDoc,
      abrev: user === null ? session.user.abrev : user.abrev,
      nickname: user === null ? session.user.nickname : user.nickname,
      lastname1: user === null ? session.user.lastname1 : user.lastname1,
      lastname2: user === null ? session.user.lastname2 : user.lastname2,
      mobile: user === null ? session.user.mobile : user.mobile,
      address: user === null ? session.user.address : user.address,
      information: user === null ? session.user.information : user.information,
      degree: user === null ? session.user.degree : user.degree,
      biography: user === null ? session.user.biography : user.biography,
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
      const { changeSession, session } = this.props;
      const { id, username, email, password, confirmation, status, typeDoc, numDoc,
        abrev, nickname, lastname1, lastname2, mobile, address, information, degree,
        biography } = this.state;
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
      const password_digest = bcrypt.hashSync(password, salt);
      const data = {
        username,
        email,
        password_digest,
        status,
        type_doc: typeDoc,
        num_doc: numDoc === '' ? username : numDoc,
        abrev,
        nickname,
        lastname1,
        lastname2,
        mobile,
        address,
        information,
        degree,
        biography,
      };
      if (id === null) {
        const URL_API = process.env.REACT_APP_URL_APISPERU_DNI;
        const TOKEN_API = process.env.REACT_APP_TOKEN_APISPERU;
        const req = `${URL_API}${username}${TOKEN_API}`;
        const infoAPI = await axios.get(req);
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
      if (session.user.id !== 1) {
        changeSession(user);
      }
    } catch (err) {
      this.setState({
        error: 'DNI inválido',
        loading: false,
      });
    }
  }

  render() {
    const { id, username, email, password, confirmation, status, typeDoc, numDoc,
      abrev, nickname, lastname1, lastname2, mobile, address, information, degree,
      biography, loading, message, error } = this.state;
    const { session } = this.props;
    const { signin, update, wait } = buttons;
    const btnText = id === null ? signin : update;
    const headerText = id === null ? 'Registro' : 'Perfil';
    return (
      <form className="row w-100" onSubmit={this.handleSubmit}>
        <div className="col-12 form-header">
          <h2>{headerText}</h2>
          {message === null ? null : <p className="text-success">{message}</p>}
          {error === null ? null : <p className="text-danger">{error}</p>}
        </div>
        <div className="col">
          {id === null
            ? null : <h2>usuario</h2>}
          <input
            className="form-control input-text"
            onChange={this.handleChange}
            placeholder="DNI"
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
          />
          <input
            className="form-control input-text"
            onChange={this.handleChange}
            name="confirmation"
            placeholder="confirmación"
            value={confirmation}
            type="password"
            disabled={password === ''}
            required={password !== ''}
            maxLength={12}
          />
          { session.user.status === 1
            ? (
              <input
                className="form-control input-text"
                onChange={this.handleChange}
                name="status"
                min="2"
                max="5"
                value={status}
                type="number"
                disabled={status === 1}
              />
            ) : null}
          <button type="submit" className="btn btn-primary btn-home" disabled={loading}>
            {loading ? wait : btnText}
          </button>
        </div>
        {id === null
          ? null
          : (
            <div className="col">
              <h2>datos personales</h2>
              <input
                className="form-control input-text"
                onChange={this.handleChange}
                placeholder="Tipo de Documento"
                name="typeDoc"
                value={typeDoc}
                required={session.user.id !== 1}
                disabled
              />
              <input
                className="form-control input-text"
                onChange={this.handleChange}
                placeholder="Numero de Documento"
                name="numDoc"
                value={numDoc}
                required={session.user.id !== 1}
                disabled
              />
              <input
                className="form-control input-text"
                onChange={this.handleChange}
                placeholder="abrev (ej: Sr. Sra. Srta. Lic. Mg. Dr.)"
                name="abrev"
                value={abrev}
                required={session.user.id !== 1}
              />
              <input
                className="form-control input-text"
                onChange={this.handleChange}
                placeholder="nombre(s)"
                name="nickname"
                value={nickname}
                required={session.user.id !== 1}
                disabled={nickname !== ''}
              />
              <input
                className="form-control input-text"
                onChange={this.handleChange}
                placeholder="apellido paterno"
                name="lastname1"
                value={lastname1}
                required={session.user.id !== 1}
                disabled={nickname !== ''}
              />
              <input
                className="form-control input-text"
                onChange={this.handleChange}
                placeholder="apellido materno"
                name="lastname2"
                value={lastname2}
                required={session.user.id !== 1}
                disabled={nickname !== ''}
              />
              <input
                className="form-control input-text"
                onChange={this.handleChange}
                placeholder="celular"
                name="mobile"
                value={mobile}
                required={session.user.id !== 1}
              />
              <input
                className="form-control input-text"
                onChange={this.handleChange}
                placeholder="direccion"
                name="address"
                value={address}
              />
              <textarea
                className="form-control input-text"
                onChange={this.handleChange}
                placeholder="information adicional"
                name="information"
                value={information}
                rows="3"
              />
              <button type="submit" className="btn btn-primary btn-home" disabled={loading}>
                {loading ? wait : btnText}
              </button>
            </div>
          )}
        {session.user.status === 3
          ? (
            <div className="col">
              <h2>datos académicos</h2>
              <input
                className="form-control input-text"
                onChange={this.handleChange}
                placeholder="Grado Académico"
                name="degree"
                value={degree}
              />
              <textarea
                className="form-control input-text"
                onChange={this.handleChange}
                placeholder="Biografía"
                name="biography"
                value={biography}
                rows="7"
              />
              <button type="submit" className="btn btn-primary btn-home" disabled={loading}>
                {loading ? wait : btnText}
              </button>
            </div>
          ) : null}
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
