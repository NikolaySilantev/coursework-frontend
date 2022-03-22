import React, {Component} from "react";
import {Link} from "react-router-dom";
import Moment from "moment";

export default class ReviewListComponent extends Component {
    constructor(props) {
        super(props);
        this.sortByScore = this.sortByScore.bind(this);
        this.sortByDate = this.sortByDate.bind(this);
        this.state = {
            message: "",
            reviews: [],
            userScoreDesc: false,
            releaseDateDesc: false
        };
    }

    componentDidMount() {
        this.setState({
            reviews: this.props.reviews
        })
    }

    sortByScore() {
        this.setState({
            reviews: this.state.reviews.sort((a, b) => {
                return this.state.userScoreDesc ? a.userScore - b.userScore : b.userScore - a.userScore
            }),
            userScoreDesc: !this.state.userScoreDesc
        })
    }

    sortByDate() {
        this.setState({
            reviews: this.state.reviews.sort((a, b) => {
                return this.state.releaseDateDesc ? new Date(a.releaseDate) - new Date(b.releaseDate)
                    : new Date(b.releaseDate) - new Date(a.releaseDate)
            }),
            releaseDateDesc: !this.state.releaseDateDesc
        })
    }


    render() {
        return (
            <div className="container">
                {this.state.reviews.length !== 0 && (
                    <div>
                        <div>
                            Sort by:
                            <a href="#" className="link-dark m-lg-2" onClick={this.sortByDate}>Date</a>
                            <a href="#" className="link-dark" onClick={this.sortByScore}>User score</a>
                        </div>
                        <div className="row">
                            {

                                this.state.reviews.map((review, review_index) =>
                                    <div key={review_index} className="card" style={{"width": "18rem"}}>
                                        <div className="card-body">
                                            <img src="https://media1.giphy.com/media/TcdpZwYDPlWXC/giphy.gif"
                                                 className="card-img-top" alt="..."/>
                                            <Link
                                                to={`/review/details/${review.id}`}
                                                style={{textDecoration: 'none'}}
                                                className="link-dark"
                                            >
                                                <h5 className="card-title">{review.title}</h5>
                                            </Link>
                                            <p className="card-text">{review.full_text}</p>
                                            <p className="card-text">{review.userScore}</p>
                                            {review.releaseDate && (<p>Release
                                                date: {Moment(review.releaseDate.toString()).format('MMMM Do YYYY, h:mm:ss a')}</p>)}

                                            <Link
                                                to={`/profile/${review.authorName}`}
                                                style={{textDecoration: 'none'}}
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
                    </div>
                )}
            </div>
        );
    }
}
