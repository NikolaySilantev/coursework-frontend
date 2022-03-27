import React, {Component} from "react";
import ReviewService from "../services/review.service";
import MarkdownPreview from '@uiw/react-markdown-preview';
import AuthService from "../services/auth.service";
import {Link} from "react-router-dom";
import {Rating} from "react-simple-star-rating";
import RatingService from "../services/rating.service";
import Moment from 'moment';
import ImageCarouselComponent from "./image-carousel-component";
import ReviewCommentsComponent from "./review-comments-component";

export default class ReviewComponent extends Component {
    constructor(props) {
        super(props);
        this.handleLike = this.handleLike.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleRating = this.handleRating.bind(this);

        this.state = {
            id: this.props.match.params.id,
            currentUser: AuthService.getCurrentUser(),
            review: null,
            message: "",
            rating: 0,
            like: null,
            likeCount: 0
        };
    }

    componentDidMount() {
        if (AuthService.getCurrentUser()) {
            RatingService.getUserRating(AuthService.getCurrentUser().id, this.state.id).then(
                response => {
                    this.setState({
                        rating: response.data
                    });
                })
            RatingService.getUserLike(AuthService.getCurrentUser().id, this.state.id).then(
                response => {
                    this.setState({
                        like: response.data
                    });
                })
        }
        ReviewService.getReview(this.state.id).then(
            response => {
                this.setState({
                    review: response.data,
                    likeCount: response.data.likeCount
                });
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                this.setState({
                    message: resMessage
                });
            }
        );
    }

    handleRating(rate) {
        this.setState({
            rating: rate
        });
        RatingService.rateReviewSubject(AuthService.getCurrentUser().id, this.state.id, rate)
    }

    handleLike() {
        RatingService.likeReview(AuthService.getCurrentUser().id, this.state.id).then(
            r => this.setState({
                message: r.data,
                like: !this.state.like,
                likeCount: this.state.like ? this.state.likeCount - 1 : this.state.likeCount + 1
            }))
    }

    handleDelete() {
        ReviewService.deleteReview(this.state.id).then(
            r => {
                this.setState({
                    message: r.data
                })
                this.props.history.push("/home");
                window.location.reload();
            })

    }


    render() {
        const review = this.state.review;
        const currentUser = this.state.currentUser;
        const username = currentUser ? currentUser.username : null;
        return (
            <div>
                {review && (
                    <div className="container">
                        <h3>
                            <Link
                                to={`/profile/${review.authorName}`}
                                style={{textDecoration: 'none'}}
                                className="link-dark"
                            >
                                {review.authorName}
                                {review.authorImgUrl ?
                                    (<img className="" src="{review.authorImgUrl}" alt="..."/>)
                                    :
                                    (<i className="material-icons align-middle h1">face</i>)
                                }
                            </Link>
                        </h3>
                        <p className="fw-bold">{review.category}</p>
                        <h1>{review.title}</h1>
                        {review.releaseDate && (<p className="text-muted">Release
                            date: {Moment(review.releaseDate.toString()).format('MMMM Do YYYY, h:mm:ss a')}</p>)}
                        <div>
                            <p className="h5">
                                Author score: {review.authorScore / 20}
                                <i className="material-icons align-middle h2 text-warning">
                                    star_rate
                                </i>
                            </p>
                        </div>
                        <MarkdownPreview source={review.full_text}/>
                        <div className="mt-2">
                            <ImageCarouselComponent images={review.imageUrls} key={review.imageUrls.length}/>
                        </div>
                        {review.tags.length !== 0 && (<div className="mt-2">
                            Tags:
                            {
                                review.tags.map((tag, tag_index) =>
                                    <span className="badge bg-secondary ms-1" key={tag_index}>
                                        <Link
                                            className="link-light"
                                            style={{textDecoration: 'none'}}
                                            to={`/review/tag/${tag}`}
                                        >
                                            {tag}
                                        </Link>
                                    </span>
                                )
                            }
                        </div>)}
                        <div className="d-flex justify-content-between mt-4">
                            <div>
                                <p className="h5">
                                    User scores: {(review.userScore / 20).toFixed(2)}
                                    <i className="material-icons align-middle h2 text-warning">
                                        star_rate
                                    </i>
                                </p>
                            </div>
                            <div>
                                <div className="d-flex justify-content-end">
                                    {this.state.currentUser ? (<i className="align-top">
                                        Hit your own rating!
                                        <Rating onClick={this.handleRating}
                                                ratingValue={this.state.rating}
                                        />
                                    </i>) : (<div><Link to={"/login"}>Login</Link> to rate this</div>)}
                                </div>
                                {this.state.currentUser ? (<div className="d-flex justify-content-end">
                                    {
                                        this.state.like ?
                                            (
                                                <div>
                                                    <i>Keep it up!</i>
                                                    <button className="btn btn-outline shadow-none" name="block"
                                                            data-bs-toggle="tooltip" title="Dislike"
                                                            onClick={this.handleLike}>
                                                        <i className="material-icons text-primary h2 align-middle">favorite</i>
                                                        <span className="h2 align-top">{this.state.likeCount}</span>
                                                    </button>
                                                </div>
                                            )
                                            :
                                            (
                                                <div>
                                                    <i>Did you enjoy this review?</i>
                                                    <button className="btn btn-outline shadow-none" name="block"
                                                            data-bs-toggle="tooltip" title="Dislike"
                                                            onClick={this.handleLike}>
                                                        <i className="material-icons text-primary h2 align-middle">favorite_border</i>
                                                        <span className="h2 align-top">{this.state.likeCount}</span>
                                                    </button>
                                                </div>
                                            )
                                    }
                                </div>) : (
                                    <div className="btn btn-outline shadow-none d-flex justify-content-end">
                                        <i className="material-icons text-primary h2 align-middle">favorite</i>
                                        <span className="h2">{this.state.likeCount}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {(username === review.authorName || this.props.isAdmin) && (
                            <div className="d-flex justify-content-end">
                                <i className="m-2">It looks like you are the author. You can:</i>
                                <Link
                                    className="btn btn-primary"
                                    to={`/review/edit/${this.props.match.params.id}`}>

                                    <div className="d-flex justify-content-between">
                                        <i className="material-icons align-middle">
                                            edit
                                        </i>
                                        <span>
                                            Edit review
                                        </span>
                                    </div>
                                </Link>
                                <button
                                    className="btn btn-danger btn-block"
                                    onClick={this.handleDelete}
                                >
                                    <i className="material-icons align-middle">
                                        delete
                                    </i>
                                    <span>
                                        Delete review
                                    </span>
                                </button>
                            </div>
                        )}
                        <ReviewCommentsComponent reviewId={this.props.match.params.id}/>
                    </div>
                )}
            </div>
        );
    }
}
