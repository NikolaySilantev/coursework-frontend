import React, { Component } from "react";
import {API_BASE_URL} from "../constants";
import SockJsClient from 'react-stomp';
import AuthService from "../services/auth.service";
import authHeader from "../services/auth-header";
import CommentService from "../services/comment.service";
export default class ReviewCommentsComponent extends Component {
    constructor(props) {
        super(props);
        this.onChangeCommentText = this.onChangeCommentText.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.onMessage = this.onMessage.bind(this);
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
        CommentService.getAllComments(this.props.reviewId).then(response => {
            this.setState({
                comments: response.data
            })
        });
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
            console.log("Sending error")
        }
    }

    onMessage(msg) {
        console.log(msg)
        this.setState({
            comments: [...this.state.comments, msg]
        })
        console.log(this.state.comments)
    }

    render() {
        const header = authHeader();
        return (
            <div className="container">
                <SockJsClient url={API_BASE_URL + 'comment-websocket'} topics={['/topic/comment/' + this.state.reviewId]}
                              onMessage={this.onMessage}
                              onConnect={ () => { console.log("connected!") } }
                              ref={ (client) => { this.clientRef = client }}
                              headers = {header}
                              />
                <input value={this.state.commentText} onChange={this.onChangeCommentText}/>
                <button type="button" onClick={this.sendMessage}>Send comment</button>

                <div>
                    {this.state.comments.map((comment, index) =>
                        <div key={index} className="justify-content-between card">
                            <div>{comment.authorName}</div>
                            <div>{comment.commentText}</div>
                            <div>{comment.releaseDate}</div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
