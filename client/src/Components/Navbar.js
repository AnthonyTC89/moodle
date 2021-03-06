import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import logoDefault from '../Images/logo.png';
import updateDashboard from '../redux/actions/updateDashboard';
import updateSession from '../redux/actions/updateSession';
import { navbarInfo } from '../Info.json';
import 'bootstrap/dist/js/bootstrap';
import './Navbar.css';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { changeComponent, changeSession, session } = this.props;
    const { admin, user, info, close, text } = navbarInfo;
    return (
      <nav className="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
        <div className="navbar-elements">
          <img className="navbar-logo" src={logoDefault} alt="hassana-logo" />
          <div>
            <a className="navbar-brand" href="#home">{text}</a>
          </div>
          {session.user.id === null
            ? null : (
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
              </button>
            )}
        </div>
        {session.user.id === null
          ? null : (
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav btn-container">
                <div className="btn-info-group">
                  {session.user.status === 1
                    ? (
                      <div className="btn-group btn-group-navbar">
                        <button type="button" className="btn btn-info dropdown-toggle btn-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          {admin.name}
                        </button>
                        <div className="dropdown-menu bg-dark btn-dropdown-menu">
                          {admin.buttons.map((btn) => (
                            <button
                              key={uuidv4()}
                              className="btn btn-info btn-dropdown-item"
                              type="button"
                              onClick={() => changeComponent(btn.name)}
                            >
                              {btn.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  {session.user.status <= 4
                    ? (
                      user.buttons.map((btn) => (
                        <button
                          key={uuidv4()}
                          className="btn btn-info btn-navbar"
                          type="button"
                          onClick={() => changeComponent(btn.name)}
                        >
                          {btn.text}
                        </button>
                      ))) : null}
                  <div className="btn-group btn-group-navbar">
                    <button type="button" className="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {info.name}
                    </button>
                    <div className="dropdown-menu bg-dark btn-dropdown-menu">
                      {info.buttons.map((btn) => (
                        <button
                          key={uuidv4()}
                          className="btn btn-info btn-dropdown-item"
                          type="button"
                          onClick={() => changeComponent(btn.name)}
                        >
                          {btn.text}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-danger btn-close"
                  type="button"
                  onClick={() => changeSession(null)}
                >
                  {close.name}
                </button>
              </div>
            </div>
          )}
      </nav>
    );
  }
}

Navbar.propTypes = {
  changeSession: PropTypes.func.isRequired,
  changeComponent: PropTypes.func.isRequired,
  session: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  session: state.session,
});

const mapDispatchToProps = (dispatch) => ({
  changeSession: (session) => dispatch(updateSession(session)),
  changeComponent: (component) => dispatch(updateDashboard(component)),
});

const NavbarWrapper = connect(mapStateToProps, mapDispatchToProps)(Navbar);

export default NavbarWrapper;
