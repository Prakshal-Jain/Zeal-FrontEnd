import React from "react";
import { Row, Col, Card } from '@themesberg/react-bootstrap';

// 1. isMine: boolean to tell if chat message is from sender
// 2. bg_color: background color of message mubble
// 3. message: Text message string

class ChatBubble extends React.Component {
    render() {
        return (
            <Row>
                <Col className={`d-flex ${this.props.isMine ? "flex-row-reverse" : ""}`}>
                    <Card.Img src={this.props.profile_image} alt={this.props.username} className="user-avatar small-avatar" />
                    <div className={`chatbubble ${this.props.isMine ? "my-bubble" : "others-bubble"}`}>
                        {this.props.message}
                        <div className={"d-flex flex-row-reverse small"}>
                            {this.props.time}
                        </div>
                    </div>
                </Col>
            </Row>
        )
    }
}

export default ChatBubble