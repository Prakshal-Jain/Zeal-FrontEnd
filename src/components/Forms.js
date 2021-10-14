import React, { Component } from "react";
import moment from "moment-timezone";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { Col, Row, Card, Form, Button, InputGroup, Badge, Alert } from '@themesberg/react-bootstrap';
import axios from "axios";
import { Routes } from "../routes";

class GeneralInfoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempSkill: "",
    }
  }

  renderSkills = () => {
    return (
      this.props.userData.skills.map((skill, index) => (
        <Badge bg="success" text="light" className="badge-lg m-1" key={`skill_${index}`}>
          <div className={"d-inline me-2"}>{skill}</div>
          <FontAwesomeIcon icon={faTimesCircle} onClick={() => this.props.removeSkill(index)} className={"pointer_cursor"} />
        </Badge>
      ))
    )
  }

  submitProfile = async () => {
    await this.props.postUserData();
    await this.props.getUserData();
    await this.props.postCredentials();
  }

  render() {
    return (
      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-4">General information</h5>
          <Form>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group id="firstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control required type="text" placeholder="Enter your first name" defaultValue={this.props.credentials.user.first_name} onChange={(event) => this.props.changeCredentials("first_name", event.target.value)} />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group id="lastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control required type="text" placeholder="Also your last name" defaultValue={this.props.credentials.user.last_name} onChange={(event) => this.props.changeCredentials("last_name", event.target.value)} />
                </Form.Group>
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col md={6} className="mb-3">
                <Form.Group id="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control required type="username" placeholder="Your awesome username" defaultValue={this.props.credentials.user.username} onChange={(event) => this.props.changeCredentials("username", event.target.value)} />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control required type="email" placeholder="name@company.com" defaultValue={this.props.credentials.user.email} disabled={true} />
                </Form.Group>
              </Col>
            </Row>

            {this.props.userData != null ?
              <div>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group id="gender">
                      <Form.Label>Gender</Form.Label>
                      <Form.Select value={this.props.userData.gender} onChange={(event) => { this.props.updateUserData("gender", event.target.value) }}>
                        <option value="select">Please select your gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group id="phone">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control value={this.props.userData.phone} type="text" placeholder="+1 (345) 678-910" onChange={(event) => { this.props.updateUserData("phone", event.target.value) }} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Label>Your current headline/designation</Form.Label>
                    <Form.Control value={this.props.userData.designation} type="text" placeholder="Eg: Software developer" onChange={(event) => { this.props.updateUserData("designation", event.target.value) }} />
                  </Col>
                </Row>

                <h5 className="my-4">Skills</h5>
                <Row className={"mb-4"}>
                  <Col>
                    <Button variant="outline-info" className={"w-100"} onClick={() => {}}>Import from <FontAwesomeIcon icon={faLinkedin} /></Button>
                  </Col>
                  <Col>
                    <Button variant="outline-gray" className={"w-100"} onClick={() => {}}>Import from <FontAwesomeIcon icon={faGithub} /></Button>
                  </Col>
                </Row>
                {(this.props.userData.skills != null) ?
                  <Row>
                    <Col sm={12} className={"mb-4"}>
                      {this.renderSkills()}
                    </Col>
                  </Row>
                  :
                  ""
                }
                <Row>
                  <Col sm={9}>
                    <Form.Group id="skills">
                      <Form.Control type="text" placeholder="Enter a skill here" value={this.state.tempSkill} onChange={(event) => { this.setState({ tempSkill: event.target.value }) }} />
                    </Form.Group>
                  </Col>
                  <Col sm={3}>
                    <Button variant="primary" className="w-100" onClick={() => { this.props.addSkill(this.state.tempSkill); this.setState({ tempSkill: "" }) }}>Add</Button>
                  </Col>
                </Row>
              </div>

              :

              <Alert variant="warning">
                Failed to load Skills. Please contact us and report this issue at: <Card.Link href={"mailto:" + Routes.email.path}>{Routes.email.path}</Card.Link>
              </Alert>
            }

            <div className="mt-3">
              <Button variant="primary" onClick={this.submitProfile}>Save All</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  }
};

export default GeneralInfoForm