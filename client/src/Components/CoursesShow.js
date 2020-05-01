import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import updateDashboard from '../redux/actions/updateDashboard';
import { buttons } from '../Info.json';
import './CoursesShow.css';

class CoursesShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { data, changeComponent } = this.props;
    const { course, prev } = data;
    const { name, philosophy, axis, profile, information, year, period } = course;
    const { back } = buttons;
    const acadPeriod = `${year}-${period}`;
    return (
      <article className="container">
        <div className="row row-header">
          <h2>{name}</h2>
          <small>{acadPeriod}</small>
        </div>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => changeComponent(prev)}
        >
          {back}
        </button>
        <div className="row row-text">
          <h5>Filosofía del curso</h5>
          <p>{philosophy}</p>
        </div>
        <div className="row row-text">
          <h5>Perfil del Curso</h5>
          <p>{profile}</p>
        </div>
        <div className="row row-text">
          <h5>Eje del Curso</h5>
          <p>{axis}</p>
        </div>
        <div className="row row-text">
          <h5>Información adicional</h5>
          <p>{information}</p>
        </div>
      </article>
    );
  }
}

CoursesShow.propTypes = {
  data: PropTypes.object.isRequired,
  changeComponent: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  changeComponent: (component) => dispatch(updateDashboard(component)),
});

const CoursesShowWrapper = connect(null, mapDispatchToProps)(CoursesShow);

export default CoursesShowWrapper;
