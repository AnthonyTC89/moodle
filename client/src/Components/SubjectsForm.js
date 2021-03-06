/* eslint-disable camelcase */
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { buttons } from '../Info.json';
import './SubjectsForm.css';

class SubjectsForm extends React.Component {
  constructor(props) {
    super(props);
    const { item, course } = props;
    this.state = {
      loading: false,
      message: null,
      error: null,
      id: item === null ? null : item.id,
      name: item === null ? '' : item.name,
      description: item === null ? '' : item.description,
      information: item === null ? '' : item.information,
      course_id: item === null ? course.id : item.course_id,
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
      const { id, name, description, information, course_id } = this.state;
      const data = { name, description, information, course_id };

      const res = id === null
        ? await axios.post('api/subjects', data)
        : await axios.put(`api/subjects/${id}`, data);

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
    const { id, name, description, information, course_id,
      loading, message, error } = this.state;
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
              name="course_id"
              value={course_id}
              required
              disabled={loading}
            />
          ) : null}
        <input
          className="form-control input-text"
          onChange={this.handleChange}
          placeholder="nombre del tema"
          name="name"
          value={name}
          required
          disabled={loading}
        />
        <textarea
          className="form-control input-text-long"
          onChange={this.handleChange}
          placeholder="Descripción del tema"
          name="description"
          value={description}
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
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? wait : btnText}
        </button>
      </form>
    );
  }
}

SubjectsForm.propTypes = {
  item: PropTypes.object.isRequired,
  course: PropTypes.object.isRequired,
};

SubjectsForm.propTypes = {
  session: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  session: state.session,
});

const SubjectsFormWrapper = connect(mapStateToProps, null)(SubjectsForm);

export default SubjectsFormWrapper;
