import React, { Component } from "react";
import ChatBubble from "./components/ChatBubble";
import { Breadcrumb, Card, Row, Col, Container, Form, Button } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTrashAlt, faAngleRight, faHome, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { Link, Redirect } from 'react-router-dom';
import axios from "axios";
import { Routes } from "../routes";

import Profile1 from "../assets/img/team/profile-picture-1.jpg";
import Profile2 from "../assets/img/team/profile-picture-5.jpg";

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chat_connections: {
                "Paul": "10:36 PM",
                "Angela": "Yesterday, 2:00 PM",
                "Adam": "Yesterday, 1:00 PM",
            },
            currently_chatting: null,
        }
    }

    render_chat_mode = () => {
        return (
            <div>
                <Row className="justify-content-between align-items-center header-height">
                    <Col>
                        <h4><FontAwesomeIcon icon={faArrowCircleLeft} className={"pointer_cursor"} onClick={() => { this.setState({ currently_chatting: null }) }} /></h4>
                    </Col>
                    <Col className={"d-flex flex-row-reverse"}>
                        <h4>{this.state.currently_chatting}</h4>
                    </Col>
                </Row>

                <Row className={"message-height"}>
                    {this.render_messages()}
                </Row>

                <Row className={"justify-content-between align-items-center chat-height"}>
                    {this.renderInputChatBox()}
                </Row>
            </div>
        )
    }

    renderInputChatBox = () => {
        return (
            <Col className={"d-flex"} xs={12}>
                <Form.Control as="textarea" rows="1" className="m-1" placeholder={"Enter your message here..."} />
                <Button variant="success" className="m-1" onClick={() => { }}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                </Button>
            </Col>
        )
    }

    render_messages = () => {
        return (
            <div>
                <ChatBubble isMine={false} time={"10:36 PM"} message={"Hey, wassup??"} profile_image={Profile2} username={"lallu"} />
                <ChatBubble isMine={false} time={"10:36 PM"} message={"How do you feel about Zeal?"} profile_image={Profile2} username={"lallu"} />
                <ChatBubble isMine={true} time={"10:36 PM"} message={"That is just amazing!"} profile_image={Profile1} username={"mallu"} />
                <ChatBubble isMine={true} time={"10:36 PM"} message={"Zeal help hackathons and event participants, startups, and individuals with ideas to find worthy team members who can together execute their ideas to reality, instead of wasting precious time researching the technicalities and losing the overall focus. Hence, filling the gap between people with ideas and people who can execute."} profile_image={Profile1} username={"mallu"} />
                <ChatBubble isMine={false} time={"10:36 PM"} message={"Wow! I already love it!"} profile_image={Profile2} username={"lallu"} />
                <ChatBubble isMine={false} time={"10:36 PM"} message={"Hey, wassup??"} profile_image={Profile2} username={"lallu"} />
                <ChatBubble isMine={false} time={"10:36 PM"} message={"How do you feel about Zeal?"} profile_image={Profile2} username={"lallu"} />
                <ChatBubble isMine={true} time={"10:36 PM"} message={"That is just amazing!"} profile_image={Profile1} username={"mallu"} />
                <ChatBubble isMine={true} time={"10:36 PM"} message={"Zeal help hackathons and event participants, startups, and individuals with ideas to find worthy team members who can together execute their ideas to reality, instead of wasting precious time researching the technicalities and losing the overall focus. Hence, filling the gap between people with ideas and people who can execute."} profile_image={Profile1} username={"mallu"} />
                <ChatBubble isMine={false} time={"10:36 PM"} message={"Wow! I already love it!"} profile_image={Profile2} username={"lallu"} />
            </div>
        )
    }

    deleteChat = (name) => {
        console.log(name)
    }

    render_people_mode = () => {
        return (
            <div>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
                            <Breadcrumb.Item active>Chat</Breadcrumb.Item>
                        </Breadcrumb>
                        <h4>Chat</h4>
                        <p className="mb-0">Discuss the next breakthrough with your amazing team.</p>
                    </div>
                </div>
                {Object.entries(this.state.chat_connections).map(([name, time], index) => (
                    <Row>
                        <Col key={`chat-${index}`}>
                            <Card>
                                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                                    <Col xs={9} onClick={() => { this.setState({ currently_chatting: name }) }} className={"pointer_cursor"}>
                                        <Card.Body>
                                            <h5 className={"mb-md-0"}>{name}</h5>
                                            <div className={"small"}>
                                                {time}
                                            </div>
                                        </Card.Body>
                                    </Col>
                                    <Col>
                                        <Card.Body className={"d-flex flex-row-reverse"}>
                                            <FontAwesomeIcon icon={faTrashAlt} onClick={() => {this.deleteChat(name)}} className={"m-2 pointer_cursor"} />
                                        </Card.Body>
                                    </Col>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                ))}
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.state.currently_chatting == null ?
                    this.render_people_mode()
                    :
                    this.render_chat_mode()
                }
            </div>
        )
    }
}

export default Chat