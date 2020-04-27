import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import CoursesForm from './CoursesForm';
import updateData from '../redux/actions/updateData';
import updateDashboard from '../redux/actions/updateDashboard';
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
    this.handleSubject = this.handleSubject.bind(this);
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
      const { session } = this.props;
      const res = await axios.get('/api/courses_full',
        { params: { user_id: session.user.id } });

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

  async handleSubject(item) {
    const { changeComponent, changeData } = this.props;
    await changeData(item);
    await changeComponent('Subjects');
  }

  render() {
    const { courses, loading, message, error, itemEdit, formVisible } = this.state;
    const { session } = this.props;
    return (
      <section className="container">
        <h2>Cursos</h2>
        { session.user.status <= 3
          ? (
            <button
              className="btn btn-primary"
              type="button"
              onClick={formVisible ? this.handleCloseForm : () => this.handleOpenForm(null)}
            >
              {formVisible ? 'Volver' : 'Nuevo'}
            </button>
          ) : null}
        {message === null ? null : <p className="text-success">{message}</p>}
        {error === null ? null : <p className="text-danger">{error}</p>}
        {formVisible ? null
          : (
            <div className="row row-user">
              {session.user.status <= 2
                ? <div className="col user-text"><h6>id</h6></div>
                : null}
              <div className="col user-text"><h6>periodo</h6></div>
              <div className="col user-text"><h6>nombre</h6></div>
              {session.user.status <= 3
                ? <div className="col user-text"><h6>estado</h6></div>
                : null}
              <div className="col user-text"><h6>ver</h6></div>
              {session.user.status <= 3
                ? <div className="col user-text"><h6>acciones</h6></div>
                : null}
            </div>
          )}
        {formVisible ? <CoursesForm item={itemEdit} />
          : courses.map((item) => (
            <div key={uuidv4()} className="row row-user">
              {session.user.status <= 2
                ? (
                  <div className="col user-text">
                    <p>{item.id}</p>
                  </div>
                ) : null}
              <div className="col user-text">
                <p>{`${item.year}-${item.period}`}</p>
              </div>
              <div className="col user-text">
                <p className={item.status ? '' : 'text-line-through'}>{item.name}</p>
              </div>
              {session.user.status <= 3
                ? (
                  <div className="col user-text">
                    <button
                      className="btn btn-warning"
                      type="button"
                      disabled={loading}
                      onClick={() => this.handleActive(item)}
                    >
                      {item.status ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                ) : null}
              <div className="col user-text">
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => this.handleSubject(item)}
                >
                  Temas
                </button>
                <button
                  className="btn btn-info"
                  type="button"
                  // onClick={() => this.handleShow(item)}
                >
                  Detalles
                </button>
              </div>
              {session.user.status <= 3
                ? (
                  <div className="col btn-actions">
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
                ) : null}
            </div>
          ))}
      </section>
    );
  }
}

Courses.propTypes = {
  session: PropTypes.object.isRequired,
  changeComponent: PropTypes.func.isRequired,
  changeData: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  session: state.session,
});

const mapDispatchToProps = (dispatch) => ({
  changeComponent: (component) => dispatch(updateDashboard(component)),
  changeData: (data) => dispatch(updateData(data)),
});

const CoursesWrapper = connect(mapStateToProps, mapDispatchToProps)(Courses);

export default CoursesWrapper;
