import React, { Component } from "react";
import { Breadcrumb, Nav, Row, Col, Alert, Modal, Button } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faHeart } from '@fortawesome/free-solid-svg-icons';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Link, Redirect } from 'react-router-dom';
import axios from "axios";
import { Routes } from "../routes";

// Dependencies:
// react-big-calendar
// moment

class Calender extends Component {
    constructor(props) {
        super(props);
        this.state = {
            calendar: null,
            new_event: {
                'title': "",
                'start': null,
                'end': null,
                'resource': "",
                'allDay': false
            }
        }
    }

    componentDidMount = async () => {
        await this.get_user_calander()
    }

    localizer = momentLocalizer(moment)

    get_user_calander = async () => {
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }

        await axios.get(`calendar/`, {
            headers: header
        })
            .then((response) => {
                this.setState({
                    calendar: response.data
                });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    post_new_event = async () => {
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }

        await axios.post(`calendar/`, this.state.new_event, {
            headers: header
        })
            .then(async (response) => {
                await this.get_user_calander();
                this.clearNewEvent();
            })
            .catch((error) => {
                console.log(error)
            })
    }

    clearNewEvent = () => {
        this.setState({
            new_event: {
                'title': "",
                'start': null,
                'end': null,
                'resource': "",
                'allDay': false
            }
        })
    }

    new_event_modal = () => {
        return (
            <Modal as={Modal.Dialog} centered show={(this.state.modelTeamIndex != -1)} onHide={() => this.setState({ modelTeamIndex: -1 })}>
                <Modal.Header>
                    <Modal.Title className="h6">Create new event</Modal.Title>
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

    handleSelectEvent = (event) => {
        console.log(event)
    }

    handleSelectSlot = ({ start, end }) => {
        console.log(start, end)
    }

    render() {
        if (this.state.calendar == null) {
            return ""
        }
        return (
            <div>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
                            <Breadcrumb.Item active>Calendar</Breadcrumb.Item>
                        </Breadcrumb>
                        <h4>Calendar</h4>
                        <p className="mb-0">Schedule meetings and achievement celebrations with your team members.</p>
                    </div>
                </div>
                <div>
                    <Calendar
                        selectable
                        localizer={this.localizer}
                        events={this.state.calendar}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 550 }}
                        onSelectEvent={this.handleSelectEvent}
                        onSelectSlot={this.handleSelectSlot}
                    />
                    <Alert variant="success" className={"my-4"}>
                        Click on a slot to schedule an event.
                    </Alert>
                </div>
            </div>
        )
    }
}

export default Calender