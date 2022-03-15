import React, {Component} from "react";
import {Link} from "react-router-dom";

export default class ReviewListComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ""
        };
    }

    render() {
        const reviews = this.props.reviews;
        return (
            <div className="container">
                {reviews && (
                <div className="row">
                {
                    reviews.map((review, review_index) =>
                    <div key={review_index} className="card" style={{"width":"18rem"}}>
                            <div className="card-body">
                                <img src="https://media1.giphy.com/media/TcdpZwYDPlWXC/giphy.gif" className="card-img-top" alt="..."/>
                                <Link
                                    to={`/review/details/${review.id}`}
                                    style={{ textDecoration: 'none' }}
                                    className="link-dark"
                                >
                                <h5 className="card-title">{review.title}</h5>
                                </Link>
                                <p className="card-text">{review.full_text}</p>
                                <Link
                                    to={`/profile/${review.authorName}`}
                                    style={{ textDecoration: 'none' }}
                                    className="link-dark"
                                >
                                    <h5 className="card-title">{review.authorName}</h5>
                                </Link>
                                <div className="row">
                                    {
                                        review.tags.map((tag, tag_index) =>
                                            <div className="col" key={tag_index}>
                                                <Link
                                                    to={`/review/tag/${tag}`}
                                                >
                                                    {tag}
                                                </Link>
                                            </div>
                                        )
                                    }
                                </div>
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
