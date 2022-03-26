import React, { Component } from "react";
import {API_BASE_URL} from "../constants";
import SockJsClient from 'react-stomp';
import AuthService from "../services/auth.service";
import authHeader from "../services/auth-header";
import CommentService from "../services/comment.service";
import Moment from "moment";
import {Link} from "react-router-dom";
export default class ReviewCommentsComponent extends Component {
    constructor(props) {
        super(props);
        this.onChangeCommentText = this.onChangeCommentText.bind(this);
        this.sortByDate = this.sortByDate.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.reply = this.reply.bind(this);


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
            this.sortByDate()
        });
    }

    onChangeCommentText(e) {
        this.setState({
            commentText: e.target.value
        });
    }

    sortByDate() {
        this.setState({
            comments: this.state.comments.sort((a, b) => {
                return new Date(a.releaseDate) - new Date(b.releaseDate)
            }),
        })
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
        this.setState({
            comments: [...this.state.comments, msg]
        })
    }

    reply(e) {
        this.setState({
            commentText: e.target.id+ ", "
        })
        const input = document.getElementById("comment-input");
        input.focus()
    }

    render() {
        const header = authHeader();
        return (
            <div>
                <SockJsClient url={API_BASE_URL + 'comment-websocket'} topics={['/topic/comment/' + this.state.reviewId]}
                              onMessage={this.onMessage}
                              onConnect={ () => { console.log("connected!") } }
                              ref={ (client) => { this.clientRef = client }}
                              headers = {header}
                              />
                    <div className="bg-light">
                        <p className="h1">Comments: </p>
                        {this.state.currentUser?(<div className="d-flex flex-row add-comment-section mt-4 mb-4">
                            <input type="text" id="comment-input" className="form-control me-3"
                                   placeholder="Add comment"
                                   value={this.state.commentText}
                                   onChange={this.onChangeCommentText}
                            />
                            <button className="btn btn-primary ms-2 d-flex justify-content-between" type="button"
                                    onClick={this.sendMessage}>
                                <i className="material-icons">
                                    comment
                                </i>
                                <span className="ms-1">
                                    Comment
                                </span>
                            </button>
                        </div>) : (
                            <div className="mb-3 h5">
                                You have to be <Link to={"/login"}>logged in</Link> for posting comments
                            </div>
                        )}

                        {this.state.comments.length!==0 ? this.state.comments.map((comment, index) =>
                            <div key={index} className="commented-section bg-white mt-2 mb-2 rounded p-3 shadow">
                                <div className="d-flex flex-row align-items-center commented-user">
                                    <h5 className="me-2">
                                        <Link
                                            to={`/profile/${comment.authorName}`}
                                            style={{textDecoration: 'none'}}
                                            className="link-dark card-title"
                                        >
                                            {comment.authorName}
                                            {comment.authorImgUrl ?
                                                (<img className="" src="{review.authorImgUrl}" alt="..."/>)
                                                :
                                                (<i className="material-icons align-bottom">face</i>)
                                            }
                                        </Link>
                                    </h5>
                                    <span className="mb-1 ms-2 text-muted">
                                        {Moment(comment.releaseDate.toString()).format('MMMM Do YYYY, h:mm:ss a')}
                                    </span>
                                </div>
                                <div className="comment-text-sm">
                                    <span>{comment.commentText}</span>
                                </div>
                                <div className="reply-section">
                                    <div className="d-flex flex-row align-items-center voting-icons">
                                        <a className="text-primary mt-1" type="button" id={comment.authorName} onClick={this.reply}>Reply</a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-2 h5">
                                There is no comments now...
                                <i className="material-icons h3 align-middle ms-2 me-2">
                                    mood_bad
                                </i>
                                Be first!
                            </div>
                        )}
                    </div>
            </div>
        );
    }
}
