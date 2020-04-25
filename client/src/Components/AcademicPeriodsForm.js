import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
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
      year: item === null ? null : item.year,
      period: item === null ? null : item.period,
      information: item === null ? '' : item.information,
      status: item === null ? true : item.status,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeCheckBox = this.handleChangeCheckBox.bind(this);
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
      const { id, year, period, information, status } = this.state;
      const data = { year, period, information, status };

      const res = id === null
        ? await axios.post('api/academic_periods', data)
        : await axios.put(`api/academic_periods/${id}`, data);

      this.setState({
        loading: false,
        id: res.data.id,
        year: res.data.year,
        period: res.data.period,
        information: res.data.information,
        status: res.data.status,
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
    const { id, year, period, information, status, loading, message, error } = this.state;
    const btnText = id === null ? 'Agregar' : 'Actualizar';
    return (
      <form onSubmit={this.handleSubmit}>
        <h2 className="text-primary">formulario</h2>
        {message === null ? null : <p className="text-success">{message}</p>}
        {error === null ? null : <p className="text-danger">{error}</p>}
        <input
          className="form-control"
          onChange={this.handleChange}
          placeholder="año"
          type="number"
          name="year"
          value={year}
          required
        />
        <input
          className="form-control"
          onChange={this.handleChange}
          placeholder="periodo"
          type="number"
          name="period"
          value={period}
          required
        />
        <textarea
          className="form-control input-text"
          onChange={this.handleChange}
          placeholder="Información adicional"
          name="information"
          value={information}
          rows="3"
        />
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

AcademicPeriodsForm.propTypes = {
  item: PropTypes.object.isRequired,
};

export default AcademicPeriodsForm;
