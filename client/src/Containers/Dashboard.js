import React from 'react';
// import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Navbar from '../Dashboard/Navbar';
import Footer from '../Components/Footer';
// import updateRecipes from '../redux/actions/updateRecipes';
import './Dashboard.css';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    };
  }

  componentDidMount() {
    const { session, history } = this.props;
    if (!session.isLoggedIn) {
      history.push('/');
    }
    // this.getRecipes();
  }

  componentDidUpdate() {
    const { session, history } = this.props;
    if (!session.isLoggedIn) {
      history.push('/');
    }
  }

  // async getRecipes() {
  //   const { changeRecipes } = this.props;
  //   try {
  //     const recipes = await axios.get('/api/recipes');
  //     this.setState({
  //       message: '',
  //     });
  //     changeRecipes(recipes.data);
  //   } catch (error) {
  //     this.setState({
  //       message: 'Error en el Servidor',
  //     });
  //   }
  // }

  render() {
    const { message } = this.state;
    const { dashboard } = this.props;
    const { Component } = dashboard;
    return (
      <>
        <header><Navbar /></header>
        <main className="text-center">
          <Component message={message} />
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
};

const mapStateToProps = (state) => ({
  session: state.session,
  dashboard: state.dashboard,
});

const DashboardWrapper = connect(mapStateToProps, null)(Dashboard);

export default DashboardWrapper;
