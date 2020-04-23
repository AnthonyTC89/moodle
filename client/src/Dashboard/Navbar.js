import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import logoDefault from '../Images/logo.png';
import updateDashboard from '../redux/actions/updateDashboard';
import updateSession from '../redux/actions/updateSession';
import 'bootstrap/dist/js/bootstrap';
import './Navbar.css';

// eslint-disable-next-line react/prefer-stateless-function
class Navbar extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  render() {
    const { changeComponent, changeSession } = this.props;
    const adminButtons = [
      { name: 'Profile', text: 'Users' },
      { name: 'Profile', text: 'People' },
      { name: 'Profile', text: 'Professors' },
      { name: 'Profile', text: 'Students' },
    ];
    const buttons = [
      { name: 'Profile', text: 'Perfil' },
    ];
    const infoButtons = [
      { name: 'Profile', text: 'Cursos' },
    ];
    return (
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <div className="navbar-elements">
          <img className="navbar-logo" src={logoDefault} alt="hassana-logo" />
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
        </div>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav btn-container">
            <div className="btn-info-group">
              <div className="btn-group btn-group-navbar">
                <button type="button" className="btn btn-info dropdown-toggle btn-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Admin
                </button>
                <div className="dropdown-menu bg-dark btn-dropdown-menu">
                  {adminButtons.map((btn) => (
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
              {buttons.map((btn) => (
                <button
                  key={uuidv4()}
                  className="btn btn-info btn-navbar"
                  type="button"
                  onClick={() => changeComponent(btn.name)}
                >
                  {btn.text}
                </button>
              ))}
              <div className="btn-group btn-group-navbar">
                <button type="button" className="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Académico
                </button>
                <div className="dropdown-menu bg-dark btn-dropdown-menu">
                  {infoButtons.map((btn) => (
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
              Cerrar
            </button>
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  changeSession: PropTypes.func.isRequired,
  changeComponent: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  changeSession: (session) => dispatch(updateSession(session)),
  changeComponent: (component) => dispatch(updateDashboard(component)),
});

const NavbarWrapper = connect(null, mapDispatchToProps)(Navbar);

export default NavbarWrapper;
