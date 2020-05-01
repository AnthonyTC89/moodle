import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { academicPeriodsInfo, buttons } from '../Info.json';
import './AcademicPeriodsForm.css';

class AcademicPeriodsForm extends React.Component {
  constructor(props) {
    super(props);
    const { item } = props;
    this.state = {
      loading: false,
      message: null,
      error: null,
      id: item === null ? null : item.id,
      year: item === null ? '' : item.year,
      period: item === null ? '' : item.period,
      information: item === null ? '' : item.information,
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
      const { id, year, period, information } = this.state;
      const data = { year, period, information };

      const res = id === null
        ? await axios.post('api/academic_periods', data)
        : await axios.put(`api/academic_periods/${id}`, data);

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
    const { id, year, period, information, loading, message, error } = this.state;
    const { form } = academicPeriodsInfo;
    const { title, placeholders } = form;
    const { add, update, wait } = buttons;
    const btnText = id === null ? add : update;
    return (
      <form onSubmit={this.handleSubmit}>
        <h2 className="text-primary">{title}</h2>
        {message === null ? null : <p className="text-success">{message}</p>}
        {error === null ? null : <p className="text-danger">{error}</p>}
        <input
          className="form-control input-text"
          onChange={this.handleChange}
          placeholder={placeholders.year}
          type="number"
          name="year"
          value={year}
          required
        />
        <input
          className="form-control input-text"
          onChange={this.handleChange}
          placeholder={placeholders.period}
          type="number"
          name="period"
          value={period}
          required
        />
        <textarea
          className="form-control input-text"
          onChange={this.handleChange}
          placeholder={placeholders.information}
          name="information"
          value={information}
          rows="3"
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? wait : btnText}
        </button>
      </form>
    );
  }
}

AcademicPeriodsForm.propTypes = {
  item: PropTypes.object,
};

AcademicPeriodsForm.defaultProps = {
  item: null,
};

export default AcademicPeriodsForm;
