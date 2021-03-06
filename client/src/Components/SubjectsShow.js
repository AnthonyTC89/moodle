import React from 'react';
import PropTypes from 'prop-types';
import Documents from './Documents';
import './SubjectsShow.css';

class SubjectsShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { data } = this.props;
    const { subject, course } = data;
    const { name, description, information } = subject;
    return (
      <article className="container">
        <div className="row row-header">
          <h2>{name}</h2>
          <small>{course.name}</small>
        </div>
        <div className="row row-text">
          <h5>descripción del tema</h5>
          <p>{description}</p>
        </div>
        {information === ''
          ? null
          : (
            <div className="row row-text">
              <h5>información adicional</h5>
              <p>{information}</p>
            </div>
          )}
        <div className="row">
          <Documents subject={subject} />
        </div>
      </article>
    );
  }
}

SubjectsShow.propTypes = {
  data: PropTypes.object.isRequired,

};

export default SubjectsShow;
