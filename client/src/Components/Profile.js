/* eslint-disable camelcase */
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import updateSession from '../redux/actions/updateSession';
import { buttons, profileInfo } from '../Info.json';
import SigninForm from './SigninForm';
import './Profile.css';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    const { session } = props;
    this.state = {
      loading: false,
      id: session.user.id,
      typeDoc: session.user.typeDoc,
      numDoc: session.user.numDoc,
      abrev: session.user.abrev,
      nickname: session.user.nickname,
      lastname1: session.user.lastname1,
      lastname2: session.user.lastname2,
      mobile: session.user.mobile,
      address: session.user.address,
      information: session.user.informationon,
      degree: session.user.degree,
      biography: session.user.biography,
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
      const { id, abrev, mobile, address,
        information, degree, biography } = this.state;
      const data = {
        abrev,
        mobile,
        address,
        information,
        degree,
        biography,
      };
      const res = await axios.put(`api/users/${id}`, data);
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
        error: 'error',
        loading: false,
      });
    }
  }

  render() {
    const { typeDoc, numDoc, abrev, nickname, lastname1, lastname2, mobile,
      address, information, degree, biography, loading, message, error } = this.state;
    const { session } = this.props;
    const { update, wait } = buttons;
    const { title } = profileInfo;
    return (
      <div className="row w-100">
        <div className="col-12 form-header">
          <h2>{title}</h2>
          {message === null ? null : <p className="text-success">{message}</p>}
          {error === null ? null : <p className="text-danger">{error}</p>}
        </div>
        <div className="col">
          <h2>usuario</h2>
          <SigninForm />
        </div>
        {session.user.status !== 1
          ? (
            <form className="col" onSubmit={this.handleSubmit}>
              <h2>datos personales</h2>
              <input
                className="form-control input-text"
                onChange={this.handleChange}
                placeholder="Tipo de Documento"
                name="typeDoc"
                value={typeDoc}
                disabled
              />
              <input
                className="form-control input-text"
                onChange={this.handleChange}
                placeholder="Numero de Documento"
                name="numDoc"
                value={numDoc}
                disabled
              />
              <input
                className="form-control input-text"
                onChange={this.handleChange}
                placeholder="abrev (ej: Sr. Sra. Srta. Lic. Mg. Dr.)"
                name="abrev"
                value={abrev}
              />
              <input
                className="form-control input-text"
                onChange={this.handleChange}
                placeholder="nombre(s)"
                name="nickname"
                value={nickname}
                required
                disabled={nickname !== ''}
              />
              <input
                className="form-control input-text"
                onChange={this.handleChange}
                placeholder="apellido paterno"
                name="lastname1"
                value={lastname1}
                required
                disabled={lastname1 !== ''}
              />
              <input
                className="form-control input-text"
                onChange={this.handleChange}
                placeholder="apellido materno"
                name="lastname2"
                value={lastname2}
                disabled={lastname2 !== ''}
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
                {loading ? wait : update}
              </button>
            </form>
          ) : null}
        {session.user.status === 3
          ? (
            <form className="col" onSubmit={this.handleSubmit}>
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
                {loading ? wait : update}
              </button>
            </form>
          ) : null}
      </div>
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
  changeSession: (session) => dispatch(updateSession(session)),
});

const ProfileWrapper = connect(mapStateToProps, mapDispatchToProps)(Profile);

export default ProfileWrapper;
