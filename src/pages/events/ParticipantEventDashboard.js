import React, { Component } from "react";
import { Breadcrumb, Nav, Tab, Card, Alert, Row, Col, Button, Modal, Form, Table, Badge } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faHome, faHeart } from '@fortawesome/free-solid-svg-icons';
import AccordionComponent from "../../components/AccordionComponent";
import { Link } from 'react-router-dom';
import moment from "moment-timezone";
import axios from "axios";
import { Routes } from "../../routes";

class ParticipantDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            all_teams: null,
            owner_teams: null,
            member_teams: null,
            team_invitations: null,
            modelTeamIndex: -1,
            modelMemberIndex: -1,
            modelInviteIndex: -1,
            new_team_idea: "",
        }
    }

    componentDidMount = async () => {
        await this.getOthersTeams();
        await this.getOwnerTeams();
        await this.getMemberTeam();
        await this.getTeamInvitations();
    }

    getOthersTeams = async () => {
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }

        await axios.get(`events/participant_others_team/?event_id=${this.props.location.state.id}`, {
            headers: header
        })
            .then((response) => {
                this.setState({ all_teams: response.data })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getOwnerTeams = async () => {
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }

        await axios.get(`events/participant_owner_team/?event_id=${this.props.location.state.id}`, {
            headers: header
        })
            .then((response) => {
                this.setState({ owner_teams: response.data })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getMemberTeam = async () => {
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }

        await axios.get(`events/participant_member_teams/?event_id=${this.props.location.state.id}`, {
            headers: header
        })
            .then((response) => {
                this.setState({ member_teams: response.data })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getTeamInvitations = async () => {
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }

        await axios.get(`events/participant_team_invites/?event_id=${this.props.location.state.id}`, {
            headers: header
        })
            .then((response) => {
                this.setState({ team_invitations: response.data })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    postInterested = async (team_id) => {
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }

        await axios.post(`events/participant_others_team/`, { "event_id": this.props.location.state.id, "team_id": team_id }, {
            headers: header
        })
            .then(async (response) => {
                await this.getOthersTeams()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    post_new_team = async () => {
        if (this.state.new_team_idea == null || this.state.new_team_idea == "") {
            return
        }
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }

        await axios.post(`events/participant_owner_team/`, { "idea": this.state.new_team_idea, "event_id": this.props.location.state.id }, {
            headers: header
        })
            .then(async (response) => {
                this.setState({ new_team_idea: "" }, async () => {
                    await this.getOwnerTeams()
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    post_member_leave_team = async () => {
        if (this.state.member_teams == null || this.state.modelMemberIndex == -1 || this.state.modelMemberIndex >= this.state.member_teams.results.length) {
            return
        }
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }

        await axios.post(`events/participant_member_teams/`, { "team_id": this.state.member_teams.results[this.state.modelMemberIndex].id }, {
            headers: header
        })
            .then((response) => {
                this.setState({ modelMemberIndex: -1 }, async () => {
                    await this.getMemberTeam();
                });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    postInviteResponse = async (accepted) => {
        if (this.state.team_invitations == null || this.state.modelInviteIndex == -1 || this.state.modelInviteIndex >= this.state.team_invitations.results.length) {
            return
        }
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }

        await axios.post(`events/participant_team_invites/`, { "accepted": accepted, "team_id": this.state.team_invitations.results[this.state.modelInviteIndex].id }, {
            headers: header
        })
            .then((response) => {
                this.setState({ modelInviteIndex: -1 }, async () => {
                    await this.getTeamInvitations();
                });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    post_leave_event = async () => {
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }

        await axios.post(`events/participant_leave_event/`, { "event_id": this.props.location.state.id }, {
            headers: header
        })
            .then((response) => {
                this.props.componentProps.redirect_history.push(Routes.ParticipantEvents.path)
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

    renderEventInfo = () => {
        if (this.props.location == null || this.props.location.state == null || this.props.location.state == undefined) {
            return <div>Oops! Something went wrong. Please check back later.</div>
        }
        return (
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

                    <Row>
                        <Col>
                            <Button variant="danger" onClick={this.post_leave_event}>Leave Event</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        )
    }

    renderJoinModel = () => {
        if (this.state.all_teams == null || this.state.modelTeamIndex > this.state.all_teams.results.length || this.state.modelTeamIndex < 0) {
            return ""
        }
        return (
            <Modal as={Modal.Dialog} centered show={(this.state.modelTeamIndex != -1)} onHide={() => this.setState({ modelTeamIndex: -1 })}>
                <Modal.Header>
                    <Modal.Title className="h6">About</Modal.Title>
                    <Button variant="close" aria-label="Close" onClick={() => this.setState({ modelTeamIndex: -1 })} />
                </Modal.Header>
                <Modal.Body>
                    <p>
                        {this.state.all_teams.results[this.state.modelTeamIndex].idea}
                    </p>
                    {this.state.all_teams.results[this.state.modelTeamIndex].interested.is_interested ?
                        <Alert variant="warning">
                            If you no longer want to be considered as a potential candidate of this team, please click the Heart icon below.
                        </Alert>
                        :
                        <Alert variant="success">
                            If you want to join this team, please like this post (click the Heart icon below).
                        </Alert>
                    }

                </Modal.Body>
                <Modal.Footer>
                    <Row>
                        <Col onClick={() => this.postInterested(this.state.all_teams.results[this.state.modelTeamIndex].id)}>
                            <FontAwesomeIcon icon={faHeart} className={`pointer_cursor mx-1 ${this.state.all_teams.results[this.state.modelTeamIndex].interested.is_interested ? "fill_red" : ""}`} /> {this.state.all_teams.results[this.state.modelTeamIndex].interested.interest_count}
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
        )
    }

    renderMemberModel = () => {
        if (this.state.member_teams == null || this.state.modelMemberIndex > this.state.member_teams.results.length || this.state.modelMemberIndex < 0) {
            return ""
        }
        return (
            <Modal as={Modal.Dialog} centered show={(this.state.modelMemberIndex != -1)} onHide={() => this.setState({ modelMemberIndex: -1 })}>
                <Modal.Header>
                    <Modal.Title className="h6">Welcome to the team!</Modal.Title>
                    <Button variant="close" aria-label="Close" onClick={() => this.setState({ modelMemberIndex: -1 })} />
                </Modal.Header>
                <Modal.Body>
                    <p>
                        {this.state.member_teams.results[this.state.modelMemberIndex].idea}
                    </p>
                    <p>
                        {this.state.member_teams.results[this.state.modelMemberIndex].teammates.length > 0 ? (
                            <AccordionComponent
                                defaultKey="panel-team"
                                data={[
                                    {
                                        id: 1,
                                        eventKey: "teammates_1",
                                        title: "List of all team members",
                                        description: (
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
                                                    {this.state.member_teams.results[this.state.modelMemberIndex].teammates.map((participant, index) => (
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
                                        )
                                    }
                                ]}
                            />
                        )
                            :
                            "You are first person to join the team!"
                        }
                    </p>

                    <Alert variant="warning">
                        If you want to leave the team, click the button below to continue.
                    </Alert>

                </Modal.Body>
                <Modal.Footer>
                    <Row>
                        <Col>
                            <Button variant="danger" onClick={this.post_member_leave_team}>Leave Team</Button>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal >
        )
    }

    renderInvitationModel = () => {
        if (this.state.team_invitations == null || this.state.modelInviteIndex > this.state.team_invitations.results.length || this.state.modelInviteIndex < 0) {
            return ""
        }
        return (
            <Modal as={Modal.Dialog} centered show={(this.state.modelInviteIndex != -1)} onHide={() => this.setState({ modelInviteIndex: -1 })}>
                <Modal.Header>
                    <Modal.Title className="h6">Welcome to the team!</Modal.Title>
                    <Button variant="close" aria-label="Close" onClick={() => this.setState({ modelInviteIndex: -1 })} />
                </Modal.Header>
                <Modal.Body>
                    <p>
                        {this.state.team_invitations.results[this.state.modelInviteIndex].idea}
                    </p>
                    <p>
                        {this.state.team_invitations.results[this.state.modelInviteIndex].teammates.length > 0 ? (
                            <AccordionComponent
                                defaultKey="panel-team"
                                data={[
                                    {
                                        id: 1,
                                        eventKey: "teammates_1",
                                        title: "List of all team members",
                                        description: (
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
                                                    {this.state.team_invitations.results[this.state.modelInviteIndex].teammates.map((participant, index) => (
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
                                        )
                                    }
                                ]}
                            />
                        )
                            :
                            "You will be the first person to join the team!"
                        }
                    </p>

                    <Alert variant="success">
                        If you <b>accept</b> the invitation, you will join the team. Otherwise, if you do not want to be considered, you can also <b>reject</b> the invitation.
                    </Alert>

                </Modal.Body>
                <Modal.Footer>
                    <Row>
                        <Col>
                            <Button variant="success" onClick={() => { this.postInviteResponse(true) }}>Accept</Button>
                        </Col>
                        <Col>
                            <Button variant="danger" onClick={() => { this.postInviteResponse(false) }}>Reject</Button>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal >
        )
    }

    renderOtherTeams = () => {
        if (this.state.all_teams == null || this.state.all_teams.results.length == 0) {
            return <div>No teams found. Please click on <b>Form teams</b> to form one.</div>;
        }
        return (
            this.state.all_teams.results.map((team, index) => (
                <div>
                    <Row className="mb-2" key={`join_event-${index}`}>
                        <Col>
                            <Card>
                                <Row className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                                    <Col className={"pointer_cursor"}>
                                        <Card.Body>
                                            <Row onClick={() => this.setState({ modelTeamIndex: index })}>
                                                <Col>
                                                    <h5 className={"mb-md-0"}>{this.truncateString(team.idea, 70)}</h5>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col onClick={() => this.postInterested(team.id)} xs={3}>
                                                    <FontAwesomeIcon icon={faHeart} className={`mx-1 ${team.interested.is_interested ? "fill_red" : ""}`} /> {team.interested.interest_count}
                                                </Col>
                                                <Col xs={9} onClick={() => this.setState({ modelTeamIndex: index })} className={"small d-flex justify-content-end"}>
                                                    {moment(team.created).format("MM/DD/YYYY hh:mm a")}
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </div>
            ))
        )
    }

    renderOwnerTeams = () => {
        if (this.state.owner_teams == null || this.state.owner_teams.results.length == 0) {
            return <div>No teams found. Please enter your idea in the textox above and click <b>Post your idea and form team</b> to create a new team.</div>;
        }
        return (
            this.state.owner_teams.results.map((team, index) => (
                <div>
                    <Row className="mb-2" key={`join_event-${index}`}>
                        <Col>
                            <Card as={Link} to={{
                                pathname: Routes.ParticipantTeamOwnerDetails.path,
                                state: { "team": team, "event": this.props.location.state }
                            }}>
                                <Row className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                                    <Col className={"pointer_cursor"}>
                                        <Card.Body>
                                            <Row>
                                                <Col>
                                                    <h5 className={"mb-md-0"}>{this.truncateString(team.idea, 70)}</h5>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col className={"small d-flex justify-content-end"}>
                                                    {moment(team.created).format("MM/DD/YYYY HH:mm")}
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </div>
            ))
        )
    }

    renderMemberTeams = () => {
        if (this.state.member_teams == null || this.state.member_teams.results.length == 0) {
            return <div>No teams found. Please check back later.</div>;
        }
        return (
            this.state.member_teams.results.map((team, index) => (
                <div>
                    <Row className="mb-2" key={`join_event-${index}`}>
                        <Col>
                            <Card onClick={() => this.setState({ modelMemberIndex: index })}>
                                <Row className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                                    <Col className={"pointer_cursor"}>
                                        <Card.Body>
                                            <Row>
                                                <Col>
                                                    <h5 className={"mb-md-0"}>{this.truncateString(team.idea, 70)}</h5>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col className={"small d-flex justify-content-end"}>
                                                    {moment(team.created).format("MM/DD/YYYY HH:mm")}
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </div>
            ))
        )
    }

    renderTeamInvitations = () => {
        if (this.state.team_invitations == null || this.state.team_invitations.results.length == 0) {
            return <div>No invitations found. Please check back later.</div>;
        }
        return (
            this.state.team_invitations.results.map((team, index) => (
                <div>
                    <Row className="mb-2" key={`join_event-${index}`}>
                        <Col>
                            <Card onClick={() => this.setState({ modelInviteIndex: index })}>
                                <Row className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                                    <Col className={"pointer_cursor"}>
                                        <Card.Body>
                                            <Row>
                                                <Col>
                                                    <h5 className={"mb-md-0"}>{this.truncateString(team.idea, 70)}</h5>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col className={"small d-flex justify-content-end"}>
                                                    {moment(team.created).format("MM/DD/YYYY HH:mm")}
                                                </Col>
                                            </Row>
                                        </Card.Body>
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
                            <Breadcrumb.Item><Card.Link as={Link} to={Routes.ParticipantEvents.path}>My Events</Card.Link></Breadcrumb.Item>
                            <Breadcrumb.Item><Card.Link as={Link} to={Routes.ParticipantEvents.path}>Participate</Card.Link></Breadcrumb.Item>
                            <Breadcrumb.Item active>Event Dashboard</Breadcrumb.Item>
                        </Breadcrumb>
                        <h4>Event Details</h4>
                        <p className="mb-0">Form or join teams, view details, get announcements for your event.</p>
                    </div>
                </div>
                <div>
                    <Card.Link as={Link} to={{
                        pathname: Routes.ParticipantEvents.path,
                    }}>
                        <h4><FontAwesomeIcon icon={faArrowCircleLeft} /></h4>
                    </Card.Link>
                </div>

                <Tab.Container defaultActiveKey="event_info">
                    <Nav fill className="nav-tabs">
                        <Nav.Item>
                            <Nav.Link eventKey="event_info" className="mb-sm-3 mb-md-0">
                                Event Information
                            </Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                            <Nav.Link eventKey="all_teams" className="mb-sm-3 mb-md-0">
                                Join a team
                            </Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                            <Nav.Link eventKey="invitations" className="mb-sm-3 mb-md-0">
                                Team invitations
                            </Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                            <Nav.Link eventKey="my_teams" className="mb-sm-3 mb-md-0">
                                Create teams
                            </Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                            <Nav.Link eventKey="joined_teams" className="mb-sm-3 mb-md-0">
                                My teams
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>

                    <Tab.Content>
                        <Tab.Pane eventKey="event_info" className="py-4">
                            {this.renderEventInfo()}
                        </Tab.Pane>

                        <Tab.Pane eventKey="all_teams" className="py-4">
                            {this.renderOtherTeams()}
                        </Tab.Pane>

                        <Tab.Pane eventKey="invitations" className="py-4">
                            {this.renderTeamInvitations()}
                        </Tab.Pane>

                        <Tab.Pane eventKey="my_teams" className="py-4">
                            <Row>
                                <Col>
                                    <h5>Create a Team</h5>
                                    <Form.Control as="textarea" rows="4" placeholder={"Briefly describe your idea, or what type of team members or skills you are looking for here..."} value={this.state.new_team_idea} onChange={(event) => { this.setState({ new_team_idea: event.target.value }) }} />
                                </Col>
                            </Row>
                            <Row>
                                <Col className={"my-2 d-flex justify-content-end"}>
                                    <Button variant="success" onClick={this.post_new_team}>Post your idea and form team</Button>
                                </Col>
                            </Row>
                            <hr />
                            <h5>My Teams</h5>
                            <p>You are the <b>owner</b> of the following teams</p>
                            {this.renderOwnerTeams()}
                        </Tab.Pane>

                        <Tab.Pane eventKey="joined_teams" className="py-4">
                            <p>You are the <b>member</b> of the following teams</p>
                            {this.renderMemberTeams()}
                        </Tab.Pane>
                    </Tab.Content>

                </Tab.Container>
                {this.renderJoinModel()}
                {this.renderInvitationModel()}
                {this.renderMemberModel()}
            </div>
        )
    }
}

export default ParticipantDashboard