import React from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import AcademicPeriodsForm from '../Components/AcademicPeriodsForm';
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
    return (
      <section className="container">
        <h2>periodos académicos</h2>
        <button
          className="btn btn-primary"
          type="button"
          onClick={formVisible ? this.handleCloseForm : () => this.handleOpenForm(null)}
        >
          {formVisible ? 'Volver' : 'Nuevo'}
        </button>
        {message === null ? null : <p className="text-success">{message}</p>}
        {error === null ? null : <p className="text-danger">{error}</p>}
        {formVisible ? null
          : (
            <div className="row row-user">
              <div className="col-1 user-text">id</div>
              <div className="col-2 user-text">año</div>
              <div className="col-2 user-text">periodo</div>
              <div className="col-3 user-text">informacion</div>
              <div className="col-2 user-text">status</div>
              <div className="col-2 user-text">actions</div>
            </div>
          )}
        {formVisible ? <AcademicPeriodsForm item={itemEdit} />
          : academicPeriods.map((item) => (
            <div key={uuidv4()} className="row row-user">
              <div className="col-1 user-text">
                <p>{item.id}</p>
              </div>
              <div className="col-2 user-text">
                <p>{item.year}</p>
              </div>
              <div className="col-2 user-text">
                <p>{item.period}</p>
              </div>
              <div className="col-3 user-text">
                <p>{item.information}</p>
              </div>
              <div className="col-2 user-text">
                <p>{item.status ? 'Activo' : 'Inactivo'}</p>
              </div>
              <div className="col-2 btn-actions">
                <button
                  className="btn btn-warning"
                  type="button"
                  disabled={loading}
                  onClick={() => this.handleActive(item)}
                >
                  {item.status ? 'Desactivar' : 'Activar'}
                </button>
                <button
                  className="btn btn-success"
                  type="button"
                  onClick={() => this.handleOpenForm(item)}
                >
                  Edit
                </button>
                <button className="btn btn-danger" type="button" disabled={loading}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
      </section>
    );
  }
}

export default AcademicPeriods;
