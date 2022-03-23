import React, { Component } from "react";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import {Link} from "react-router-dom";
import ReviewService from "../services/review.service";
import ReviewListComponent from "./review-list-component";
export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: AuthService.getCurrentUser(),
            profileUsername: this.props.match.params.name,
            profile: null,
            reviews: [],
            message: ""
        };
    }

    componentDidMount() {
        UserService.getProfile(this.state.profileUsername).then(
            response => {
                this.setState({
                    profile: response.data
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
        ReviewService.getReviewsByUser(this.state.profileUsername).then(
            response => {
                this.setState({
                    reviews: response.data
                })
            }
        )
    }

    render() {
        return (
            <div className="container">
                <header className="jumbotron">
                    <h3>
                        <strong>{this.state.profileUsername}</strong> Profile
                    </h3>
                    {this.state.profile !== null && (<h3>
                        user rating: {this.state.profile.rating}
                    </h3>)}
                    {(this.state.profileUsername === this.state.currentUser.username || this.props.isAdmin) && (
                        <Link to={"/add-review/" + this.state.profileUsername} className="nav-link">
                        Add some review
                        </Link>
                        )}
                </header>
                <div>
                    <ReviewListComponent reviews={this.state.reviews} key={this.state.reviews.length}/>
                </div>
            </div>
        );
    }
}
