import React, { Component } from "react";
import { Breadcrumb, Nav, Tab, Card, Form, Row, Col, Button, InputGroup, Table, Alert } from '@themesberg/react-bootstrap';
import AccordionComponent from "../../components/AccordionComponent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faHome, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { Link, Redirect } from 'react-router-dom';
import Datetime from "react-datetime";
import moment from "moment-timezone";
import axios from "axios";
import { Routes } from "../../routes";

class OrganizerEventDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event: null,
            edited_logo: false,
            participants: null,
            organization_teams: null,
            searchTeams: "",
        }
    }

    componentDidMount = () => {
        this.setState({ event: this.props.location.state }, async () => {
            await this.get_participants();
            await this.get_organizer_teams()
        });
    }

    setEventFields = (key, value) => {
        var temp = this.state.event;
        temp[key] = value;
        this.setState({ event: temp });
    }

    saveChanges = async () => {
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }
        let form_data = new FormData();
        Object.entries(this.state.event).map(([key, value]) => { form_data.append(key, value) })
        if (this.state.event.logo == null || !this.state.edited_logo) {
            form_data.set('logo', null)
        }
        else {
            form_data.set('logo', this.state.event.logo, this.state.event.logo.name)
        }
        await axios.put(`/events/organizer_ongoing_upcoming/`, form_data, {
            headers: header
        })
            .then((response) => {
                return
            })
            .catch((error) => {
                console.log(error)
            })
    }

    DeleteEvent = async () => {
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`,
        }
        await axios.delete(`/events/organizer_ongoing_upcoming/`,
            {
                data: this.state.event,
                headers: header
            })
            .then(async (response) => {
                this.props.componentProps.redirect_history.push(Routes.OrganizerEvents.path)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    get_participants = async () => {
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }
        await axios.get(`events/organizer_participant_list/?event_id=${this.state.event.id}`, {
            headers: header
        })
            .then(async (response) => {
                this.setState({
                    participants: response.data[0].participants
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    get_organizer_teams = async () => {
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }
        await axios.get(`events/organizer_list_teams/?event_id=${this.state.event.id}&search=${this.state.searchTeams}`, {
            headers: header
        })
            .then((response) => {
                console.log(response.data)
                this.setState({
                    organization_teams: response.data
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    truncateString(str, num) {
        // If the length of str is less than or equal to num
        // just return str--don't truncate it.
        if (str.length <= num) {
            return str
        }
        // Return str truncated with '...' concatenated to the end of str.
        return str.slice(0, num) + '...'
    }

    render_organizer_teams = () => {
        var teams = [];
        this.state.organization_teams.map((team, index) => {
            teams.push(
                {
                    id: index,
                    eventKey: `team_${index}`,
                    title: this.truncateString(team.idea, 70),
                    description: (
                        <div>
                            <Row>
                                <Col>
                                    <h5>Idea</h5>
                                    <p>{team.idea}</p>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col border="light">
                                    <h5>Team Information:</h5>
                                    <b>Created by:</b>  {team.owner.first_name} {team.owner.last_name} (Email: <a href={`mailto:${team.owner.email}`}>{team.owner.email}</a>)
                                    {(team.teammates.length > 0) ?
                                        <Card className={"p-2 bg-white shadow-sm"}>
                                            <Table responsive className="align-items-center table-flush">
                                                <thead>
                                                    <tr>
                                                        <th>Username</th>
                                                        <th>First Name</th>
                                                        <th>Last Name</th>
                                                        <th>Email</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {
                                                        team.teammates.map((participant, index) => (
                                                            <tr key={`member_${index}`}>
                                                                <td>
                                                                    {participant.username}
                                                                </td>
                                                                <td>
                                                                    {participant.first_name}
                                                                </td>
                                                                <td>
                                                                    {participant.last_name}
                                                                </td>
                                                                <td>
                                                                    <a href={`mailto:${participant.email}`}>{participant.email}</a>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </Table>
                                        </Card>
                                        :
                                        <Alert variant="warning" className={"my-2"}>
                                            The team creator has no teammates yet.
                                        </Alert>
                                    }
                                </Col>
                            </Row>
                        </div>
                    )
                }
            )
        })
        return teams;
    }

    render_editForm = () => {
        if (this.state.event == null) {
            return ""
        }
        return (
            <div>
                <Card border="light" className="bg-white shadow-sm">
                    <Row className="mt-3">
                        <Col className={"d-flex justify-content-center"}>
                            <h4>{this.state.event.name}</h4>
                        </Col>
                    </Row>
                    <Card.Body>
                        <h5 className="mb-4">General event information</h5>
                        <Form>
                            <Row>
                                <Col md={12} className="mb-3">
                                    <Form.Group id="event_name">
                                        <Form.Label>Event Name</Form.Label>
                                        <Form.Control required type="text" placeholder="Enter your first name" value={this.state.event.name} disabled={true} />
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
                                <Col md={9} className="mb-3">
                                    <Form.Group id="logo">
                                        <Form.Label>Upload Event Logo</Form.Label>
                                        <Form.Control type="file" accept="image/*" onChange={(e) => { this.setEventFields('logo', e.target.files[0]); this.setState({ edited_logo: true }); }} />
                                    </Form.Group>
                                </Col>
                                <Col md={3} className={"d-flex justify-content-center"}>
                                    <Form.Group id="current_logo">
                                        <Form.Label>Current Logo</Form.Label>
                                        {
                                            this.state.edited_logo ?
                                                <Card.Img src={URL.createObjectURL(this.state.event.logo)} alt={this.state.event.name} className="user-avatar small-avatar mx-4" />
                                                :
                                                <Card.Img src={this.state.event.logo} alt={this.state.event.name} className="user-avatar small-avatar mx-4" />
                                        }
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
                            <Row>
                                <Col>
                                    <Button variant="primary" onClick={this.saveChanges}>Save Changes</Button>
                                </Col>
                                <Col>
                                    <Button variant="danger" onClick={this.DeleteEvent}>Delete Event</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        )
    }

    render_manage = () => {
        return (
            <div>
                <Card border="light" className="shadow-sm">
                    <Row className={"m-3"}>
                        <Col>
                            <b>Number of participants:</b> {this.state.participants == null ? 0 : this.state.participants.length}
                        </Col>
                    </Row>
                    <Row className={"mb-3 mx-3"}>
                        <Col lg={12}>
                            <Table responsive className="align-items-center table-flush">
                                <thead className="thead-light">
                                    <tr>
                                        <th className="border-0">Username</th>
                                        <th className="border-0">First Name</th>
                                        <th className="border-0">Last Name</th>
                                        <th className="border-0">Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.participants == null ? ""
                                            :
                                            this.state.participants.map((participant, index) => (
                                                <tr key={`participant_${index}`}>
                                                    <td>
                                                        {participant.username}
                                                    </td>
                                                    <td>
                                                        {participant.first_name}
                                                    </td>
                                                    <td>
                                                        {participant.last_name}
                                                    </td>
                                                    <td>
                                                        <a href={`mailto:${participant.email}`}>{participant.email}</a>
                                                    </td>
                                                </tr>
                                            ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Card>
            </div >
        )
    }

    render() {
        return (
            <div>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
                            <Breadcrumb.Item>My Events</Breadcrumb.Item>
                            <Breadcrumb.Item active>Organize</Breadcrumb.Item>
                        </Breadcrumb>
                        <h4>Manage your event</h4>
                        <p className="mb-0">Get full control of participation, team formation, edit details for your event.</p>
                    </div>
                </div>
                <div>
                    <Card.Link as={Link} to={{
                        pathname: Routes.OrganizerEvents.path,
                    }}>
                        <h4><FontAwesomeIcon icon={faArrowCircleLeft} /></h4>
                    </Card.Link>
                </div>
                <Tab.Container defaultActiveKey="edit_event">
                    <Nav fill className="nav-tabs">
                        <Nav.Item>
                            <Nav.Link eventKey="participants" className="mb-sm-3 mb-md-0">
                                Participants
                            </Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                            <Nav.Link eventKey="teams" className="mb-sm-3 mb-md-0">
                                Ideas and teams
                            </Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                            <Nav.Link eventKey="edit_event" className="mb-sm-3 mb-md-0">
                                Edit Event
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>

                    <Tab.Content>
                        <Tab.Pane eventKey="participants" className="py-4">
                            {this.render_manage()}
                        </Tab.Pane>

                        <Tab.Pane eventKey="teams" className="py-4">
                            {this.state.organization_teams == null ?
                                ""
                                :
                                <div>
                                    <Row className={"mb-4"}>
                                        <Col xs={6}>
                                            <Form.Control type="text" placeholder="Search teams by ideas" value={this.state.searchTeams} onChange={(e) => { this.setState({ searchTeams: e.target.value }) }} />
                                        </Col>
                                        <Col xs={3}>
                                            <Button variant="outline-success" className="w-100" onClick={async () => await this.get_organizer_teams()}>Search</Button>
                                        </Col>
                                        <Col xs={3}>
                                            <Button variant="outline-danger" className="w-100" onClick={() => { this.setState({ searchTeams: "" }, async () => await this.get_organizer_teams()) }}>Clear</Button>
                                        </Col>
                                    </Row>

                                    <Row className={"my-3"}>
                                        <Col>
                                            <b>Number of teams: </b>{this.state.organization_teams.length}
                                        </Col>
                                        <Col className={"d-flex justify-content-end"}>
                                            <Button as={Link} to={{
                                                pathname: Routes.TeamVisualizer.path,
                                                state: {teamInfo: this.state.organization_teams, back_data: this.state.event}
                                            }}
                                                size="sm"
                                                variant="primary"
                                            >
                                                Visualize with a graph
                                            </Button>
                                        </Col>
                                    </Row>
                                    <AccordionComponent
                                        defaultKey="panel-team"
                                        data={this.render_organizer_teams()}
                                    />
                                </div>
                            }
                        </Tab.Pane>

                        <Tab.Pane eventKey="edit_event" className="py-4">
                            {this.render_editForm()}
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </div>
        )
    }
}

export default OrganizerEventDashboard