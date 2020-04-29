import React from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import AcademicPeriodsForm from '../Components/AcademicPeriodsForm';
import { academicPeriodsInfo, buttons } from '../Info.json';
import './AcademicPeriods.css';

class AcademicPeriods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      academicPeriods: [],
      loading: false,
      message: null,
      error: null,
      itemEdit: null,
      formVisible: false,
    };
    this.handleCloseForm = this.handleCloseForm.bind(this);
    this.handleOpenForm = this.handleOpenForm.bind(this);
    this.handleActive = this.handleActive.bind(this);
  }

  componentDidMount() {
    this.getInfo();
  }

  async getInfo() {
    this.setState({
      loading: true,
      message: null,
      error: null,
    });
    try {
      const res = await axios.get('/api/academic_periods');
      this.setState({
        academicPeriods: res.data,
        loading: false,
      });
    } catch (err) {
      this.setState({
        error: 'Error en el Servidor',
        loading: false,
      });
    }
  }

  handleOpenForm(itemEdit) {
    this.setState({
      formVisible: true,
      itemEdit,
    });
  }

  handleCloseForm() {
    this.setState({
      formVisible: false,
    });
    this.getInfo();
  }

  async handleActive(item) {
    this.setState({
      loading: true,
    });
    try {
      const data = { status: !item.status };
      await axios.put(`api/academic_periods/${item.id}`, data);
      this.setState({
        message: 'Item updated',
        loading: false,
      });
      await this.getInfo();
    } catch (err) {
      this.setState({
        error: 'error',
        loading: false,
      });
    }
  }

  render() {
    const { academicPeriods, loading, message, error, itemEdit, formVisible } = this.state;
    const { create, back, edit, remove, active, inactive } = buttons;
    const { title, columns } = academicPeriodsInfo;
    return (
      <section className="container">
        <h2>{title}</h2>
        <button
          className="btn btn-primary"
          type="button"
          onClick={formVisible ? this.handleCloseForm : () => this.handleOpenForm(null)}
        >
          {formVisible ? back : create}
        </button>
        {message === null ? null : <p className="text-success">{message}</p>}
        {error === null ? null : <p className="text-danger">{error}</p>}
        {formVisible ? null
          : (
            <div className="row row-user">
              <div className="col user-text">
                <h6>{columns.id}</h6>
              </div>
              <div className="col user-text">
                <h6>{columns.year}</h6>
              </div>
              <div className="col user-text">
                <h6>{columns.period}</h6>
              </div>
              <div className="col user-text">
                <h6>{columns.information}</h6>
              </div>
              <div className="col user-text">
                <h6>{columns.status}</h6>
              </div>
              <div className="col user-text">
                <h6>{columns.accions}</h6>
              </div>
            </div>
          )}
        {formVisible ? <AcademicPeriodsForm item={itemEdit} />
          : academicPeriods.map((item) => (
            <div key={uuidv4()} className="row row-user">
              <div className="col user-text">
                <p>{item.id}</p>
              </div>
              <div className="col user-text">
                <p>{item.year}</p>
              </div>
              <div className="col user-text">
                <p>{item.period}</p>
              </div>
              <div className="col user-text">
                <p>{item.information}</p>
              </div>
              <div className="col user-text">
                <button
                  className="btn btn-warning"
                  type="button"
                  disabled={loading}
                  onClick={() => this.handleActive(item)}
                >
                  {item.status ? inactive : active}
                </button>
              </div>
              <div className="col btn-actions">
                <button
                  className="btn btn-success"
                  type="button"
                  onClick={() => this.handleOpenForm(item)}
                >
                  {edit}
                </button>
                <button className="btn btn-danger" type="button" disabled={loading}>
                  {remove}
                </button>
              </div>
            </div>
          ))}
      </section>
    );
  }
}

export default AcademicPeriods;
