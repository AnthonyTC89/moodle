import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { uploadFile } from 'react-s3';
import { buttons, documentsInfo } from '../Info.json';
import './Documents.css';

class Documents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      message: null,
      error: null,
      loading: false,
      documents: [],
    };
    this.configS3 = {
      bucketName: process.env.REACT_APP_S3_BUCKET,
      region: process.env.REACT_APP_S3_BUCKET_REGION,
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    };
    this.handleChangeFile = this.handleChangeFile.bind(this);
    this.handleUploadS3 = this.handleUploadS3.bind(this);
  }

  componentDidMount() {
    this.getDocuments();
  }

  async getDocuments() {
    const { session, subject } = this.props;
    this.setState({
      loading: true,
      message: null,
      error: null,
    });
    try {
      const res = await axios.get('/api/documents_full',
        { params: { subject_id: subject.id, session_status: session.user.status } });
      this.setState({
        documents: res.data,
        loading: false,
      });
    } catch (error) {
      this.setState({
        message: 'Error en el Servidor',
      });
    }
  }

  handleChangeFile(e) {
    this.setState({
      file: e.currentTarget.files[0],
      message: null,
      error: null,
    });
  }

  async validateUploadFile(file) {
    // if the file is null
    if (!file) {
      this.setState({
        message: null,
        error: 'Ingrese un archivo',
      });
      return false;
    }
    // // if the name of the file exists
    // if (recipes.some((r) => r.key === file.name)) {
    //   this.setState({
    //     message: null,
    //     error: 'El archivo ya existe',
    //   });
    //   return false;
    // }
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  async handleUploadS3(e) {
    e.preventDefault();
    const { file } = this.state;
    const { subject } = this.props;
    const valid = await this.validateUploadFile(file);
    if (!valid) { return; }
    this.setState({
      loading: true,
      message: null,
      error: null,
    });
    try {
      const data = await uploadFile(file, this.configS3);
      const { bucket, key, location } = data;
      await axios.post('/api/documents', { bucket, key, location, subject_id: subject.id });
      await this.getDocuments();
      this.setState({
        message: 'Procedimiento exitoso',
        loading: false,
      });
    } catch (err) {
      this.setState({
        error: 'error',
        loading: false,
      });
    }
  }

  async handleActive(item) {
    this.setState({
      loading: true,
    });
    try {
      const data = { status: !item.status };
      await axios.put(`api/subjects/${item.id}`, data);
      this.setState({
        message: 'Actualizado',
        loading: false,
      });
      await this.getDocuments();
    } catch (err) {
      this.setState({
        error: 'error',
        loading: false,
      });
    }
  }

  render() {
    const { documents, loading, message, error } = this.state;
    const { session } = this.props;
    const { wait, upload, inactive, active, download, remove } = buttons;
    const { title } = documentsInfo;
    return (
      <section className="container">
        <h2>{title}</h2>
        {session.user.status <= 3
          ? (
            <form className="row form-documents" onSubmit={this.handleUploadS3}>
              {message === null ? null : <p className="text-success">{message}</p>}
              {error === null ? null : <p className="text-danger">{error}</p>}
              <div className="input-file-group">
                <input
                  className="input-file"
                  type="file"
                  multiple={false}
                  onChange={this.handleChangeFile}
                  disabled={loading}
                />
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? wait : upload}
                </button>
              </div>
            </form>
          ) : null}
        <div className="row">
          {session.user.status <= 2
            ? <div className="col col-text"><h6>id</h6></div>
            : null}
          <div className="col col-text"><h6>nombre</h6></div>
          {session.user.status <= 3
            ? <div className="col col-text"><h6>estado</h6></div>
            : null}
          <div className="col col-text"><h6>ver</h6></div>
          {session.user.status <= 2
            ? <div className="col col-text"><h6>eliminar</h6></div>
            : null}
        </div>
        {documents.map((item) => (
          <div key={uuidv4()} className="row row-user">
            {session.user.status <= 2
              ? (
                <div className="col col-text">
                  <p>{item.id}</p>
                </div>
              ) : null}
            <div className="col col-text">
              <p className={item.status ? '' : 'text-line-through'}>{item.key}</p>
            </div>
            {session.user.status <= 3
              ? (
                <div className="col btn-actions">
                  <button
                    className="btn btn-warning"
                    type="button"
                    onClick={() => this.handleActive(item)}
                    disabled={loading}
                  >
                    {item.status ? inactive : active}
                  </button>
                </div>
              ) : null}
            <div className="col btn-actions">
              <a
                className="btn btn-info"
                href={item.location}
                target="_blank"
                rel="noopener noreferrer"
              >
                {download}
              </a>
            </div>
            {session.user.status <= 2
              ? (
                <div className="col btn-actions">
                  <button
                    className="btn btn-danger"
                    type="button"
                    disabled={loading}
                  >
                    {loading ? wait : remove }
                  </button>
                </div>
              ) : null}
          </div>
        ))}
      </section>
    );
  }
}

Documents.propTypes = {
  session: PropTypes.object.isRequired,
  subject: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  session: state.session,
});

const DocumentsWrapper = connect(mapStateToProps, null)(Documents);

export default DocumentsWrapper;
