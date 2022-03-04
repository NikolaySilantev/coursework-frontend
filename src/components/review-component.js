import React, {Component} from "react";
import ReviewService from "../services/review.service";
import MarkdownPreview from '@uiw/react-markdown-preview';

export default class ReviewComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            review: null,
            message: ""
        };
    }

    componentDidMount() {
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
    render() {
        const review = this.state.review;
        return (
            <div>
            {review && (
                <div className="container">
                    <p>{review.title}</p>
                    <MarkdownPreview source={review.full_text} />
                </div>
            )}
            </div>
        );
    }
}
