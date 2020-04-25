import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import CoursesForm from './CoursesForm';
import './Courses.css';

class Courses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
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
      const res = await axios.get('/api/courses_full');
      this.setState({
        courses: res.data,
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
      await axios.put(`api/courses/${item.id}`, data);
      this.setState({
        message: 'Actualizado',
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
    const { courses, loading, message, error, itemEdit, formVisible } = this.state;
    const { session } = this.props;
    return (
      <section className="container">
        <h2>Cursos</h2>
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
              <div className="col-3 user-text">periodo</div>
              <div className="col-3 user-text">nombre</div>
              <div className="col-2 user-text">status</div>
              <div className="col-3 user-text">actions</div>
            </div>
          )}
        {formVisible ? <CoursesForm item={itemEdit} />
          : courses.map((item) => (
            <div key={uuidv4()} className="row row-user">
              <div className="col-1 user-text">
                <p>{item.id}</p>
              </div>
              <div className="col-3 user-text">
                <p>{`${item.year}-${item.period}`}</p>
              </div>
              <div className="col-3 user-text">
                <p>{item.name}</p>
              </div>
              <div className="col-2 user-text">
                <p>{item.status ? 'Activo' : 'Inactivo'}</p>
              </div>
              <div className="col-3 btn-actions">
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
                {session.user.status === 1
                  ? (
                    <button className="btn btn-danger" type="button" disabled={loading}>
                      Eliminar
                    </button>
                  ) : null}
              </div>
            </div>
          ))}
      </section>
    );
  }
}

Courses.propTypes = {
  session: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  session: state.session,
});

const CoursesWrapper = connect(mapStateToProps, null)(Courses);

export default CoursesWrapper;
