import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import SubjectsForm from './SubjectsForm';
import updateData from '../redux/actions/updateData';
import updateDashboard from '../redux/actions/updateDashboard';
import { buttons } from '../Info.json';
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
    this.handleChangeComponent = this.handleChangeComponent.bind(this);
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
      const { course } = data;
      const res = await axios.get('/api/subjects_full', { params: { course_id: course.id } });

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

  async handleChangeComponent(subject, name) {
    const { changeComponent, changeData, data } = this.props;
    const { course } = data;
    const params = { subject, course, prev: 'Subjects' };
    await changeData(params);
    await changeComponent(name);
  }

  render() {
    const { subjects, loading, message, error, itemEdit, formVisible } = this.state;
    const { session, data, changeComponent } = this.props;
    const { course, prev } = data;
    const { create, back, inactive, active, details, edit, wait, remove } = buttons;
    return (
      <section className="container">
        <h3>Temas</h3>
        <h4>{course.name}</h4>
        <div className="col btn-actions">
          {session.user.status <= 3
            ? (
              <button
                className="btn btn-primary"
                type="button"
                onClick={formVisible ? this.handleCloseForm : () => this.handleOpenForm(null)}
                disabled={loading}
              >
                {formVisible ? back : create}
              </button>
            ) : null}
          {formVisible ? null : (
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => changeComponent(prev)}
              disabled={loading}
            >
              {back}
            </button>
          )}
        </div>
        {message === null ? null : <p className="text-success">{message}</p>}
        {error === null ? null : <p className="text-danger">{error}</p>}
        {formVisible ? null
          : (
            <div className="row row-user">
              {session.user.status <= 2
                ? <div className="col col-text"><h6>id</h6></div>
                : null}
              <div className="col col-text"><h6>nombre</h6></div>
              {session.user.status <= 3
                ? <div className="col col-text"><h6>estado</h6></div>
                : null}
              <div className="col col-text"><h6>ver</h6></div>
              {session.user.status <= 3
                ? <div className="col col-text"><h6>acciones</h6></div>
                : null}
              {session.user.status <= 2
                ? <div className="col col-text"><h6>eliminar</h6></div>
                : null}
            </div>
          )}
        {formVisible ? <SubjectsForm item={itemEdit} course={data} />
          : subjects.map((item) => (
            <div key={uuidv4()} className="row row-user">
              {session.user.status <= 2
                ? (
                  <div className="col col-text">
                    <p>{item.id}</p>
                  </div>
                ) : null}
              <div className="col col-text">
                <p className={item.status ? '' : 'text-line-through'}>{item.name}</p>
              </div>
              {session.user.status <= 3
                ? (
                  <div className="col btn-actions">
                    <button
                      className="btn btn-warning"
                      type="button"
                      onClick={() => this.handleActive(item)}
                      disabled={loading}
                    >
                      {item.status ? inactive : active}
                    </button>
                  </div>
                ) : null}
              <div className="col btn-actions">
                <button
                  className="btn btn-info"
                  type="button"
                  onClick={() => this.handleChangeComponent(item, 'SubjectsShow')}
                  disabled={loading}
                >
                  {details}
                </button>
              </div>
              {session.user.status <= 3
                ? (
                  <div className="col btn-actions">
                    <button
                      className="btn btn-success"
                      type="button"
                      onClick={() => this.handleOpenForm(item)}
                      disabled={loading}
                    >
                      {edit}
                    </button>
                  </div>
                ) : null}
              {session.user.status <= 2
                ? (
                  <div className="col btn-actions">
                    <button
                      className="btn btn-danger"
                      type="button"
                      disabled={loading}
                    >
                      {loading ? wait : remove }
                    </button>
                  </div>
                ) : null}
            </div>
          ))}
      </section>
    );
  }
}

Subjects.propTypes = {
  session: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
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

const SubjectsWrapper = connect(mapStateToProps, mapDispatchToProps)(Subjects);

export default SubjectsWrapper;
