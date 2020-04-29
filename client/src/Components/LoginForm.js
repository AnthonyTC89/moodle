/* eslint-disable camelcase */
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import updateSession from '../redux/actions/updateSession';
import { loginInfo, buttons } from '../Info.json';
import './LoginForm.css';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      message: null,
      error: null,
      loading: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.setState({
      message: null,
      error: null,
      loading: true,
    });
    try {
      const { username, password } = this.state;
      const { changeSession } = this.props;
      const data = { username, password_digest: password };
      const res = await axios.post('/api/users/login', data);
      const user = {
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
        status: res.data.status,
        typeDoc: res.data.type_doc,
        numDoc: res.data.num_doc,
        abrev: res.data.abrev,
        nickname: res.data.nickname,
        lastname1: res.data.lastname1,
        lastname2: res.data.lastname2,
        mobile: res.data.mobile,
        address: res.data.address,
        information: res.data.information,
        degree: res.data.degree,
        biography: res.data.biography,
      };
      this.setState({
        loading: false,
      });
      changeSession(user);
    } catch (err) {
      this.setState({
        error: 'error',
        loading: false,
      });
    }
  }

  render() {
    const { username, password, loading, message, error } = this.state;
    const { title, placeholders } = loginInfo;
    const { wait, login } = buttons;
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>{title}</h2>
        {message === null ? null : <p className="text-success">{message}</p>}
        {error === null ? null : <p className="text-danger">{error}</p>}
        <input
          className="form-control input-text"
          onChange={this.handleChange}
          type="text"
          placeholder={placeholders.username}
          value={username}
          name="username"
          required
        />
        <input
          className="form-control input-text"
          onChange={this.handleChange}
          type="password"
          placeholder={placeholders.password}
          value={password}
          name="password"
          required
        />
        <button className="btn btn-primary btn-home" type="submit" disabled={loading}>
          {loading ? wait : login }
        </button>
      </form>
    );
  }
}

LoginForm.propTypes = {
  changeSession: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  changeSession: (user) => dispatch(updateSession(user)),
});

const LoginFormWrapper = connect(null, mapDispatchToProps)(LoginForm);

export default LoginFormWrapper;
