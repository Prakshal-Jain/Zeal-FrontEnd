import React, { Component } from "react";
import { Breadcrumb, Nav, Tab, Row, Col, Card, Button, Form } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEdit, faTimes, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link, Redirect } from 'react-router-dom';
import axios from "axios";
import moment from "moment-timezone";
import { Routes } from "../../routes";

class ParticipantEvents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            join_events: null,
            ongoing_events: null,
            past_events: null,
            searchJoinEventKeyword: "",
            searchOngoingEventKeyword: "",
            searchPastEventKeyword: "",
        }
    }

    componentDidMount = async () => {
        await this.getJoinEvents();
        await this.getOngoingEvents();
        await this.getPastEvents();
    }

    getJoinEvents = async () => {
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }
        await axios.get(`events/participant_join/${(this.state.searchJoinEventKeyword != "") ? "?search=" + this.state.searchJoinEventKeyword : ""}`, {
            headers: header
        })
            .then(async (response) => {
                this.setState({
                    join_events: response.data
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getOngoingEvents = async () => {
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }
        await axios.get(`events/participant_ongoing/${(this.state.searchOngoingEventKeyword != "") ? "?search=" + this.state.searchOngoingEventKeyword : ""}`, {
            headers: header
        })
            .then(async (response) => {
                this.setState({
                    ongoing_events: response.data
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getPastEvents = async () => {
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }
        await axios.get(`events/participant_past/${(this.state.searchPastEventKeyword != "") ? "?search=" + this.state.searchPastEventKeyword : ""}`, {
            headers: header
        })
            .then(async (response) => {
                this.setState({
                    past_events: response.data
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render_join_events = () => {
        if (this.state.join_events == null || (this.state.join_events.results.length) == 0) {
            return "No currently ongoing or upcoming events found. Please check back later.";
        }
        return (
            this.state.join_events.results.map((event, index) => (
                <div>
                    <Row className="mb-2" key={`join_event-${index}`}>
                        <Col>
                            <Card as={Link} to={{
                                pathname: Routes.ViewParticipateEvent.path,
                                state: event
                            }}>
                                <Row className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                                    <Col className={"pointer_cursor"} xs={9}>
                                        <Card.Body>
                                            <h5 className={"mb-md-0"}>{event.name}</h5>
                                            <div className={"small"}>
                                                ({moment(event.start).format("MM/DD/YYYY HH:mm")}) <b>-</b> ({moment(event.end).format("MM/DD/YYYY HH:mm")})
                                            </div>
                                        </Card.Body>
                                    </Col>
                                    <Col xs={3} className={"d-flex justify-content-end"}>
                                        {(event.logo != null) ?
                                            <Card.Img src={event.logo} alt={event.name} className="user-avatar small-avatar mx-4" />
                                            :
                                            ""
                                        }
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </div>
            ))
        )
    }

    render_ongoing_events = () => {
        if (this.state.ongoing_events == null || (this.state.ongoing_events.results.length) == 0) {
            return <div>No currently ongoing or upcoming events found. Go to <b>Join Events</b> to participate in them.</div>;
        }
        return (
            this.state.ongoing_events.results.map((event, index) => (
                <div>
                    <Row className="mb-2" key={`join_event-${index}`}>
                        <Col>
                            <Card as={Link} to={{
                                pathname: Routes.ParticipantEventDashboard.path,
                                state: event
                            }}>
                                <Row className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                                    <Col className={"pointer_cursor"} xs={9}>
                                        <Card.Body>
                                            <h5 className={"mb-md-0"}>{event.name}</h5>
                                            <div className={"small"}>
                                                ({moment(event.start).format("MM/DD/YYYY HH:mm")}) <b>-</b> ({moment(event.end).format("MM/DD/YYYY HH:mm")})
                                            </div>
                                        </Card.Body>
                                    </Col>
                                    <Col xs={3} className={"d-flex justify-content-end"}>
                                        {(event.logo != null) ?
                                            <Card.Img src={event.logo} alt={event.name} className="user-avatar small-avatar mx-4" />
                                            :
                                            ""
                                        }
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </div>
            ))
        )
    }

    render_past_events = () => {
        if (this.state.past_events == null || (this.state.past_events.results.length) == 0) {
            return "No past events found.";
        }
        return (
            this.state.past_events.results.map((event, index) => (
                <div>
                    <Row className="mb-2" key={`join_event-${index}`}>
                        <Col>
                            <Card as={Link} to={{
                                pathname: Routes.ViewParticipantPastEvent.path,
                                state: event
                            }}>
                                <Row className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                                    <Col className={"pointer_cursor"} xs={9}>
                                        <Card.Body>
                                            <h5 className={"mb-md-0"}>{event.name}</h5>
                                            <div className={"small"}>
                                                ({moment(event.start).format("MM/DD/YYYY HH:mm")}) <b>-</b> ({moment(event.end).format("MM/DD/YYYY HH:mm")})
                                            </div>
                                        </Card.Body>
                                    </Col>
                                    <Col xs={3} className={"d-flex justify-content-end"}>
                                        {(event.logo != null) ?
                                            <Card.Img src={event.logo} alt={event.name} className="user-avatar small-avatar mx-4" />
                                            :
                                            ""
                                        }
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </div>
            ))
        )
    }

    render() {
        return (
            <div>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item><Card.Link as={Link} to={Routes.ZealHome.path}><FontAwesomeIcon icon={faHome} /></Card.Link></Breadcrumb.Item>
                            <Breadcrumb.Item>My Events</Breadcrumb.Item>
                            <Breadcrumb.Item active>Participate</Breadcrumb.Item>
                        </Breadcrumb>
                        <h4>Participate in Events</h4>
                        <p className="mb-0">Find your past and ongoing events, or join them.</p>
                    </div>
                </div>

                <Tab.Container defaultActiveKey="join">
                    <Nav fill variant="pills" className="flex-column flex-sm-row">
                        <Nav.Item>
                            <Nav.Link eventKey="past" className="mb-sm-3 mb-md-0">
                                Your past events
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="ongoing" className="mb-sm-3 mb-md-0">
                                Your ongoing events
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="join" className="mb-sm-3 mb-md-0">
                                Join Events
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Tab.Content>
                        <Tab.Pane eventKey="past" className="py-4">
                            <div>
                                <Row>
                                    <Col xs={6}>
                                        <Form.Control type="text" placeholder="Search events by name" value={this.state.searchPastEventKeyword} onChange={(e) => { this.setState({ searchPastEventKeyword: e.target.value }) }} />
                                    </Col>
                                    <Col xs={3}>
                                        <Button variant="outline-success" className="w-100" onClick={this.getPastEvents}>Search</Button>
                                    </Col>
                                    <Col xs={3}>
                                        <Button variant="outline-danger" className="w-100" onClick={() => { this.setState({ searchPastEventKeyword: "" }, () => this.getPastEvents()) }}>Clear</Button>
                                    </Col>
                                </Row>
                                <div className={"mt-4"}>
                                    {this.render_past_events()}
                                </div>
                            </div>
                        </Tab.Pane>

                        <Tab.Pane eventKey="ongoing" className="py-4">
                            <div>
                                <Row>
                                    <Col xs={6}>
                                        <Form.Control type="text" placeholder="Search events by name" value={this.state.searchOngoingEventKeyword} onChange={(e) => { this.setState({ searchOngoingEventKeyword: e.target.value }) }} />
                                    </Col>
                                    <Col xs={3}>
                                        <Button variant="outline-success" className="w-100" onClick={this.getOngoingEvents}>Search</Button>
                                    </Col>
                                    <Col xs={3}>
                                        <Button variant="outline-danger" className="w-100" onClick={() => { this.setState({ searchOngoingEventKeyword: "" }, () => this.getOngoingEvents()) }}>Clear</Button>
                                    </Col>
                                </Row>
                                <div className={"mt-4"}>
                                    {this.render_ongoing_events()}
                                </div>
                            </div>
                        </Tab.Pane>

                        <Tab.Pane eventKey="join" className="py-4">
                            <div>
                                <Row>
                                    <Col xs={6}>
                                        <Form.Control type="text" placeholder="Search events by name" value={this.state.searchJoinEventKeyword} onChange={(e) => { this.setState({ searchJoinEventKeyword: e.target.value }) }} />
                                    </Col>
                                    <Col xs={3}>
                                        <Button variant="outline-success" className="w-100" onClick={this.getJoinEvents}>Search</Button>
                                    </Col>
                                    <Col xs={3}>
                                        <Button variant="outline-danger" className="w-100" onClick={() => { this.setState({ searchJoinEventKeyword: "" }, () => this.getJoinEvents()) }}>Clear</Button>
                                    </Col>
                                </Row>
                                <div className={"mt-4"}>
                                    {this.render_join_events()}
                                </div>
                            </div>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </div>
        )
    }
}

export default ParticipantEvents