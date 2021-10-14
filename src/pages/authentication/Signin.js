import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { Col, Row, Form, Card, Button, FormCheck, Container, InputGroup, Alert } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';
import axios from "axios";

import { Routes } from "../../routes";
import BgImage from "../../assets/img/illustrations/signin.svg";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      credentials: {
        "username": null,
        "password": null,
      },
      errors: [],
    }
  }

  componentDidMount = () => {
    localStorage.removeItem("user");
  }

  setCredentials = (key, value) => {
    var credential = this.state.credentials
    credential[key] = value
    this.setState({ credentials: credential })
  }

  validateCredentials = async () => {
    var errors = []
    // proceed to save in database and redirect
    await axios.post('/auth/login', this.state.credentials)
      .then((response) => {
        if (errors.length == 0) {
          this.setState({ errors: [] });
          localStorage.setItem('user', JSON.stringify(response.data))
          this.props.componentProps.updateCredentials(response.data)
          this.props.componentProps.redirect_history.push(Routes.Profile.path)
        }
      })
      .catch((error) => {
        const response_data = error.response.data
        if (typeof response_data == "string") {
          this.setState({ errors: [<div><p>Please contact us and report this issue at: <Card.Link href={"mailto:" + Routes.email.path}>{Routes.email.path}</Card.Link></p><p>{response_data}</p></div>] });
        }
        else {
          Object.entries(response_data).map(([k, v], i) => errors.push(<div>{k}: {v}</div>))
          this.setState({ errors: errors });
        }
      })
    return false
  }

  render() {
    return (
      <main>
        <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
          <Container>
            <p className="text-center">
              <Card.Link as={Link} to={Routes.ZealHome.path} className="text-gray-700">
                <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Back to homepage
              </Card.Link>
            </p>
            <Row className="justify-content-center form-bg-image" style={{ backgroundImage: `url(${BgImage})` }}>
              <Col xs={12} className="d-flex align-items-center justify-content-center">
                <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                  <div className="text-center text-md-center mb-4 mt-md-0">
                    <h3 className="mb-0">Sign in</h3>
                  </div>
                  <Form className="mt-4">
                    <Form.Group id="email" className="mb-4">
                      <Form.Label>Username</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faEnvelope} />
                        </InputGroup.Text>
                        <Form.Control autoFocus required type="email" placeholder="Your Username" onChange={(event) => { this.setCredentials("username", event.target.value) }} />
                      </InputGroup>
                    </Form.Group>
                    <Form.Group>
                      <Form.Group id="password" className="mb-4">
                        <Form.Label>Your Password</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FontAwesomeIcon icon={faUnlockAlt} />
                          </InputGroup.Text>
                          <Form.Control required type="password" placeholder="Password" onChange={(event) => { this.setCredentials("password", event.target.value) }} />
                        </InputGroup>
                      </Form.Group>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <Form.Check type="checkbox">
                          <FormCheck.Input id="defaultCheck5" className="me-2" />
                          <FormCheck.Label htmlFor="defaultCheck5" className="mb-0">Remember me</FormCheck.Label>
                        </Form.Check>
                        <Card.Link className="small text-end" as={Link} to={Routes.ForgotPassword.path}>Lost password?</Card.Link>
                      </div>
                    </Form.Group>

                    {
                      this.state.errors.length > 0 ?
                        <Alert variant="warning">
                          <ul>
                            {this.state.errors.map((x, index) => <li key={`error_${index}`}>{x}</li>)}
                          </ul>
                        </Alert>
                        :
                        ""
                    }

                    <Button variant="primary" className="w-100" onClick={this.validateCredentials}>
                      Sign in
                    </Button>
                  </Form>

                  <div className="mt-3 mb-4 text-center">
                    <span className="fw-normal">or login with</span>
                  </div>
                  <div className="d-flex justify-content-center my-4">
                    <Button variant="outline-light" className="btn-icon-only btn-pill text-facebook me-2">
                      <FontAwesomeIcon icon={faFacebookF} />
                    </Button>
                    <Button variant="outline-light" className="btn-icon-only btn-pill text-twitter me-2">
                      <FontAwesomeIcon icon={faTwitter} />
                    </Button>
                    <Button variant="outline-light" className="btn-icon-only btn-pil text-dark">
                      <FontAwesomeIcon icon={faGithub} />
                    </Button>
                  </div>
                  <div className="d-flex justify-content-center align-items-center mt-4">
                    <span className="fw-normal">
                      Not registered?
                      <Card.Link as={Link} to={Routes.Signup.path} className="fw-bold">
                        {` Create account `}
                      </Card.Link>
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    );
  }
};

export default SignUp