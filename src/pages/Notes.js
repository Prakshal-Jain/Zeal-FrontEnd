import React, { Component } from "react";
import { Breadcrumb, Card, Row, Col, Container, Form, Button } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEdit, faTimes, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link, Redirect } from 'react-router-dom';
import axios from "axios";
import { Routes } from "../routes";

class Notes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: null,
            currently_editing: -1,
            isNewNote: false,
        }
    }

    componentDidMount = async () => {
        await this.getNotes()
    }

    getNotes = async () => {
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }

        await axios.get(`notes/`, {
            headers: header
        })
            .then((response) => {
                this.setState({ notes: response.data });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    postNotes = async () => {
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }

        if (this.state.isNewNote) {
            await axios.post(`notes/`, this.state.notes[this.state.currently_editing], {
                headers: header
            })
                .then(async (response) => {
                    await this.getNotes()
                    this.setState({ isNewNote: false })
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        else {
            await axios.put(`notes/`, this.state.notes[this.state.currently_editing], {
                headers: header
            })
                .then((response) => {
                    this.getNotes()
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    createNote = () => {
        var notes_copy = this.state.notes
        notes_copy.push({ "note": "" })
        this.setState({ notes: notes_copy }, () => {
            this.setState({ currently_editing: this.state.notes.length - 1, isNewNote: true })
        })
    }

    deleteNotes = async (index) => {
        if (this.state.notes[index].id == undefined || this.state.notes[index].id == null) {
            var tempdata = this.state.notes;
            tempdata.splice(index, 1);
            this.setState({ notes: tempdata, currently_editing: -1 })
        }
        const header = {
            'Authorization': `Token ${this.props.componentProps.credentials.token}`
        }
        await axios.delete(`notes`,
            {
                data: this.state.notes[index],
                headers: header
            })
            .then(async (response) => {
                this.setState({ currently_editing: -1, isNewNote: false });
                await this.getNotes();
            })
            .catch((error) => {
                console.log(error)
            })
    }

    editNote = (data) => {
        var notes_copy = this.state.notes
        notes_copy[this.state.currently_editing].note = data
        this.setState({ notes: notes_copy })
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

    renderNotes = () => {
        if (this.state.notes == null) {
            return "";
        }
        return (
            this.state.notes.map((note_dict, index) => (
                <Row key={`note_${index}`}>
                    <Col key={`notes-${index}`}>
                        <Card>
                            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                                <div>
                                    <Card.Body>
                                        <h5 className={"mb-md-0"}>{this.truncateString(note_dict.note, 20)}</h5>
                                    </Card.Body>
                                </div>
                                {(this.state.currently_editing == -1) ?
                                    <div>
                                        <Card.Body>
                                            <FontAwesomeIcon icon={faEdit} onClick={() => { this.setState({ currently_editing: index }) }} className={"m-2 pointer_cursor"} />
                                            <FontAwesomeIcon icon={faTrashAlt} onClick={() => this.deleteNotes(index)} className={"m-2 pointer_cursor"} />
                                        </Card.Body>
                                    </div>
                                    :
                                    ""
                                }
                            </div>
                        </Card>
                    </Col>
                </Row>
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
                            <Breadcrumb.Item active>Notes</Breadcrumb.Item>
                        </Breadcrumb>
                        <h4>Notes</h4>
                        <p className="mb-0">Jot down your precious ideas and thoughts here.</p>
                    </div>
                </div>

                <Container className="px-0">
                    <Button variant="secondary" className="m-3" onClick={this.createNote}>
                        <FontAwesomeIcon icon={faPlus} className="me-2" /> New Note
                    </Button>
                    <Row>
                        <Col xs={(this.state.currently_editing != -1) ? 3 : 12} className={"animate-all"}>
                            {this.renderNotes()}
                        </Col>
                        <Col className={`${(this.state.currently_editing != -1) ? "scale-up-animation" : "scale-down-animation"}`}>
                            <Card border="light" className="shadow-sm">
                                <Card.Header className="border-bottom border-light d-flex justify-content-between">
                                    <Col xs={9}>
                                        <Button variant="outline-success" size={"sm"} onClick={this.postNotes}>Save</Button>
                                        <Button variant="outline-danger" className={"ms-3"} size={"sm"} onClick={() => this.deleteNotes(this.state.currently_editing)}>Delete</Button>
                                    </Col>
                                    <Col className={"middle-align d-flex flex-row-reverse pointer_cursor"} onClick={() => { this.setState({ currently_editing: -1 }) }}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </Col>
                                </Card.Header>
                                <Form.Control as="textarea" rows={7} style={{ borderTopLeftRadius: "0em", borderTopRightRadius: "0em" }} placeholder={"Enter notes here..."} value={(this.state.currently_editing != -1) ? this.state.notes[this.state.currently_editing].note : ""} onChange={(event) => this.editNote(event.target.value)} />
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Notes