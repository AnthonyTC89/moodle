import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import updateSession from '../redux/actions/updateSession';
import { HTTPresponses } from '../Info.json';
import './LoginForm.css';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errMessage: '',
      btnLoading: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      errMessage: '',
      btnLoading: true,
    });
    const { username, password } = this.state;
    const { changeSession } = this.props;
    const params = { username, password };
    axios.post('/api/users/login', params)
      .then((res) => {
        this.setState({
          btnLoading: false,
        });
        const user = {
          id: res.data.id,
          username: res.data.username,
          email: res.data.email,
          status: res.data.status,
        };
        changeSession({ user, loggedIn: true });
      })
      .catch((err) => {
        this.setState({
          errMessage: `${HTTPresponses[err.response.status]}`,
          btnLoading: false,
        });
      });
  }

  render() {
    const { username, password, btnLoading, errMessage } = this.state;
    return (
      <form className="login-form" onSubmit={!btnLoading ? this.handleSubmit : null}>
        <input
          className="form-control login-input"
          onChange={this.handleChange}
          type="text"
          placeholder="usuario"
          value={username}
          name="username"
          required
        />
        <input
          className="form-control login-input"
          onChange={this.handleChange}
          type="password"
          placeholder="contraseña"
          value={password}
          name="password"
          required
        />
        <button className="btn btn-primary btn-home" type="submit">
          {btnLoading ? 'Espere...' : 'Ingresar'}
        </button>
        <small className="login-message">{errMessage}</small>
      </form>
    );
  }
}

LoginForm.propTypes = {
  changeSession: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  session: state.session,
});

const mapDispatchToProps = (dispatch) => ({
  changeSession: (user) => dispatch(updateSession(user)),
});

const LoginFormWrapper = connect(mapStateToProps, mapDispatchToProps)(LoginForm);

export default LoginFormWrapper;
