import React, { Component } from "react";
import {API_BASE_URL} from "../constants";
import SockJsClient from 'react-stomp';
import AuthService from "../services/auth.service";
import authHeader from "../services/auth-header";
export default class ReviewCommentsComponent extends Component {
    constructor(props) {
        super(props);
        this.onChangeCommentText = this.onChangeCommentText.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.state = {
            content: "",
            currentUser: AuthService.getCurrentUser(),
            reviewId: null,
            commentText: "",
            comments: [],
        };
    }
    componentDidMount() {
        this.setState({
            reviewId: this.props.reviewId,
        })
    }

    onChangeCommentText(e) {
        this.setState({
            commentText: e.target.value
        });
    }

    sendMessage() {
        try {
            this.clientRef.sendMessage('/app/comment', JSON.stringify({'reviewId': this.state.reviewId,
                'commentText': this.state.commentText,
                'authorName': this.state.currentUser.username
            }));
        } catch (e) {
            console.log("Sending error");
        }
    }


    render() {
        const header = authHeader();
        return (
            <div className="container">
                <SockJsClient url={API_BASE_URL + 'comment-websocket'} topics={['/topic/comment/' + this.state.reviewId]}
                              onMessage={(msg) => { console.log(msg); }}
                              onConnect={ () => { console.log("connected!") } }
                              ref={ (client) => { this.clientRef = client }}
                              headers = {header}
                              />
                <input value={this.state.commentText} onChange={this.onChangeCommentText}/>
                <button type="button" onClick={this.sendMessage}>Send comment</button>
            </div>
        );
    }
}
