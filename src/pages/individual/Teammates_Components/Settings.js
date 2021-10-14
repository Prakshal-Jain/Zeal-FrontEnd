import React from "react";
import { Col, Row, Alert } from '@themesberg/react-bootstrap';

class Settings extends React.Component {
    constructor(props) {
      super(props);
    }

    render(){
        return(
            <div>
                <Row className={"m-3"}>
                    <Col>
                        <Alert variant="danger">
                            If you are not sure about these settings, please ignore this section.
                        </Alert>
                    </Col>
                </Row>

                <Row className={"m-3"}>
                    <Col>
                        <h5>temperature</h5>
                        <p className="mb-0">What sampling temperature to use. Higher values means the model will take more risks.</p>
                        <p className="mb-0">Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer.</p>
                        <p className="mb-0">We generally recommend altering this or top_p but not both.</p>
                        <input type="range" onChange={(event) => this.props.changeSettings('temperature', event.target.value)} style={{width: "80%"}} value={this.props.settings.temperature*100} className={"me-2"} />
                        {this.props.settings.temperature}
                    </Col>
                </Row>

                <Row className={"m-3"}>
                    <Col>
                        <h5>top_p</h5>
                        <p className="mb-0">An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass.</p>
                        <p className="mb-0">So 0.1 means only the tokens comprising the top 10% probability mass are considered.</p>
                        <p className="mb-0">We generally recommend altering this or temperature but not both.</p>
                        <input type="range" onChange={(event) => this.props.changeSettings('topP', event.target.value)} style={{width: "80%"}} value={this.props.settings.topP*100} className={"me-2"} />
                        {this.props.settings.topP}
                    </Col>
                </Row>

                <Row className={"m-3"}>
                    <Col>
                        <h5>frequency_penalty</h5>
                        <p className="mb-0">Number between 0 and 1 that penalizes new tokens based on their existing frequency in the text so far.</p>
                        <p className="mb-0">Decreases the model's likelihood to repeat the same line verbatim.</p>
                        <input type="range" onChange={(event) => this.props.changeSettings('frequencyPenalty', event.target.value)} style={{width: "80%"}} value={this.props.settings.frequencyPenalty*100} className={"me-2"} />
                        {this.props.settings.frequencyPenalty}
                    </Col>
                </Row>

                <Row className={"m-3"}>
                    <Col>
                        <h5>presence_penalty</h5>
                        <p className="mb-0">Number between 0 and 1 that penalizes new tokens based on whether they appear in the text so far.</p>
                        <p className="mb-0">Increases the model's likelihood to talk about new topics.</p>
                        <input type="range" onChange={(event) => this.props.changeSettings('presencePenalty', event.target.value)} style={{width: "80%"}} value={this.props.settings.presencePenalty*100} className={"me-2"} />
                        {this.props.settings.presencePenalty}
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Alert variant="warning" className={"m-3"}> 
                            For more details, please visit <a href={"https://beta.openai.com/docs/api-reference/completions/create"} target={"_blank"}>https://beta.openai.com/docs/api-reference/completions/create</a>
                        </Alert>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Settings