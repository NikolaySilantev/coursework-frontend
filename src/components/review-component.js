import React, {Component} from "react";
import ReviewService from "../services/review.service";
import MarkdownPreview from '@uiw/react-markdown-preview';
import RatingService from "../services/rating.service";
import AuthService from "../services/auth.service";
import authService from "../services/auth.service";
import {Link} from "react-router-dom";
import redirect from "react-router-dom/es/Redirect";

export default class ReviewComponent extends Component {
    constructor(props) {
        super(props);
        this.handleLike = this.handleLike.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.state = {
            id: this.props.match.params.id,
            review: null,
            message: "",
            // isAdmin: false
        };
    }

    componentDidMount() {
        // this.setState({
        //     isAdmin: AuthService.getCurrentUser().roles.includes("ROLE_ADMIN"),
        // });
        ReviewService.getReview(this.state.id).then(
            response => {
                this.setState({
                    review: response.data
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

    handleLike() {
        RatingService.likeReview(AuthService.getCurrentUser().id, this.state.id).then(
            r => this.setState({
                message: r.data
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
        const username = authService.getCurrentUser().username;
        return (
            <div>
            {review && (
                <div className="container">
                    <h3>{review.authorName}</h3>
                    <p>{review.title}</p>
                    <MarkdownPreview source={review.full_text} />
                    <div>
                        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">

                            <div className="carousel-indicators">
                                {review.imageUrls.map((image, index) =>
                                    (index===0 && <button key = {index} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={index}
                                                        className="active" aria-current="true" aria-label={"Slide " + index + 1}/>)
                                    ||
                                    (<button key = {index} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={index}
                                            aria-label={"Slide " + index + 1}/>)
                                )}
                            </div>

                            <div className="carousel-inner">
                                {review.imageUrls.map((image, index) =>
                                    (index===0 && <div key={index} className="carousel-item active">
                                        <img src={image} className="d-block w-100" alt="..."/>
                                    </div>)
                                    ||
                                    (<div key={index} className="carousel-item">
                                    <img src={image} className="d-block w-100" alt="..."/>
                                    </div>)
                                )}
                            </div>
                            <button className="carousel-control-prev" type="button"
                                    data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"/>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button"
                                    data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"/>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                    <button onClick={this.handleLike}>Like</button>
                    {(username === review.authorName || this.props.isAdmin) && (
                        <div>
                            <Link
                            to={`/review/edit/${this.props.match.params.id}`}>
                                Изменить
                            </Link>
                            <button
                                className="btn btn-danger btn-block"
                                onClick={this.handleDelete}
                            >
                                <span>Delete review</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
            </div>
        );
    }
}
