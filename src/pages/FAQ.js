
import React, { Component } from "react";
import { Col, Row, Container, Button, Card, Modal, Form, Pagination } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AccordionComponent from "../components/AccordionComponent";
import { faPaperPlane, faSearch, faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faEraser } from "@fortawesome/free-solid-svg-icons";
import { Link, Redirect } from 'react-router-dom';
import axios from "axios";

import { Routes } from "../routes";

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            faqs: null,
            errors: [],
            showCreateModal: false,
            new_faq_question: null,
            page: 1,
            search_query: "",
        }
    }

    componentDidMount = async () => {
        await this.loadFaqs("faqs/");
    }

    loadFaqs = async (url) => {
        await axios.get(url)
            .then((response) => {
                this.setState({
                    faqs: response.data,
                })
            })
            .catch((error) => {
                const response_data = error.response.data
                if (typeof response_data == "string") {
                    this.setState({ errors: [<div><p>Please contact us and report this issue at: <Card.Link href={"mailto:" + Routes.email.path}>{Routes.email.path}</Card.Link></p><p>{response_data}</p></div>] });
                }
                else {
                    var errors = []
                    Object.entries(response_data).map(([k, v], i) => errors.push(<div>{k}: {v}</div>))
                    this.setState({ errors: errors });
                }
            });
    }

    handleCreateModal = () => {
        this.setState({
            showCreateModal: !this.state.showCreateModal
        })
    }

    postFAQ = async () => {
        if (this.state.new_faq_question == null || this.state.new_faq_question == "") {
            return
        }
        var template = {
            "question": this.state.new_faq_question,
            "answer": "This question hasn't been answered yet. Please be patient and check back soon. Thank you!"
        }
        var errors = []
        await axios.post('faqs/', template)
            .then((data) => {
                if (errors.length == 0) {
                    this.setState({ new_faq_question: "" });
                    this.handleCreateModal()
                    this.loadFaqs(`faqs/?page=${this.state.page}&search=${this.state.search_query}`)
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
    }

    renderModal = () => {
        return (
            <Modal as={Modal.Dialog} centered show={this.state.showCreateModal} onHide={this.handleCreateModal}>
                <Modal.Header>
                    <Modal.Title className="h6">Create a FAQ</Modal.Title>
                    <Button variant="close" aria-label="Close" onClick={this.handleCreateModal} />
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Question:</Form.Label>
                            <Form.Control as="textarea" rows="4" placeholder={"Please enter your question here..."} onChange={(event) => { this.setState({ new_faq_question: event.target.value }) }} />
                        </Form.Group>
                    </Form>
                    <p className="mb-0">We will reply back as soon as possible. Thank you!</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary ms-auto" onClick={this.postFAQ}>
                        Post FAQ
                    </Button>
                    {this.state.errors.map((x, index) => <li key={`error_${index}`}>{x}</li>)}
                </Modal.Footer>
            </Modal>
        )
    }

    renderPagination = () => {
        if (this.state.faqs == null) {
            return ""
        }
        return (
            // todo: Bottons work when clicked twice
            <div className="d-flex justify-content-center align-items-center mt-4">
                <Pagination size={10} className="">
                    <Pagination.Prev disabled={this.state.faqs.previous == null} onClick={() => { this.loadFaqs(this.state.faqs.previous); this.setState({ page: this.state.page - 1 }) }}>
                        <FontAwesomeIcon icon={faAngleDoubleLeft} />
                    </Pagination.Prev>
                    <Pagination.Item active={true} key={1}>
                        {this.state.page}
                    </Pagination.Item>
                    <Pagination.Next disabled={this.state.faqs.next == null} onClick={() => { this.loadFaqs(this.state.faqs.next); this.setState({ page: this.state.page + 1 }) }}>
                        <FontAwesomeIcon icon={faAngleDoubleRight} />
                    </Pagination.Next>
                </Pagination>
            </div>
        )
    }

    render() {
        return (
            <main>
                {this.renderModal()}
                <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
                    <Container>
                        <p className="text-center">
                            <Card.Link as={Link} to={Routes.ZealHome.path} className="text-gray-700">
                                <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Back to homepage
                            </Card.Link>
                        </p>
                        <div className="text-center text-md-center mb-4 mt-md-0">
                            <h3 className="mb-0">Frequently Asked Questions</h3>
                        </div>
                        <Row className={"mb-3"}>
                            <Col md={7}>
                                <Form.Group id="Search">
                                    <Form.Control required type="text" placeholder="Please enter keywords to search for most suitable FAQs" onChange={(event) => {this.setState({search_query: event.target.value})}} value={this.state.search_query} />
                                </Form.Group>
                            </Col>
                            <Col>
                            <Button variant="outline-success" onClick={() => {this.loadFaqs(`faqs/?page=${this.state.page}&search=${this.state.search_query}`)}} className="w-100">
                                    <FontAwesomeIcon icon={faSearch} /> Search
                                </Button>
                            </Col>
                            <Col>
                            <Button variant="outline-danger" onClick={() => {this.loadFaqs(`faqs/`); this.setState({page: 1, search_query: ""})}} className="w-100">
                                    <FontAwesomeIcon icon={faEraser} /> Clear
                                </Button>
                            </Col>
                            <Col>
                                <Button variant="outline-info" onClick={this.handleCreateModal} className="w-100">
                                    <FontAwesomeIcon icon={faPaperPlane} /> Post a FAQ
                                </Button>
                            </Col>
                        </Row>
                        {
                            (this.state.faqs == null || this.state.faqs.results.length == 0) ? "Looks like you discovered an unasked question. Post it ASAP!" :
                                <AccordionComponent
                                    defaultKey="panel-1"
                                    data={this.state.faqs.results.map((x) => ({
                                        id: x.id,
                                        eventKey: `panel-${x.id}`,
                                        title: x.question,
                                        description: x.answer,
                                    }))} />
                        }
                        
                        {/* this.state.faqs != null ? this.state.faqs.next: "" */}
                        {this.renderPagination()}
                    </Container>
                </section>
            </main>
        );
    }
};

export default SignUp