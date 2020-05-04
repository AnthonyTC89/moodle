import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import updateSession from '../redux/actions/updateSession';
import Navbar from '../Components/Navbar';
import LoginForm from '../Components/LoginForm';
import SigninForm from '../Components/SigninForm';
import Footer from '../Components/Footer';
import './Home.css';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidUpdate() {
    const { session, history } = this.props;
    if (session.isLoggedIn) {
      history.push('/dashboard');
    }
  }

  handleLogin(e) {
    e.preventDefault();
    const { changeSession } = this.props;
    const user = { status: 5 };
    changeSession(user);
  }

  render() {
    return (
      <>
        <header><Navbar /></header>
        <main className="container">
          <div className="row home-row">
            <div className="col-12">
              <button
                className="btn btn-success"
                type="button"
                onClick={this.handleLogin}
              >
                Invitado
              </button>
            </div>
            <section className="col-12 col-md-6 login-section">
              <LoginForm />
            </section>
            <section className="col-12 col-md-6 mt-4 mt-md-0 signin-section">
              <SigninForm />
            </section>
          </div>
        </main>
        <Footer />
      </>
    );
  }
}

Home.propTypes = {
  session: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  changeSession: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  session: state.session,
});

const mapDispatchToProps = (dispatch) => ({
  changeSession: (session) => dispatch(updateSession(session)),
});

const HomeWrapper = connect(mapStateToProps, mapDispatchToProps)(Home);

export default HomeWrapper;
