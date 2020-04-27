import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import SubjectsForm from './SubjectsForm';
import './Subjects.css';

class Subjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjects: [],
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
      const { data } = this.props;
      const res = await axios.get('/api/subjects_full', { params: { course_id: data.id } });

      this.setState({
        subjects: res.data,
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
      await axios.put(`api/subjects/${item.id}`, data);
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
    const { subjects, loading, message, error, itemEdit, formVisible } = this.state;
    const { session, data } = this.props;
    return (
      <section className="container">
        <h2>{data.name}</h2>
        <h3>Temas</h3>
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
                ? <div className="col user-text">id</div>
                : null}
              <div className="col user-text">nombre</div>
              {session.user.status <= 3
                ? <div className="col user-text">status</div>
                : null}
              <div className="col user-text">acciones</div>
            </div>
          )}
        {formVisible ? <SubjectsForm item={itemEdit} course={data} />
          : subjects.map((item) => (
            <div key={uuidv4()} className="row row-user">
              {session.user.status <= 2
                ? (
                  <div className="col user-text">
                    <p>{item.id}</p>
                  </div>
                ) : null}
              <div className="col user-text">
                <p>{item.name}</p>
              </div>
              {session.user.status <= 3
                ? (
                  <div className="col user-text">
                    <p>{item.status ? 'Activo' : 'Inactivo'}</p>
                  </div>
                ) : null}
              <div className="col btn-actions">
                {session.user.status <= 3
                  ? (
                    <button
                      className="btn btn-warning"
                      type="button"
                      disabled={loading}
                      onClick={() => this.handleActive(item)}
                    >
                      {item.status ? 'Desactivar' : 'Activar'}
                    </button>
                  ) : null}
                {session.user.status <= 3
                  ? (
                    <button
                      className="btn btn-success"
                      type="button"
                      onClick={() => this.handleOpenForm(item)}
                    >
                      Edit
                    </button>
                  ) : null}
                {session.user.status === 1
                  ? (
                    <button className="btn btn-danger" type="button" disabled={loading}>
                      Eliminar
                    </button>
                  ) : null}
                <button className="btn btn-secondary" type="button">
                  Sessiones
                </button>
                <button className="btn btn-secondary" type="button">
                  Bibliografia
                </button>
              </div>
            </div>
          ))}
      </section>
    );
  }
}

Subjects.propTypes = {
  session: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  session: state.session,
});


const SubjectsWrapper = connect(mapStateToProps, null)(Subjects);

export default SubjectsWrapper;