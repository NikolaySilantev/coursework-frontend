import React, {Component} from "react";
import ReviewService from "../services/review.service";
import {Link} from "react-router-dom";

export default class ReviewListComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reviews: [],
            message: ""
        };
    }

    componentDidMount() {
        ReviewService.getAllReviews().then(
            response => {
                this.setState({
                    reviews: response.data
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
    render() {
        const reviews = this.state.reviews;
        return (
            <div className="container">
                {reviews && (
                <div className="row">
                {
                    reviews.map((review, index) =>
                    <div key={index} className="card" style={{"width":"18rem"}}>
                            <div className="card-body">
                                <img src="https://media1.giphy.com/media/TcdpZwYDPlWXC/giphy.gif" className="card-img-top" alt="..."/>
                                <Link
                                    to={`/review/${review.id}`}
                                    style={{ textDecoration: 'none' }}
                                    className="link-dark"
                                >
                                <h5 className="card-title">{review.title}</h5>
                                </Link>
                                <p className="card-text">{review.full_text}</p>
                            </div>
                    </div>
                    )
                }
                </div>
                )}
            </div>
        );
    }
}
