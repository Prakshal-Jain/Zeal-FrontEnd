import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faTimesCircle, faTrash, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Nav, Tab } from '@themesberg/react-bootstrap';
import { Col, Row, Form, Breadcrumb, Container, Button, Alert, Badge } from '@themesberg/react-bootstrap';
import OpenAI from 'openai-api'
import Settings from './Teammates_Components/Settings'
import WorldMap from './Teammates_Components/WorldMap'

class SearchTeammates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keywords: [],
      locations: [],
      userMessage: "",
      editing: -1,
      tempKeyword: "",
      settings: {
        engine: 'davinci',
        maxTokens: 60,
        temperature: 0.8,
        topP: 1,
        presencePenalty: 0,
        frequencyPenalty: 0.8,
        bestOf: 1,
        n: 1,
        stream: false,
        stop: ['\n'],
      },
      emptyMessageFlag: false,
      world_map: { "Afghanistan": false, "Angola": false, "Albania": false, "United Arab Emirates": false, "Argentina": false, "Armenia": false, "French Southern and Antarctic Lands": false, "Australia": false, "Austria": false, "Azerbaijan": false, "Burundi": false, "Belgium": false, "Benin": false, "Burkina Faso": false, "Bangladesh": false, "Bulgaria": false, "Bahamas": false, "Bosnia and Herzegovina": false, "Belarus": false, "Belize": false, "Bolivia": false, "Brazil": false, "Brunei Darussalam": false, "Bhutan": false, "Botswana": false, "Central African Republic": false, "Canada": false, "Switzerland": false, "Chile": false, "China": false, "CÃ´te d'Ivoire": false, "Cameroon": false, "Democratic Republic of the Congo": false, "Republic of Congo": false, "Colombia": false, "Costa Rica": false, "Cuba": false, "Northern Cyprus": false, "Cyprus": false, "Czech Republic": false, "Germany": false, "Djibouti": false, "Denmark": false, "Dominican Republic": false, "Algeria": false, "Ecuador": false, "Egypt": false, "Eritrea": false, "Spain": false, "Estonia": false, "Ethiopia": false, "Finland": false, "Fiji": false, "Falkland Islands": false, "France": false, "Gabon": false, "United Kingdom": false, "Georgia": false, "Ghana": false, "Guinea": false, "The Gambia": false, "Guinea-Bissau": false, "Equatorial Guinea": false, "Greece": false, "Greenland": false, "Guatemala": false, "Guyana": false, "Honduras": false, "Croatia": false, "Haiti": false, "Hungary": false, "Indonesia": false, "India": false, "Ireland": false, "Iran": false, "Iraq": false, "Iceland": false, "Israel": false, "Italy": false, "Jamaica": false, "Jordan": false, "Japan": false, "Kazakhstan": false, "Kenya": false, "Kyrgyzstan": false, "Cambodia": false, "Republic of Korea": false, "Kosovo": false, "Kuwait": false, "Lao PDR": false, "Lebanon": false, "Liberia": false, "Libya": false, "Sri Lanka": false, "Lesotho": false, "Lithuania": false, "Luxembourg": false, "Latvia": false, "Morocco": false, "Moldova": false, "Madagascar": false, "Mexico": false, "Macedonia": false, "Mali": false, "Myanmar": false, "Montenegro": false, "Mongolia": false, "Mozambique": false, "Mauritania": false, "Malawi": false, "Malaysia": false, "Namibia": false, "New Caledonia": false, "Niger": false, "Nigeria": false, "Nicaragua": false, "Netherlands": false, "Norway": false, "Nepal": false, "New Zealand": false, "Oman": false, "Pakistan": false, "Panama": false, "Peru": false, "Philippines": false, "Papua New Guinea": false, "Poland": false, "Puerto Rico": false, "Dem. Rep. Korea": false, "Portugal": false, "Paraguay": false, "Palestine": false, "Qatar": false, "Romania": false, "Russian Federation": false, "Rwanda": false, "Western Sahara": false, "Saudi Arabia": false, "Sudan": false, "South Sudan": false, "Senegal": false, "Solomon Islands": false, "Sierra Leone": false, "El Salvador": false, "Somaliland": false, "Somalia": false, "Serbia": false, "Suriname": false, "Slovakia": false, "Slovenia": false, "Sweden": false, "Swaziland": false, "Syria": false, "Chad": false, "Togo": false, "Thailand": false, "Tajikistan": false, "Turkmenistan": false, "Timor-Leste": false, "Trinidad and Tobago": false, "Tunisia": false, "Turkey": false, "Taiwan": false, "Tanzania": false, "Uganda": false, "Ukraine": false, "Uruguay": false, "United States": false, "Uzbekistan": false, "Venezuela": false, "Vietnam": false, "Vanuatu": false, "Yemen": false, "South Africa": false, "Zambia": false, "Zimbabwe": false },
      currentlyNavActive: "message"
    }
  }

  warnings = {
    "choose_location": (<div>We recommend choosing location for better results. Please click on &quot;Choose locations&quot; tab to do so. Click &quot;Search&quot; button below to continue.</div>),
    "edit_keywords": (<div>If you feel any keyword(s) are not useful to search for your teammate, please remove them using the <FontAwesomeIcon icon={faTimesCircle} /> icon. Click on the keyword to edit. Click <FontAwesomeIcon icon={faCheckCircle} /> when done.</div>),
    "empty_message_warning": (<div>Please enter some more text to proceed...</div>)
  }

  openai = new OpenAI("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");

  cleanText = (text) => {
    var clean = text.trim();
    var arr = clean.split(", ").filter(x => (x.length != 0))

    return arr
  }

  changeSettings = (key, value) => {
    var current = this.state.settings;
    current[key] = value / 100;
    this.setState({ settings: current });
  }

  getKeywords = async () => {
    if (this.state.userMessage == "") {
      this.setState({ emptyMessageFlag: true, })
    }
    else {
      var all_settings = this.state.settings;
      all_settings['prompt'] = `Text: ${this.state.userMessage.replace(/\n|\r/g, "")}\nKeywords: `;
      const gptResponse = await this.openai.complete(all_settings);
      var choices = gptResponse.data.choices[0].text
      this.setState({ keywords: this.cleanText(choices), emptyMessageFlag: false, currentlyNavActive: "results" })
    }
  }

  removeKeywords = (keyword) => {
    var all_items = this.state.keywords;
    all_items = all_items.filter(x => x != keyword);
    this.setState({ keywords: all_items });
  }

  editKeyword = (event) => {
    this.setState({ editing: event.target.id, tempKeyword: event.target.innerHTML })
  }

  saveKeyword = (index) => {
    var all_items = this.state.keywords;
    all_items[index] = this.state.tempKeyword
    this.setState({ keyword: all_items, editing: -1 })
  }

  renderKeywords = () => {
    var keys = []
    var counter = 0
    for (let items of this.state.keywords) {
      keys.push(<Badge bg="primary" className="badge-lg me-2"><div className={"d-inline me-2"} id={counter} contentEditable={true} onInput={this.editKeyword}>{items}</div>{(this.state.editing != counter) ? <FontAwesomeIcon icon={faTimesCircle} onClick={() => this.removeKeywords(items)} style={{ cursor: 'pointer' }} /> : <FontAwesomeIcon icon={faCheckCircle} id={counter} onClick={(event) => this.saveKeyword(event.target.id)} style={{ cursor: 'pointer' }} />}</Badge>)
      counter += 1
    }
    return keys;
  }

  setCountry = (country, element) => {
    var all_countries = this.state.world_map;
    all_countries[country] = !(all_countries[country])
    if (all_countries[country]) {
      element.style.fill = "#5cb85c"
    }
    else {
      element.style.fill = "transparent"
    }
    this.setState({ world_map: Object.assign(this.state.world_map, all_countries) })
  }

  selectAllCountries = (isSelected) => {
    var all_countries = this.state.world_map;
    for (let [key, value] of Object.entries(all_countries)) {
      all_countries[key] = isSelected;
    }
    this.setState({ world_map: Object.assign(this.state.world_map, all_countries) })
  }

  renderInputForm = () => {
    return (
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Enter your requirements here</Form.Label>
          <Form.Control as="textarea" rows="4" placeholder={"Please describe your needs as naturally as possible here..."} value={this.state.userMessage} onChange={(event) => this.setState({ userMessage: event.target.value })} />
          {this.state.emptyMessageFlag && !this.state.keywords.length ?
            <Row>
              <Col>
                <Alert variant="warning" className={"m-3"}>
                  {this.warnings["empty_message_warning"]}
                </Alert>
              </Col>
            </Row>
            :
            ""
          }
        </Form.Group>

        <Row>
          <Col className={"d-flex flex-row-reverse"}>
            <Button variant="outline-danger" className="m-1" onClick={() => this.setState({ userMessage: "", keywords: [], locations: [], editing: -1, tempKeyword: "", emptyMessageFlag: false })}>
              <FontAwesomeIcon icon={faTrash} className="me-2" /> Clear
            </Button>
            <Button variant="outline-success" className="m-1" onClick={this.getKeywords}>
              <FontAwesomeIcon icon={faSearch} className="me-2" /> Search
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }

  renderResults = () => {
    return (
      <div>
        <Row>
          <Col>
            {this.renderKeywords()}
          </Col>
        </Row>
        {!(this.state.keywords.length) || this.state.locations.length ?
          <div>Please enter your search message. Click on &quot;Search message&quot; tab to do so.</div>
          :
          <div>
            <Row>
              <Col>
                <Alert variant="warning" className={"m-3"}>
                  {this.warnings["edit_keywords"]}
                </Alert>
              </Col>
            </Row>
            <Row>
              <Col>
                <Alert variant="info" className={"m-3"}>
                  {this.warnings["choose_location"]}
                </Alert>
              </Col>
            </Row>
          </div>
        }
      </div>
    )
  }

  render() {
    return (
      <div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
          <div className="d-block mb-4 mb-md-0">
            <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
              <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
              <Breadcrumb.Item active>Search Teammates</Breadcrumb.Item>
            </Breadcrumb>
            <h4>Search Teammates</h4>
            <p className="mb-0">Express yourself and we will find the best teammates for you!</p>
          </div>
        </div>

        <Container className="px-0">
          <Row className="d-flex flex-wrap flex-md-nowrap align-items-center py-4">
            <Col className="d-block mb-4 mb-md-0">
              <Tab.Container activeKey={this.state.currentlyNavActive}>
                <Nav fill variant="pills" className="flex-column flex-sm-row">
                  <Nav.Item onClick={() => this.setState({ currentlyNavActive: "message" })}>
                    <Nav.Link eventKey="message" className="mb-sm-3 mb-md-0">
                      Search message
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item onClick={() => this.setState({ currentlyNavActive: "location" })}>
                    <Nav.Link eventKey="location" className="mb-sm-3 mb-md-0">
                      Choose locations
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item onClick={() => this.setState({ currentlyNavActive: "settings" })}>
                    <Nav.Link eventKey="settings" className="mb-sm-3 mb-md-0">
                      Search Settings
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item onClick={() => this.setState({ currentlyNavActive: "results" })}>
                    <Nav.Link eventKey="results" className="mb-sm-3 mb-md-0">
                      Results
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content>
                  <Tab.Pane eventKey="message" className="py-4">
                    {this.renderInputForm()}
                  </Tab.Pane>
                  <Tab.Pane eventKey="location" className="py-4">
                    <WorldMap world_map={this.state.world_map} setCountry={this.setCountry} selectAllCountries={this.selectAllCountries} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="settings" className="py-4">
                    <Settings changeSettings={this.changeSettings} settings={this.state.settings} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="results" className="py-4">
                    {this.renderResults()}
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
export default SearchTeammates