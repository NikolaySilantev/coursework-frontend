import React, {Component} from "react";
import {Link} from "react-router-dom";
import Moment from "moment";
import MarkdownPreview from "@uiw/react-markdown-preview";
import ImageCarouselComponent from "./image-carousel-component";

export default class ReviewListComponent extends Component {
    constructor(props) {
        super(props);
        this.sortByScore = this.sortByScore.bind(this);
        this.sortByDate = this.sortByDate.bind(this);
        this.state = {
            message: "",
            reviews: [],
            sortedByScore: false,
            sortedByDate: false,
            userScoreDesc: false,
            releaseDateDesc: false,
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
            userScoreDesc: !this.state.userScoreDesc,
            sortedByScore: true,
            sortedByDate: false
        })
    }

    sortByDate() {
        this.setState({
            reviews: this.state.reviews.sort((a, b) => {
                return this.state.releaseDateDesc ? new Date(a.releaseDate) - new Date(b.releaseDate)
                    : new Date(b.releaseDate) - new Date(a.releaseDate)
            }),
            releaseDateDesc: !this.state.releaseDateDesc,
            sortedByScore: false,
            sortedByDate: true
        })
    }


    render() {
        return (
            <div className="container p-3">
                {this.state.reviews.length !== 0 && (
                    <div>
                        <div>
                            Sort by:
                            <a href="#" className="link-dark m-lg-2" onClick={this.sortByDate}>
                                Date
                                {this.state.sortedByDate &&
                                    (
                                        this.state.releaseDateDesc ?
                                            (
                                                <i className="material-icons sort-reflect align-middle">
                                                    sort
                                                </i>
                                            )
                                            :
                                            (
                                                <i className="material-icons align-middle">
                                                    sort
                                                </i>
                                            )
                                    )
                                }
                            </a>
                            <a href="#" className="link-dark" onClick={this.sortByScore}>
                                User score
                                {this.state.sortedByScore &&
                                    (
                                        this.state.userScoreDesc ?
                                            (
                                                <i className="material-icons sort-reflect align-middle">
                                                    sort
                                                </i>
                                            )
                                            :
                                            (
                                                <i className="material-icons align-middle">
                                                    sort
                                                </i>
                                            )
                                    )
                                }

                            </a>
                        </div>
                        {

                            this.state.reviews.map((review, review_index) =>
                                <div key={review_index} className="card mb-3 bg-white">
                                    <div className="card-body d-flex justify-content-between">
                                        <div>
                                            <a
                                                style={{textDecoration: 'none'}}
                                                className="link-dark card-title fw-bold"
                                            >
                                                {review.category}
                                            </a>
                                            <Link
                                                to={`/profile/${review.authorName}`}
                                                style={{textDecoration: 'none'}}
                                                className="link-dark card-title ms-3"
                                            >
                                                {review.authorName}
                                                {review.authorImgUrl ?
                                                    (<img className="" src="{review.authorImgUrl}" alt="..."/>)
                                                    :
                                                    (<i className="material-icons align-bottom">face</i>)
                                                }
                                            </Link>
                                            {review.releaseDate && (
                                                <small className="text-muted ms-3">
                                                    Release
                                                    date: {Moment(review.releaseDate.toString()).format('MMMM Do YYYY, h:mm:ss a')}
                                                </small>
                                            )}
                                        </div>
                                        <span className="ms-3">
                                                Author score: {review.authorScore / 20}
                                            <i className="material-icons align-bottom text-warning">
                                                    star_rate
                                                </i>
                                                User score: {(review.userScore / 20).toFixed(2)}
                                            <i className="material-icons align-bottom text-warning">
                                                    star_rate
                                                </i>
                                            </span>
                                    </div>
                                    <Link
                                        to={`/review/details/${review.id}`}
                                        style={{textDecoration: 'none'}}
                                        className="link-dark card-body"
                                    >
                                        <h5 className="card-title fw-bold">{review.title}</h5>
                                        <MarkdownPreview
                                            className="card-text"
                                            source={review.full_text.split('\n')[0] + '<br /><br />' + "***Hit me to see more...***"}
                                        />
                                    </Link>
                                    {review.tags.length !== 0 && (<div className="card-body">
                                        <div className="card-text">
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
                                        </div>
                                    </div>)}
                                    <ImageCarouselComponent images={review.imageUrls} carouselId={review.id}
                                                            key={review.id}/>
                                </div>
                            )
                        }
                    </div>
                )}
            </div>
        );
    }
}
