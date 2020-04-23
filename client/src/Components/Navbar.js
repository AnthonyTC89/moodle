import React from 'react';
import logoDefault from '../Images/logo.png';
import './Navbar.css';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: 'Moodle-Pedagógico',
    };
  }

  render() {
    const { text } = this.state;
    return (
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <div className="navbar-elements">
          <div className="d-flex">
            <img className="navbar-logo" src={logoDefault} alt="app-logo" />
            <div>
              <a className="navbar-brand" href="#home">{text}</a>
            </div>
          </div>
          <div>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>
          </div>
        </div>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            {/* <a className="nav-item nav-link" href="#aboutUs">Nosotros</a> */}
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
