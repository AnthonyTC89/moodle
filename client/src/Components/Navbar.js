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
        </div>
      </nav>
    );
  }
}

export default Navbar;
