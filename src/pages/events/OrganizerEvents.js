import React, { Component } from "react";
import { Breadcrumb, Nav, Tab, Card, Form, Row, Col, Button, InputGroup, Pagination } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCalendarAlt, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { Link, Redirect } from 'react-router-dom';
import Datetime from "react-datetime";
import moment from "moment-timezone";
import axios from "axios";
import { Routes } from "../../routes";

class OrganizerEvents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event: {
                'name': "",
                'description': "",
                'website': "",
                'start': null,
                'end': null,
                'logo': null,
                'email': "",
                'phone': "",
                'is_private': false,
                'get_participation_data': false
            },
            ongoing_upcoming_events: null,
            past_events: null,
            searchOngoingUpcomingKeyword: "",
            searchPastKeyword: "",
            page_ongoing_upcoming: 1,
            page_past: 1,
        }
    }

    componentDidMount = async () => {
        await this.getEvents('organizer_ongoing_upcoming');
        await this.getEvents('organizer_past');
    }

    clearFields = () => {
        this.setState({
            event: {
                'name': "",
                'description': "",
                'website': "",
                'start': null,
                'end': null,
                'logo': null,
                'email': "",
                'phone': "",
                'is_private': false,
                'get_participation_data': false
            }
        })
    }

    setEventFields = (key, value) => {
        var temp = this.state.event;
        temp[key] = value;
        this.setState({ event: temp });
    }

    getEvents = async (sub_url) => {
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }

        if (sub_url == 'organizer_ongoing_upcoming') {
            await axios.get(`events/organizer_ongoing_upcoming/?search=${this.state.searchOngoingUpcomingKeyword}&page=${this.state.page_ongoing_upcoming}`, {
                headers: header
            })
                .then(async (response) => {
                    this.setState({
                        ongoing_upcoming_events: response.data
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        else if (sub_url == 'organizer_past') {
            await axios.get(`events/organizer_past/?search=${this.state.searchPastKeyword}&page=${this.state.page_past}`, {
                headers: header
            })
                .then(async (response) => {
                    console.log(response.data)
                    this.setState({
                        past_events: response.data
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    renderOngoingUpcomingPagination = () => {
        if (this.state.ongoing_upcoming_events == null || (this.state.ongoing_upcoming_events.results.length == 0)) {
            return ""
        }
        return (
            <div className="d-flex justify-content-center align-items-center mt-4">
                <Pagination size={10} className="">
                    <Pagination.Prev disabled={this.state.ongoing_upcoming_events.previous == null} onClick={() => { this.setState({ page_ongoing_upcoming: this.state.page_ongoing_upcoming - 1 }, async () => { await this.getEvents('organizer_ongoing_upcoming') }) }}>
                        <FontAwesomeIcon icon={faAngleDoubleLeft} />
                    </Pagination.Prev>
                    <Pagination.Item active={true} key={1}>
                        {this.state.page_ongoing_upcoming}
                    </Pagination.Item>
                    <Pagination.Next disabled={this.state.ongoing_upcoming_events.next == null} onClick={() => { this.setState({ page_ongoing_upcoming: this.state.page_ongoing_upcoming + 1 }, async () => { await this.getEvents('organizer_ongoing_upcoming') }) }}>
                        <FontAwesomeIcon icon={faAngleDoubleRight} />
                    </Pagination.Next>
                </Pagination>
            </div>
        )
    }

    renderPastPagination = () => {
        if (this.state.past_events == null || (this.state.past_events.results.length == 0)) {
            return ""
        }
        return (
            <div className="d-flex justify-content-center align-items-center mt-4">
                <Pagination size={10} className="">
                    <Pagination.Prev disabled={this.state.past_events.previous == null} onClick={() => { this.setState({ page_past: this.state.page_past - 1 }, async () => { await this.getEvents('organizer_past') }) }}>
                        <FontAwesomeIcon icon={faAngleDoubleLeft} />
                    </Pagination.Prev>
                    <Pagination.Item active={true} key={1}>
                        {this.state.page_past}
                    </Pagination.Item>
                    <Pagination.Next disabled={this.state.past_events.next == null} onClick={() => { this.setState({ page_past: this.state.page_past + 1 }, async () => { await this.getEvents('organizer_past') }) }}>
                        <FontAwesomeIcon icon={faAngleDoubleRight} />
                    </Pagination.Next>
                </Pagination>
            </div>
        )
    }

    renderOngoingUpcomingEvents = () => {
        if (this.state.ongoing_upcoming_events == null || (this.state.ongoing_upcoming_events.results.length) == 0) {
            return <div>No currently ongoing or upcoming events. Create one now! Go to <b>Join Events</b></div>;
        }
        return (
            this.state.ongoing_upcoming_events.results.map((event, index) => (
                <div>
                    <Row className="mb-2" key={`join_event-${index}`}>
                        <Col>
                            <Card as={Link} to={{
                                pathname: Routes.OrganizerEventDashboard.path,
                                state: event
                            }}>
                                <Row className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                                    <Col className={"pointer_cursor"} xs={9}>
                                        <Card.Body>
                                            <h5 className={"mb-md-0"}>{event.name}</h5>
                                            <Row className={"small"}>
                                                <Col>
                                                    <b>Start: </b> {moment(event.start).format("MM/DD/YYYY (hh:mm a)")}
                                                </Col>
                                                <Col>
                                                    <b>End: </b> {moment(event.end).format("MM/DD/YYYY (hh:mm a)")}
                                                </Col>
                                            </Row>
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

    renderPastEvents = () => {
        if (this.state.past_events == null || (this.state.past_events.results.length) == 0) {
            return <div>No past events found.</div>;
        }
        return (
            this.state.past_events.results.map((event, index) => (
                <div>
                    <Row className="mb-2" key={`join_event-${index}`}>
                        <Col>
                            <Card as={Link} to={{
                                pathname: Routes.ViewOrganizerPastEvent.path,
                                state: event
                            }}>
                                <Row className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                                    <Col className={"pointer_cursor"} xs={9}>
                                        <Card.Body>
                                            <h5 className={"mb-md-0"}>{event.name}</h5>
                                            <Row className={"small"}>
                                                <Col>
                                                    <b>Start: </b> {moment(event.start).format("MM/DD/YYYY (hh:mm a)")}
                                                </Col>
                                                <Col>
                                                    <b>End: </b> {moment(event.end).format("MM/DD/YYYY (hh:mm a)")}
                                                </Col>
                                            </Row>
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

    postOrganizerEvents = async () => {
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`,
        }
        let form_data = new FormData();
        Object.entries(this.state.event).map(([key, value]) => { form_data.append(key, value) })
        if (this.state.event.logo == null) {
            form_data.delete('logo')
        }
        else {
            form_data.set('logo', this.state.event.logo, this.state.event.logo.name)
        }
        await axios.post(`events/organizer_ongoing_upcoming/`, form_data, {
            headers: header
        })
            .then(async (response) => {
                await this.getEvents('organizer_ongoing_upcoming');
                await this.getEvents('organizer_past');
                this.clearFields()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    renderEventForm = () => {
        return (
            <div>
                <Card border="light" className="bg-white shadow-sm mb-4">
                    <Card.Body>
                        <h5 className="mb-4">General event information</h5>
                        <Form>
                            <Row>
                                <Col md={12} className="mb-3">
                                    <Form.Group id="event_name">
                                        <Form.Label>Event Name</Form.Label>
                                        <Form.Control required type="text" placeholder="Enter your first name" value={this.state.event.name} onChange={(e) => { this.setEventFields('name', e.target.value) }} />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12} className="mb-3">
                                    <Form.Label>Event Description</Form.Label>
                                    <Form.Control as="textarea" rows="4" placeholder={"Enter a brief description of the event here"} value={this.state.event.description} onChange={(e) => { this.setEventFields('description', e.target.value) }} />
                                </Col>
                            </Row>

                            <Row className="align-items-center">
                                <Col md={12} className="mb-3">
                                    <Form.Group id="website">
                                        <Form.Label>Event Website</Form.Label>
                                        <Form.Control required type="url" placeholder="https://example.com" value={this.state.event.website} onChange={(e) => { this.setEventFields('website', e.target.value) }} />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="align-items-center">
                                <Col md={6} className="mb-3">
                                    <Form.Group id="Date">
                                        <Form.Label>Event Start Date and Time</Form.Label>
                                        <Datetime
                                            timeFormat={true}
                                            closeOnSelect={false}
                                            onChange={(e) => { this.setEventFields('start', e.format()) }}
                                            renderInput={(props, openCalendar) => (
                                                <InputGroup>
                                                    <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        value={this.state.event.start ? moment(this.state.event.start).format("MM/DD/YYYY (hh:mm a)") : ""}
                                                        placeholder="mm/dd/yyyy (hh:mm)"
                                                        onFocus={openCalendar}
                                                        onChange={() => { }} />
                                                </InputGroup>
                                            )} />
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group id="Date">
                                        <Form.Label>Event End Date and Time</Form.Label>
                                        <Datetime
                                            timeFormat={true}
                                            closeOnSelect={false}
                                            onChange={(e) => { this.setEventFields('end', e.format()) }}
                                            renderInput={(props, openCalendar) => (
                                                <InputGroup>
                                                    <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        value={this.state.event.end ? moment(this.state.event.end).format("MM/DD/YYYY (hh:mm a)") : ""}
                                                        placeholder="mm/dd/yyyy (hh:mm)"
                                                        onFocus={openCalendar}
                                                        onChange={() => { }} />
                                                </InputGroup>
                                            )} />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12} className="mb-3">
                                    <Form.Group id="logo">
                                        <Form.Label>Upload Event Logo</Form.Label>
                                        <Form.Control type="file" accept="image/*" onChange={(e) => { this.setEventFields('logo', e.target.files[0]) }} />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            <h5 className="mb-4">Contact information</h5>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <Form.Group id="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control required type="email" placeholder="name@company.com" value={this.state.event.email} onChange={(e) => { this.setEventFields('email', e.target.value) }} />
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group id="phone">
                                        <Form.Label>Phone</Form.Label>
                                        <Form.Control required type="text" placeholder="+1 (123) 456-7890" value={this.state.event.phone} onChange={(e) => { this.setEventFields('phone', e.target.value) }} />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Button variant="primary" onClick={this.postOrganizerEvents}>Create Event</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
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
                            <Breadcrumb.Item active>Organize</Breadcrumb.Item>
                        </Breadcrumb>
                        <h4>Organize Events</h4>
                        <p className="mb-0">View your past events. Manage or create your ongoing, and upcoming events.</p>
                    </div>
                </div>

                <Tab.Container defaultActiveKey="join">
                    <Nav fill variant="pills" className="flex-column flex-sm-row">
                        <Nav.Item>
                            <Nav.Link eventKey="past" className="mb-sm-3 mb-md-0">
                                Past Events
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="ongoing" className="mb-sm-3 mb-md-0">
                                Ongoing and Upcoming Events
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="join" className="mb-sm-3 mb-md-0">
                                Create Event
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>

                    <Tab.Content>
                        <Tab.Pane eventKey="past" className="py-4">
                            <div className={"mt-2"}>
                                {(this.state.past_events != null && (this.state.past_events.results.length) > 0) ?
                                    <Row className={"mb-4"}>
                                        <Col xs={6}>
                                            <Form.Control type="text" placeholder="Search events by name" value={this.state.searchPastKeyword} onChange={(e) => { this.setState({ searchPastKeyword: e.target.value }) }} />
                                        </Col>
                                        <Col xs={3}>
                                            <Button variant="outline-success" className="w-100" onClick={async () => await this.getEvents('organizer_past')}>Search</Button>
                                        </Col>
                                        <Col xs={3}>
                                            <Button variant="outline-danger" className="w-100" onClick={() => { this.setState({ searchPastKeyword: "" }, async () => await this.getEvents('organizer_past')) }}>Clear</Button>
                                        </Col>
                                    </Row>
                                    :
                                    ""
                                }
                                {this.renderPastEvents()}
                                {this.renderPastPagination()}
                            </div>
                        </Tab.Pane>

                        <Tab.Pane eventKey="ongoing" className="py-4">
                            <div className={"mt-2"}>
                                {(this.state.ongoing_upcoming_events != null && (this.state.ongoing_upcoming_events.results.length > 0)) ?
                                    <Row className={"mb-4"}>
                                        <Col xs={6}>
                                            <Form.Control type="text" placeholder="Search events by name" value={this.state.searchOngoingUpcomingKeyword} onChange={(e) => { this.setState({ searchOngoingUpcomingKeyword: e.target.value }) }} />
                                        </Col>
                                        <Col xs={3}>
                                            <Button variant="outline-success" className="w-100" onClick={async () => await this.getEvents('organizer_ongoing_upcoming')}>Search</Button>
                                        </Col>
                                        <Col xs={3}>
                                            <Button variant="outline-danger" className="w-100" onClick={() => { this.setState({ searchOngoingUpcomingKeyword: "" }, async () => await this.getEvents('organizer_ongoing_upcoming')) }}>Clear</Button>
                                        </Col>
                                    </Row>
                                    :
                                    ""
                                }
                                {this.renderOngoingUpcomingEvents()}
                                {this.renderOngoingUpcomingPagination()}
                            </div>
                        </Tab.Pane>

                        <Tab.Pane eventKey="join" className="py-4">
                            {this.renderEventForm()}
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </div>
        )
    }
}

export default OrganizerEvents