import React, { Component } from "react";
import Graph from "react-graph-vis";
import { Row, Col, Card, Alert } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { Routes } from "../../routes";
import { Link } from 'react-router-dom';

class TeamVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            graph: null,
        }
    }

    componentDidMount = () => {
        this.processGraph()
    }

    colorList = ['#f5e8ff', '#FF9F89', '#fde9ca', '#63b1bd', '#61DAFB']

    options = {
        layout: {
            hierarchical: false
        },
        edges: {
            color: "#000000"
        },
        height: window.screen.height + "px"
    };

    processGraph = () => {
        const json_graph = this.props.location.state.teamInfo
        var nodes = []
        var edges = []
        var counter = 1
        var choose_color = 0
        for (let team of json_graph) {
            nodes.push({ id: counter, label: `${team.owner.first_name} ${team.owner.last_name}`, title: `${team.owner.first_name} ${team.owner.last_name}`, color: this.colorList[choose_color % (this.colorList.length)] });
            const owner_index = counter
            counter += 1;
            for (let others of team.teammates) {
                nodes.push({ id: counter, label: `${others.first_name} ${others.last_name}`, title: `${others.first_name} ${others.last_name}`, color: this.colorList[choose_color % (this.colorList.length)] })
                edges.push({ from: owner_index, to: counter })
                counter += 1
            }
            choose_color += 1
        }
        this.setState({ graph: { nodes: nodes, edges: edges } })
    }

    render() {
        return (
            <div>
                <Row className={"m-3"}>
                    <Col>
                        <Card.Link as={Link} to={{
                            pathname: Routes.OrganizerEventDashboard.path,
                            state: this.props.location.state.back_data
                        }}>
                            <h4><FontAwesomeIcon icon={faArrowCircleLeft} /></h4>
                        </Card.Link>
                    </Col>
                    <Col>
                        <h4>Zeal Team Visualizer</h4>
                    </Col>
                </Row>

                {this.state.graph != null ?
                    <Graph
                        graph={this.state.graph}
                        options={this.options}
                        events={() => { }}
                        getNetwork={network => {
                            //  if you want access to vis.js network api you can set the state in a parent component using this property
                        }}
                    />
                    :
                    <Row>
                        <Col className={"m-3"}>
                            <Alert variant="warning">
                                Cannot load the graph. Please click the back button above or sign in again.
                            </Alert>
                        </Col>
                    </Row>
                }
            </div>
        )
    }

}

export default TeamVisualizer