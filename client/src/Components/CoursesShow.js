import React from 'react';
import PropTypes from 'prop-types';
import './CoursesShow.css';

class CoursesShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { data } = this.props;
    const { name, philosophy, axis, profile, information, year, period } = data;
    const acadPeriod = `${year}-${period}`;
    return (
      <article className="container">
        <div className="row row-header">
          <h2>{name}</h2>
          <small>{acadPeriod}</small>
        </div>
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
};

export default CoursesShow;
