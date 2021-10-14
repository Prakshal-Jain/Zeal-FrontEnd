import React, { Component } from "react";
import { Breadcrumb, Badge, Tab, Card, Form, Row, Col, Button, InputGroup } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { Link, Redirect } from 'react-router-dom';
import Datetime from "react-datetime";
import moment from "moment-timezone";
import axios from "axios";
import { Routes } from "../../routes";

class ViewParticipantPastEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div>
                <div className="my-3">
                    <Card.Link as={Link} to={{
                        pathname: Routes.ParticipantEvents.path,
                    }}>
                        <h4><FontAwesomeIcon icon={faArrowCircleLeft} /></h4>
                    </Card.Link>
                </div>
                <Card border="light" className="bg-white shadow-sm my-3">
                    <Card.Body>
                        <Row>
                            <Col xs={6}>
                                <Row>
                                    <Col>
                                        <h3>{this.props.location.state.name}</h3>
                                    </Col>
                                </Row>
                                <Row className={"my-4"}>
                                    <Col>
                                        <b>Start:</b> {moment(this.props.location.state.start).format("MM/DD/YYYY")} <Badge bg="primary" className="badge-md mx-1">{moment(this.props.location.state.start).format("hh:mm a")}</Badge>
                                    </Col>
                                    <Col>
                                        <b>End:</b> {moment(this.props.location.state.end).format("MM/DD/YYYY")} <Badge bg="primary" className="badge-md mx-1">{moment(this.props.location.state.end).format("hh:mm a")}</Badge>
                                    </Col>
                                </Row>
                                <Row className={"my-4"}>
                                    <b>Website:</b> <Card.Link href={this.props.location.state.website} target="_blank">{this.props.location.state.website}</Card.Link>
                                </Row>
                            </Col>
                            <Col xs={6} className={"d-flex justify-content-center"}>
                                {(this.props.location.state.logo != null) ?
                                    <Card.Img src={this.props.location.state.logo} alt={this.props.location.state.name} className="user-avatar large-avatar mx-4" />
                                    :
                                    ""
                                }
                            </Col>
                        </Row>

                        <Row className={"my-4"}>
                            <h5>About {this.props.location.state.name}</h5>
                            <p>
                                {this.props.location.state.description}
                            </p>
                        </Row>

                        <Row className={"my-4"}>
                            <h5>Contact</h5>
                            <p>
                                <b>Email:</b> <Card.Link href={`mailto:${this.props.location.state.email}`} target="_blank">{this.props.location.state.email}</Card.Link>
                            </p>
                            <p>
                                <b>Phone:</b> {this.props.location.state.phone}
                            </p>
                        </Row>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default ViewParticipantPastEvent