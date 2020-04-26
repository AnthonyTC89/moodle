/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable object-property-newline */
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import './CoursesForm.css';

class CoursesForm extends React.Component {
  constructor(props) {
    super(props);
    const { item } = props;
    this.state = {
      loading: false,
      message: null,
      error: null,
      id: item === null ? null : item.id,
      name: item === null ? '' : item.name,
      philosophy: item === null ? '' : item.philosophy,
      axis: item === null ? '' : item.axis,
      profile: item === null ? '' : item.profile,
      information: item === null ? '' : item.information,
      status: item === null ? true : item.status,
      academic_period_id: item === null ? '' : item.academic_period_id,
      user_id: item === null ? null : item.user_id,
      academicPeriodsActive: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeCheckBox = this.handleChangeCheckBox.bind(this);
  }

  componentDidMount() {
    this.getAcademicPeriods();
  }

  async getAcademicPeriods() {
    this.setState({
      loading: true,
      message: null,
      error: null,
    });
    try {
      const res = await axios.get('/api/academic_periods_active');
      this.setState({
        academicPeriodsActive: res.data,
        loading: false,
      });
    } catch (err) {
      this.setState({
        error: 'Error en el Servidor',
        loading: false,
      });
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleChangeCheckBox(e) {
    this.setState({
      status: e.target.checked,
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
      const { id, name, philosophy, profile, axis, information,
        status, academic_period_id } = this.state;
      const { session } = this.props;
      const data = { name, philosophy, profile, axis, information,
        status, academic_period_id: 1, user_id: session.user.id };

      const res = id === null
        ? await axios.post('api/courses', data)
        : await axios.put(`api/courses/${id}`, data);

      this.setState({
        loading: false,
        id: res.data.id,
        name: res.data.name,
        philosophy: res.data.philosophy,
        profile: res.data.profile,
        information: res.data.information,
        status: res.data.status,
        academic_period_id: res.data.academic_period_id,
        message: 'Procedimiento exitoso',
      });
    } catch (err) {
      this.setState({
        error: 'error',
        loading: false,
      });
    }
  }

  render() {
    const { id, name, philosophy, profile, axis, information, status, user_id,
      academic_period_id, academicPeriodsActive, loading, message, error } = this.state;
    const { session } = this.props;
    const btnText = id === null ? 'Agregar' : 'Actualizar';
    return (
      <form onSubmit={this.handleSubmit}>
        <h2 className="text-primary">formulario</h2>
        {message === null ? null : <p className="text-success">{message}</p>}
        {error === null ? null : <p className="text-danger">{error}</p>}
        {session.user.status === 1
          ? (
            <input
              className="form-control input-text"
              onChange={this.handleChange}
              placeholder="id de usuario"
              type="number"
              name="user_id"
              value={user_id}
              required
            />
          ) : null}
        <input
          className="form-control input-text"
          onChange={this.handleChange}
          placeholder="nombre del curso"
          name="name"
          value={name}
          required
        />
        <textarea
          className="form-control input-text"
          onChange={this.handleChange}
          placeholder="Filosofía del curso"
          name="philosophy"
          value={philosophy}
          rows="3"
        />
        <textarea
          className="form-control input-text"
          onChange={this.handleChange}
          placeholder="Perfil del curso"
          name="profile"
          value={profile}
          rows="3"
        />
        <textarea
          className="form-control input-text"
          onChange={this.handleChange}
          placeholder="Eje del curso"
          name="axis"
          value={axis}
          rows="3"
        />
        <textarea
          className="form-control input-text"
          onChange={this.handleChange}
          placeholder="Información adicional"
          name="information"
          value={information}
          rows="3"
        />
        {/* <select className="custom-select" onChange={this.handleChange}>
          <option selected>Periodo Academico</option>
          {academicPeriodsActive.map((acadPer) => (
            <option key={uuidv4()} value={acadPer.id}>
              {`${acadPer.year}-${acadPer.period}`}
            </option>
          ))}
        </select> */}
        <div>
          <input
            id="chk-status"
            type="checkbox"
            className="form-check-input"
            checked={status}
            onChange={this.handleChangeCheckBox}
          />
          <label className="form-check-label" htmlFor="chk-status">Activo</label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Espere...' : btnText}
        </button>
      </form>
    );
  }
}

CoursesForm.propTypes = {
  item: PropTypes.object.isRequired,
};

CoursesForm.propTypes = {
  session: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  session: state.session,
});

const CoursesFormWrapper = connect(mapStateToProps, null)(CoursesForm);

export default CoursesFormWrapper;
