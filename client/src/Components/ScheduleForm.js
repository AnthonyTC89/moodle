/* eslint-disable camelcase */
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { buttons } from '../Info.json';
import './ScheduleForm.css';

class ScheduleForm extends React.Component {
  constructor(props) {
    super(props);
    const { schedule, course } = props;
    const zoom = 'https://us04web.zoom.us/j/78623687786';
    this.state = {
      loading: false,
      message: null,
      error: null,
      id: schedule === null ? null : schedule.id,
      weekday: schedule === null ? '' : schedule.weekday,
      time: schedule === null ? '' : schedule.time,
      location: schedule === null ? zoom : schedule.location,
      course_id: course.id,
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
      const { id, weekday, time, location, course_id } = this.state;
      const data = { weekday, time, location, course_id };

      const res = id === null
        ? await axios.post('api/schedules', data)
        : await axios.put(`api/schedules/${id}`, data);

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
    const { id, weekday, time, location, course_id, loading, message, error } = this.state;
    const { session } = this.props;
    const { add, update, wait } = buttons;
    const btnText = id === null ? add : update;
    return (
      <form onSubmit={this.handleSubmit}>
        <h2 className="text-primary">formulario</h2>
        {message === null ? null : <p className="text-success">{message}</p>}
        {error === null ? null : <p className="text-danger">{error}</p>}
        {session.user.status === 1 && id !== null
          ? (
            <input
              className="form-control input-text"
              onChange={this.handleChange}
              placeholder="id de curso"
              type="number"
              min={1}
              name="course_id"
              value={course_id}
              required
              disabled={loading}
            />
          ) : null}
        <input
          className="form-control input-text"
          onChange={this.handleChange}
          placeholder="ej. Lun - Mie - Vie"
          name="weekday"
          value={weekday}
          required
          disabled={loading}
        />
        <input
          className="form-control input-text"
          onChange={this.handleChange}
          placeholder="hora"
          type="time"
          name="time"
          value={time}
          required
          disabled={loading}
        />
        <input
          className="form-control input-text"
          onChange={this.handleChange}
          placeholder="lugar (link)"
          name="location"
          value={location}
          required
          disabled={loading}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? wait : btnText}
        </button>
      </form>
    );
  }
}

ScheduleForm.propTypes = {
  schedule: PropTypes.object.isRequired,
  course: PropTypes.object.isRequired,
};

ScheduleForm.propTypes = {
  session: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  session: state.session,
});

const ScheduleFormWrapper = connect(mapStateToProps, null)(ScheduleForm);

export default ScheduleFormWrapper;
