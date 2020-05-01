import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import './Dashboard.css';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const { session, history } = this.props;
    if (!session.isLoggedIn) {
      history.push('/');
    }
  }

  componentDidUpdate() {
    const { session, history } = this.props;
    if (!session.isLoggedIn) {
      history.push('/');
    }
  }

  render() {
    const { dashboard, data } = this.props;
    const { Component } = dashboard;
    return (
      <>
        <header><Navbar /></header>
        <main>
          <Component data={data} />
        </main>
        <Footer />
      </>
    );
  }
}

Dashboard.propTypes = {
  session: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  dashboard: PropTypes.object.isRequired,
  data: PropTypes.object,
};

Dashboard.defaultProps = {
  data: {},
};

const mapStateToProps = (state) => ({
  session: state.session,
  dashboard: state.dashboard,
  data: state.data,
});

const DashboardWrapper = connect(mapStateToProps, null)(Dashboard);

export default DashboardWrapper;
