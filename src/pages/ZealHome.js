import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Card, Image, Button, Container, Navbar, Nav, Alert } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import axios from "axios";

import { Routes } from "../routes";
import AboutZealOne from "../assets/img/illustrations/earth.png";
import AboutZealTwo from "../assets/img/illustrations/about-img.png";
import ZealHero from "../assets/img/logos/zeal-logo-withoutBg.png";
import ZealBackground from "../assets/img/logos/zeal-logo-whiteWithoutBg.png"

// Data imports
import focusData from '../data/focusData'

class ZealHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subscriber: null,
      errors: [],
      successSubscribe: false,
    }
  }

  renderNavBar = () => {
    return (
      <Navbar variant="dark" expand="lg" bg="dark" className="navbar-transparent navbar-theme-primary sticky-top">
        <Container className="position-relative justify-content-between px-3">
          <Navbar.Brand as={HashLink} to="#home" className="me-lg-3 d-flex align-items-center">
            <Image src={ZealHero} />
          </Navbar.Brand>

          <div className="d-flex align-items-center">
            <Navbar.Collapse id="navbar-default-primary">
              <Nav className="navbar-nav-hover align-items-lg-center">
                <Nav.Link as={HashLink} to="#about">About</Nav.Link>
                <Nav.Link as={Link} to={Routes.Signin.path}>Sign In</Nav.Link>
                <Nav.Link as={Link} to={Routes.Signup.path}>Sign Up</Nav.Link>
                <Nav.Link as={Link} to={Routes.FAQ.path}>FAQ &amp; Support</Nav.Link>
                <Nav.Link as={HashLink} to="#contact" className="d-sm-none d-xl-inline">Contact</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    )
  }

  FocusBoxes = (props) => {
    const { title, description, icon } = props;

    return (
      <Col xs={12} sm={6} lg={3}>
        <Card className="bg-white shadow-soft text-primary rounded mb-4">
          <div className="px-3 px-lg-4 py-5 text-center">
            <span className="icon icon-lg mb-4">
              <FontAwesomeIcon icon={icon} />
            </span>
            <h5 className="fw-bold text-primary">{title}</h5>
            <p>{description}</p>
          </div>
        </Card>
      </Col>
    );
  };

  sendSubscriber = async () => {
    console.log(this.state.subscriber)
    await axios.post('/subscribe/', { "email": this.state.subscriber })
      .then((data) => {
        this.setState({ errors: [], successSubscribe: true});
      })
      .catch((error) => {
        const response_data = error.response.data
        if (typeof response_data == "string") {
          this.setState({ errors: [<div><p>Please contact us and report this issue at: <Card.Link href={"mailto:" + Routes.email.path}>{Routes.email.path}</Card.Link></p><p>{response_data}</p></div>], successSubscribe: false});
        }
        else {
          var errors = []
          Object.entries(response_data).map(([k, v], i) => errors.push(<div>{k}: {v}</div>))
          this.setState({ errors: errors, successSubscribe: false });
        }
      });
    return false
  }

  render() {
    return (
      <div>
        {this.renderNavBar()}
        <section className="section-header overflow-hidden pt-5 pt-lg-6 pb-9 pb-lg-12 text-white bg-primary" id="home">
          <Container className="hero-container">
            <Row>
              <Col xs={12} className="text-center">
                {/* Edit styling at: zeal_frontend/src/scss/volt/components/_icon-box.scss */}
                <div className="react-big-icon d-none d-lg-block"><Image src={ZealBackground} alt="Zeal Background Image" /></div>
                <h1 className="fw-bolder text-secondary">Zeal</h1>
                <p className="fw-light mb-5 h5">Build High Performing Teams</p>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="section section-md bg-soft pt-lg-6" id="about">
          <Container>
            <Row className="justify-content-between align-items-center mb-5 mb-lg-7">
              <Col lg={5} className="order-lg-2 mb-5 mb-lg-0">
                <h2>Our mission</h2>
                <p className="mb-3 lead fw-bold">Zeal is a teammate and resource finding tool.</p>
                <p className="mb-4">One of the biggest problems that university students, startups, and corporates face is finding worthy teammates with the right skillsets, who can help turn their ideas into reality.</p>
                <p className="mb-4">Steve Jobs once said: "To me, ideas are worth nothing unless executed. They are just a multiplier. Execution is worth millions."</p>
                <Button as={Link} to={Routes.DashboardOverview.path} variant="secondary" target="_blank">Visit Dashboard <FontAwesomeIcon icon={faExternalLinkAlt} className="ms-1" /></Button>
              </Col>
              <Col lg={6} className="order-lg-1">
                <Image src={AboutZealOne} alt="Finding perfect team members through zeal is incredibly easy." />
              </Col>
            </Row>
            <Row className="justify-content-between align-items-center mb-5 mb-lg-7">
              <Col lg={5}>
                <h2>So, how does it work?</h2>
                <p className="mb-4">Simply enter a brief description of your idea, requirements, and qualities of the teammate you are looking for, and Zeal will find the best fit for you.</p>
                <p>You can then connect with your amazing team, chat, schedule meetings, and get access to additional resources with personalized expert recommendations in the Gotcha Center!</p>
              </Col>
              <Col lg={6}>
                <Image src={AboutZealTwo} alt="Easy research process." />
              </Col>
            </Row>
          </Container>
        </section>

        <section className="section section-lg bg-primary text-white">
          <Container>
            <Row className="justify-content-center mb-5 mb-lg-6">
              <Col xs={12} className="text-center">
                <h2 className="px-lg-5">Our Focus</h2>
                <p className="lead px-lg-8">We focus on providing our powerful services to these domains:</p>
              </Col>
            </Row>
            <Row className="justify-content-center">
              {focusData.map((item, index) => <this.FocusBoxes key={`features-${index}`} {...item} />)}
            </Row>
          </Container>
        </section>

        <footer className="footer section-md bg-soft pt-lg-6" id="contact">
          <Container>
            <Row>
              <Col md={4}>
                <Navbar.Brand as={HashLink} to="#home" className="me-lg-3 mb-3 d-flex align-items-center">
                  <Image src={ZealHero} />
                  <span className="ms-2 brand-text">Zeal</span>
                </Navbar.Brand>
                <p>Zeal helps you find your perfect team members, so you can focus more on what you are good at.</p>
              </Col>
              <Col xs={6} md={2} className="mb-5 mb-lg-0">
              </Col>
              <Col xs={6} md={2} className="mb-5 mb-lg-0">
              </Col>
              <Col xs={12} md={4} className="mb-5 mb-lg-0">
                <span className="h5 mb-3 d-block">Subscribe</span>
                <form action="#">
                  <div className="form-row mb-2">
                    <div className="col-12">
                      <input type="email" className="form-control mb-2" placeholder="example@company.com" name="email" aria-label="Subscribe form" onChange={(event) => this.setState({ subscriber: event.target.value })} onFocus={() => {this.setState({successSubscribe: false})}} />
                    </div>
                    <div className="col-12">
                      {
                        this.state.errors.length > 0 ?
                          <Alert variant="warning">
                            <ul>
                              {this.state.errors.map((x, index) => <li key={`error_${index}`}>{x}</li>)}
                            </ul>
                          </Alert>
                          :
                          ((this.state.successSubscribe && (this.state.subscriber != null)) ?
                            <Alert variant="success">
                              <ul>
                                {this.state.subscriber} registered successfully
                              </ul>
                            </Alert>
                            :
                            ""
                          )
                      }
                    </div>
                    <div className="col-12">
                      <button type="button" className="btn btn-secondary text-dark shadow-soft btn-block" data-loading-text="Sending" onClick={this.sendSubscriber}>
                        <span>Subscribe</span>
                      </button>
                    </div>
                  </div>
                </form>
                <p className="text-muted font-small m-0">We’ll never share your details. See our <Card.Link href="#">Privacy Policy</Card.Link></p>
              </Col>
            </Row>
            <hr className="bg-gray my-5" />
            <Row>
              <Col className="mb-md-2">
                <Image src={ZealHero} height={35} className="d-block mx-auto mb-3" alt="Themesberg Logo" />
                <div className="d-flex text-center justify-content-center align-items-center" role="contentinfo">
                  <p className="font-weight-normal font-small mb-0">Copyright © Zeal. All rights reserved.</p>
                </div>
              </Col>
            </Row>
          </Container>
        </footer>
      </div>
    );
  }
};

export default ZealHome