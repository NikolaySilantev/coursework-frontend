import React, { Component } from "react";
import ReviewListComponent from "./review-list-component";
import ReviewService from "../services/review.service";
import { TagCloud } from 'react-tagcloud'
import TagService from "../services/tag.service";
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: "",
            reviews: [],
            topTags: []
        };
    }
    componentDidMount() {
        TagService.getTopTags().then(
            response => {
                let responseMap = new Map(Object.entries(response.data));
                responseMap.forEach((k,v) => {
                    this.state.topTags.push({ value: v, count: k })
                })
            })
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
        const data = this.state.topTags;
        return (
            <div className="container">
                <header className="jumbotron">
                    <h3>{this.state.content}</h3>
                </header>
                <TagCloud
                    minSize={12}
                    maxSize={35}
                    tags={data}
                    className="simple-cloud"
                    onClick={tag => this.props.history.push(`/review/tag/${tag.value}`)}
                />
                <ReviewListComponent reviews={this.state.reviews} key={this.state.reviews.length}/>
            </div>
        );
    }
}
