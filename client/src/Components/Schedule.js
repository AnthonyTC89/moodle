import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import updateDashboard from '../redux/actions/updateDashboard';
import ScheduleForm from './ScheduleForm';
import { buttons, ScheduleInfo } from '../Info.json';
import './Schedule.css';

class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      message: null,
      error: null,
      schedules: [],
      itemEdit: null,
      formVisible: false,
    };
    this.handleCloseForm = this.handleCloseForm.bind(this);
    this.handleOpenForm = this.handleOpenForm.bind(this);
    this.handleActive = this.handleActive.bind(this);
  }

  componentDidMount() {
    this.getSchedules();
  }

  async getSchedules() {
    const { session, data } = this.props;
    const { course } = data;
    this.setState({
      loading: true,
      message: null,
      error: null,
    });
    try {
      const res = await axios.get('/api/schedules_full',
        { params: { course_id: course.id, session_status: session.user.status } });
      this.setState({
        schedules: res.data,
        loading: false,
      });
    } catch (error) {
      this.setState({
        message: 'Error en el Servidor',
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
    this.getSchedules();
  }

  async handleActive(item) {
    this.setState({
      loading: true,
    });
    try {
      const data = { status: !item.status };
      await axios.put(`api/schedules/${item.id}`, data);
      this.setState({
        message: 'Actualizado',
        loading: false,
      });
      await this.getSchedules();
    } catch (err) {
      this.setState({
        error: 'error',
        loading: false,
      });
    }
  }

  render() {
    const { schedules, loading, message, error, formVisible, itemEdit } = this.state;
    const { data, session, changeComponent } = this.props;
    const { course, prev } = data;
    const { edit, wait, active, inactive, remove, back, add } = buttons;
    const { title } = ScheduleInfo;
    return (
      <section className="container">
        <h2>{title}</h2>
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
                {formVisible ? back : add}
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
              <div className="col col-text"><h6>día</h6></div>
              <div className="col col-text"><h6>hora</h6></div>
              <div className="col col-text"><h6>link</h6></div>
              {session.user.status <= 3
                ? <div className="col col-text"><h6>estado</h6></div>
                : null}
              {session.user.status <= 3
                ? <div className="col col-text"><h6>acciones</h6></div>
                : null}
              {session.user.status <= 2
                ? <div className="col col-text"><h6>eliminar</h6></div>
                : null}
            </div>
          )}
        {formVisible ? <ScheduleForm schedule={itemEdit} course={course} />
          : schedules.map((item) => (
            <div key={uuidv4()} className="row row-user">
              {session.user.status <= 2
                ? (
                  <div className="col col-text">
                    <p>{item.id}</p>
                  </div>
                ) : null}
              <div className="col col-text">
                <p className={item.status ? '' : 'text-line-through'}>{item.weekday}</p>
              </div>
              <div className="col col-text">
                <p>{item.time}</p>
              </div>
              <div className="col btn-actions">
                <a
                  className="btn btn-primary"
                  href={item.location}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Zoom
                </a>
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

Schedule.propTypes = {
  session: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  changeComponent: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  session: state.session,
});

const mapDispatchToProps = (dispatch) => ({
  changeComponent: (component) => dispatch(updateDashboard(component)),
});

const ScheduleWrapper = connect(mapStateToProps, mapDispatchToProps)(Schedule);

export default ScheduleWrapper;
