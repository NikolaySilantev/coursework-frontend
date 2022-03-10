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
                    <div>
                        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0"
                                        className="active" aria-current="true" aria-label="Slide 1"/>
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
                                        aria-label="Slide 2"/>
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
                                        aria-label="Slide 3"/>
                            </div>
                            <div className="carousel-inner">
                                {review.imageUrls.map((image, index)=>
                                    index===0 && <div key={index} className="carousel-item active">
                                        <img src={image} className="d-block w-100" alt="..."/>
                                    </div>
                                    ||
                                    <div key={index} className="carousel-item">
                                    <img src={image} className="d-block w-100" alt="..."/>
                                    </div>
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
                </div>
            )}
            </div>
        );
    }
}
