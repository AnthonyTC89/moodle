import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './SubjectsShow.css';

class SubjectsShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { data, session } = this.props;
    const { item, course } = data;
    const { name, description, information } = item;
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
        <div className="row row-text">
          <h5>información adicional</h5>
          <p>{information}</p>
        </div>
        {session.user.status <= 3
          ? 'Upload'
          : null}
      </article>
    );
  }
}

SubjectsShow.propTypes = {
  data: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  session: state.session,
});

const SubjectsShowWrapper = connect(mapStateToProps, null)(SubjectsShow);

export default SubjectsShowWrapper;
