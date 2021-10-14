import React, { Component } from "react";
import { Breadcrumb, Table, Card, Row, Col, Button } from '@themesberg/react-bootstrap';
import AccordionComponent from "../../components/AccordionComponent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faHome, faHeart } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import moment from "moment-timezone";
import axios from "axios";
import { Routes } from "../../routes";


class ParticipantTeamOwnerDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            team: null,
        }
    }

    componentDidMount = async () => {
        this.setState({ team: this.props.location.state.team })
    }

    get_updated_team = async (username) => {
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }

        await axios.get(`events/add_remove_team_participant/?team_id=${this.state.team.id}`, {
            headers: header
        })
            .then(async (response) => {
                this.setState({ team: response.data[0] })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    add_remove_team_participant = async (username) => {
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }

        await axios.post(`events/add_remove_team_participant/`, { "username": username, "team_id": this.state.team.id }, {
            headers: header
        })
            .then(async (response) => {
                await this.get_updated_team()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    renderInterestedTable = () => {
        if (this.state.team.interested.length == 0) {
            return (<div>Looks like there are no interests yet. Please check back later.</div>)
        }
        return (
            <Table responsive className="align-items-center table-flush">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Name</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.team.interested.map((participant, index) => (
                        <tr key={`member_${index}`}>
                            <td>
                                {participant.username}
                            </td>
                            <td>
                                {participant.first_name} {participant.last_name}
                            </td>
                            <td>
                                <Button
                                    size="sm"
                                    variant="success"
                                    onClick={async () => await this.add_remove_team_participant(participant.username)}
                                >
                                    Invite
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    renderWaitingTeamTable = () => {
        if (this.state.team.hold_teammates.length == 0) {
            return (<div>The participants haven't accepted your invite yet. Please check back later.</div>)
        }
        return (
            <Table responsive className="align-items-center table-flush">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Name</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.team.hold_teammates.map((participant, index) => (
                        <tr key={`member_${index}`}>
                            <td>
                                {participant.username}
                            </td>
                            <td>
                                {participant.first_name} {participant.last_name}
                            </td>
                            <td>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={async () => await this.add_remove_team_participant(participant.username)}
                                >
                                    Remove
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    renderTeamTable = () => {
        if (this.state.team.teammates.length == 0) {
            return (<div>No teams is formed yet. {this.state.team.interested.length > 0 ? <label>Invite participants from <b>Interested</b> table to join the team.</label> : <label>Please check back later to invite people from <b>Interested</b> table.</label>}</div>)
        }
        return (
            <Table responsive className="align-items-center table-flush">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Name</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.team.teammates.map((participant, index) => (
                        <tr key={`member_${index}`}>
                            <td>
                                {participant.username}
                            </td>
                            <td>
                                {participant.first_name} {participant.last_name}
                            </td>
                            <td>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={async () => await this.add_remove_team_participant(participant.username)}
                                >
                                    Remove
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    render() {
        if (this.state.team == null) {
            return "";
        }
        return (
            <div>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item><Card.Link as={Link} to={Routes.ZealHome.path}><FontAwesomeIcon icon={faHome} /></Card.Link></Breadcrumb.Item>
                            <Breadcrumb.Item><Card.Link as={Link} to={Routes.ParticipantEvents.path}>My Events</Card.Link></Breadcrumb.Item>
                            <Breadcrumb.Item><Card.Link as={Link} to={Routes.ParticipantEvents.path}>Participate</Card.Link></Breadcrumb.Item>
                            <Breadcrumb.Item><Card.Link as={Link} to={{ pathname: Routes.ParticipantEventDashboard.path, state: this.props.location.state.event }}>Event Dashboard</Card.Link></Breadcrumb.Item>
                            <Breadcrumb.Item active>Manage my Team</Breadcrumb.Item>
                        </Breadcrumb>
                        <h4>Manage my team</h4>
                        <p className="mb-0">Bring people interested in your idea to the team and manage your teammates seamlessly.</p>
                    </div>
                </div>
                <div className="mb-3">
                    <Card.Link as={Link} to={{ pathname: Routes.ParticipantEventDashboard.path, state: this.props.location.state.event }}>
                        <h4><FontAwesomeIcon icon={faArrowCircleLeft} /></h4>
                    </Card.Link>
                </div>
                <Row className={"mb-4"}>
                    <Col>
                        <Card className={"p-4 bg-white shadow-sm"}>
                            <h4>Your idea</h4>
                            <p>{this.state.team.idea}</p>
                        </Card>
                    </Col>
                </Row>

                <Row className={"mb-4"}>
                    <Col>
                        <AccordionComponent
                            defaultKey="interested"
                            data={[
                                {
                                    id: 1,
                                    eventKey: "intersted",
                                    title: <div><h5>Interested</h5><div className={"small"}>This is the list of all the participants who are interested your idea and would like to join your team. Invite them to your team by clicking on the invite button on the rightmost side of the table rows.</div></div>,
                                    description: (
                                        <Card className={"p-4 bg-white shadow-sm"}>
                                            {this.renderInterestedTable()}
                                        </Card>
                                    )
                                }
                            ]}
                        />
                    </Col>
                </Row>

                <Row className={"mb-4"}>
                    <Col>
                        <AccordionComponent
                            defaultKey="interested"
                            data={[
                                {
                                    id: 1,
                                    eventKey: "intersted",
                                    title: <div><h5>Waiting Participants</h5><div className={"small"}>This is the list of all the participants you have invited to your team but haven't yet accepted your invite. As soon as they accept the invite, they will show up in <b>Team</b> section below.</div></div>,
                                    description: (
                                        <Card className={"p-4 bg-white shadow-sm"}>
                                            {this.renderWaitingTeamTable()}
                                        </Card>
                                    )
                                }
                            ]}
                        />
                    </Col>
                </Row>

                <Row className={"mb-4"}>
                    <Col>
                        <AccordionComponent
                            defaultKey="teammates"
                            data={[
                                {
                                    id: 2,
                                    eventKey: "teammates",
                                    title: <div><h5>Team</h5><div className={"small"}>List of all your team members.</div></div>,
                                    description: (
                                        <Card className={"p-4 bg-white shadow-sm"}>
                                            {this.renderTeamTable()}
                                        </Card>
                                    )
                                }
                            ]}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default ParticipantTeamOwnerDetails