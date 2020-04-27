import React from 'react';
import { footer } from '../Info.json';
import './Footer.css';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const year = new Date().getFullYear();
    const copyright = `${year} ${footer.text}`;
    return (
      <footer className="container-fluid bg-dark">
        <div className="row footer-copyright">
          <p className="text-white">{copyright}</p>
        </div>
      </footer>
    );
  }
}

export default Footer;
