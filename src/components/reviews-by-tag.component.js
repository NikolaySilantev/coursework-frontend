import React, {Component} from "react";
import ReviewListComponent from "./review-list-component";
import ReviewService from "../services/review.service";

export default class ReviewsByTagComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tag:this.props.match.params.tag,
            reviews: []
        };
    }
    componentDidMount() {
        ReviewService.getReviewByTag(this.state.tag).then(
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
            return (
            <div className="container">
                <header className="jumbotron">
                    <h3>{this.state.content}</h3>
                </header>
                <ReviewListComponent reviews={this.state.reviews} key={this.state.reviews.length}/>
            </div>
        );
    }
}
