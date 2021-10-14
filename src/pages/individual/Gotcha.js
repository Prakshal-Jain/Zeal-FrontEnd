import React, { Component } from "react";
import { Breadcrumb, Nav, Row, Col, Button, Form, Card, Pagination, Alert, Image } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlus, faTimesCircle, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { Link, Redirect } from 'react-router-dom';
import axios from "axios";
import { Routes } from "../../routes";

class Gotcha extends Component {
    constructor(props) {
        super(props);
        this.state = {
            all_interests: null,
            error: null,
            temp_add_interest: "",
            page_size: 10,
            page: 1,
            news: null,
        }
    }

    api_key = "0ab68ce5e16148b781bf1750600c959d"

    componentDidMount = async () => {
        await this.getGotchaKeywords()
        await this.loadNews()
    }

    getGotchaKeywords = async () => {
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }
        await axios.get('/auth/gotcha/', {
            headers: header
        })
            .then((response) => {
                this.setState({ all_interests: response.data[0].gotcha_keywords });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    postGotchaKeywords = async () => {
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }
        await axios.put('/auth/gotcha/', { "gotcha_keywords": this.state.all_interests }, {
            headers: header
        })
            .then((response) => {
                this.setState({ all_interests: response.data[0].gotcha_keywords });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    renderChoices = () => {
        if (this.state.all_interests == null) {
            return "";
        }
        return (
            <Row>
                {Object.entries(this.state.all_interests).map(([name, is_active], index) => (
                    <Col lg={2}>
                        <Nav fill variant="pills" className="flex-column flex-sm-row" activeKey={is_active ? `${name}-${index}` : ""}>
                            <Nav.Item>
                                <Nav.Link eventKey={`${name}-${index}`} className="mb-sm-3 mb-md-0">
                                    <Row className={"d-flex"}>
                                        <Col onClick={() => { this.handleInterests(name); }}>
                                            {name}
                                        </Col>
                                        <Col>
                                            <FontAwesomeIcon icon={faTimesCircle} onClick={() => { this.deleteInterest(name); }} />
                                        </Col>
                                    </Row>
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                ))}
            </Row>
        )
    }

    renderPagination = () => {
        if (this.state.news == null) {
            return ""
        }
        return (
            // Bug: Still goes to next when no more results.
            <div className="d-flex justify-content-center align-items-center mt-4">
                <Pagination size={this.state.page_size} className={"m-3"}>
                    <Pagination.Prev disabled={this.state.page <= 1} onClick={() => { this.setState({ page: this.state.page - 1 }, () => { this.loadNews() }) }}>
                        <FontAwesomeIcon icon={faAngleDoubleLeft} />
                    </Pagination.Prev>
                    <Pagination.Item active={true} key={1}>
                        {this.state.page}
                    </Pagination.Item>
                    <Pagination.Next disabled={(this.state.news.totalResults - this.state.page_size * this.state.page) <= 0} onClick={() => { this.setState({ page: this.state.page + 1 }, () => { this.loadNews() }) }}>
                        <FontAwesomeIcon icon={faAngleDoubleRight} />
                    </Pagination.Next>
                </Pagination>
                <Form>
                    <Form.Group className="m-3">
                        <Form.Select onChange={(event) => { this.setState({ page_size: event.target.value }, () => { this.loadNews() }) }}>
                            <option value={10}>10</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </Form.Select>
                    </Form.Group>
                </Form>
            </div>
        )
    }

    loadNews = async () => {
        if (this.state.all_interests == null) {
            return
        }
        var selected_interests = Object.entries(this.state.all_interests).filter(([keyword, is_selected]) => is_selected).map(([keyword, is_selected]) => keyword).join(" OR ");
        if (selected_interests == null || selected_interests == "") {
            this.setState({ error: <div>Please select at least one keyword.</div>, news: null, page: 1 })
            return
        }
        var response = await fetch(
            `https://newsapi.org/v2/everything?q=${selected_interests}&pageSize=${this.state.page_size}&page=${this.state.page}&sortBy=popularity&&apiKey=${this.api_key}`,
            {
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        var all_news = await response.json();
        if (all_news.status == "ok") {
            this.setState({ error: null, news: all_news })
        }
        else {
            this.setState({ error: <div>An unexpected error occured. Please contact us and report this issue at: <Card.Link href={"mailto:" + Routes.email.path}>{Routes.email.path}</Card.Link></div>, news: null, page: 1 })
        }
    }

    formatDate = (date) => {
        if (date == null || date == undefined || date == "") {
            return "Date not specified"
        }
        let d = new Date(date);
        let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
        let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
        let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
        return (`${mo} ${da}, ${ye}`);
    }

    render_news = () => {
        if (this.state.news == null) {
            return ""
        }
        return (
            this.state.news.articles.map((x, index) => (
                <Row key={`news-${index}`}>
                    <Col>
                        <Card>
                            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                                <Col xs={9} className={"pointer_cursor"} onClick={() => { window.open(x.url) }}>
                                    <Card.Body>
                                        <h5 className={"mb-md-0"}>{x.title}</h5>
                                        <div className={"small"}>
                                            {`${(x.author != null) ? x.author : ""} (${this.formatDate(x.publishedAt)})`}
                                        </div>
                                    </Card.Body>
                                </Col>
                                <Col xs={3} className="d-flex justify-content-center align-items-center">
                                    <Image src={x.urlToImage} className={"p-3"} style={{ borderRadius: "1.2em", width: "65%" }} />
                                </Col>
                            </div>
                        </Card>
                    </Col>
                </Row>
            ))
        )
    }

    handleInterests = (key) => {
        var interests_copy = this.state.all_interests
        interests_copy[key] = !(interests_copy[key])
        this.setState({ interests: interests_copy }, async () => {
            await this.loadNews();
            await this.postGotchaKeywords();
        });
    }

    add_new_interest = () => {
        if (this.state.temp_add_interest == null || this.state.temp_add_interest == undefined || this.state.temp_add_interest == "" || (this.state.temp_add_interest in this.state.all_interests)) {
            return
        }
        var temp_all_interests = this.state.all_interests
        temp_all_interests[this.state.temp_add_interest] = true
        this.setState({
            all_interests: temp_all_interests,
            temp_add_interest: "",
        }, async () => {
            await this.postGotchaKeywords();
        })
    }

    deleteInterest = (key) => {
        var interests_copy = this.state.all_interests
        delete interests_copy[key]
        this.setState({ interests: interests_copy }, async () => {
            await this.postGotchaKeywords();
        });
    }

    render() {
        return (
            <div>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item><Card.Link as={Link} to={Routes.ZealHome.path}><FontAwesomeIcon icon={faHome} /></Card.Link></Breadcrumb.Item>
                            <Breadcrumb.Item active>Gotcha Center</Breadcrumb.Item>
                        </Breadcrumb>
                        <h4>Gotcha Center</h4>
                        <p className="mb-0">Generate breakthrough ideas and find amazing resources.</p>
                    </div>
                </div>

                <div className={"d-flex flex-row-reverse"}>
                    <Button variant="outline-primary" className="m-2" onClick={this.add_new_interest}>
                        <FontAwesomeIcon icon={faPlus} className="me-2" /> Add New Topic
                    </Button>
                    <Form.Group id="add_topic" className="m-2">
                        <Form.Control required type="text" placeholder="Enter your new topic" onChange={(event) => { this.setState({ temp_add_interest: event.target.value }) }} value={this.state.temp_add_interest} />
                    </Form.Group>
                </div>

                <div className={"m-2"}>
                    {this.renderChoices()}
                </div>

                {this.render_news()}

                <div>
                    {this.state.error != null ?
                        <Alert variant="warning">
                            {this.state.error}
                        </Alert>
                        :
                        ""
                    }
                </div>

                {this.renderPagination()}
            </div>
        )
    }
}

export default Gotcha