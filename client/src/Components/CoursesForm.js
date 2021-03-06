/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable object-property-newline */
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { buttons } from '../Info.json';
import './CoursesForm.css';

class CoursesForm extends React.Component {
  constructor(props) {
    super(props);
    const { course, session } = props;
    this.state = {
      loading: false,
      message: null,
      error: null,
      id: course === null ? null : course.id,
      name: course === null ? '' : course.name,
      philosophy: course === null ? '' : course.philosophy,
      axis: course === null ? '' : course.axis,
      profile: course === null ? '' : course.profile,
      information: course === null ? '' : course.information,
      academic_period_id: course === null ? '' : course.academic_period_id,
      user_id: course === null ? session.user.id : course.user_id,
      academicPeriodsActive: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  async handleSubmit(e) {
    e.preventDefault();
    this.setState({
      message: null,
      error: null,
      loading: true,
    });
    try {
      const { id, name, philosophy, profile, axis, information,
        academic_period_id } = this.state;
      const { session } = this.props;
      const data = { name, philosophy, profile, axis, information,
        academic_period_id: 1, user_id: session.user.id };

      const res = id === null
        ? await axios.post('api/courses', data)
        : await axios.put(`api/courses/${id}`, data);

      this.setState({
        loading: false,
        id: res.data.id,
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
    const { id, name, philosophy, profile, axis, information, user_id,
      academic_period_id, academicPeriodsActive, loading, message, error } = this.state;
    const { session } = this.props;
    const { add, update, wait } = buttons;
    const btnText = id === null ? add : update;
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>formulario</h2>
        {message === null ? null : <p className="text-success">{message}</p>}
        {error === null ? null : <p className="text-danger">{error}</p>}
        {session.user.status === 1 && id !== null
          ? (
            <input
              className="form-control input-text"
              onChange={this.handleChange}
              placeholder="id de usuario"
              type="number"
              min={1}
              name="user_id"
              value={user_id}
              required
              disabled={loading}
            />
          ) : null}
        <input
          className="form-control input-text"
          onChange={this.handleChange}
          placeholder="nombre del curso"
          name="name"
          value={name}
          required
          disabled={loading}
        />
        <textarea
          className="form-control input-text-long"
          onChange={this.handleChange}
          placeholder="Filosofía del curso"
          name="philosophy"
          value={philosophy}
          rows="3"
          disabled={loading}
        />
        <textarea
          className="form-control input-text-long"
          onChange={this.handleChange}
          placeholder="Perfil del curso"
          name="profile"
          value={profile}
          rows="3"
          disabled={loading}
        />
        <textarea
          className="form-control input-text-long"
          onChange={this.handleChange}
          placeholder="Eje del curso"
          name="axis"
          value={axis}
          rows="3"
          disabled={loading}
        />
        <textarea
          className="form-control input-text-long"
          onChange={this.handleChange}
          placeholder="Información adicional"
          name="information"
          value={information}
          rows="3"
          disabled={loading}
        />
        {/* <select className="custom-select" onChange={this.handleChange}>
          <option selected>Periodo Academico</option>
          {academicPeriodsActive.map((acadPer) => (
            <option key={uuidv4()} value={acadPer.id}>
              {`${acadPer.year}-${acadPer.period}`}
            </option>
          ))}
        </select> */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? wait : btnText}
        </button>
      </form>
    );
  }
}

CoursesForm.propTypes = {
  course: PropTypes.object.isRequired,
};

CoursesForm.propTypes = {
  session: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  session: state.session,
});

const CoursesFormWrapper = connect(mapStateToProps, null)(CoursesForm);

export default CoursesFormWrapper;
