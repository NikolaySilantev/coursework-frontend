import React, {Component} from "react";
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
            <div>

                {this.state.profile !== null ? (
                    <div>
                        <div className="container">
                            <div className="h3">{this.state.profile.username}
                                {this.state.profile.imageUrl ?
                                    (<img className="" src="{review.authorImgUrl}" alt="..."/>)
                                    :
                                    (<i className="material-icons align-middle h1">face</i>)
                                }
                            </div>
                            <div>

                                <span className="h4">User rating:
                                    <i className="material-icons text-primary h4 align-middle ms-1">favorite</i>
                                    {this.state.profile.rating}
                                </span>
                            </div>
                            {(this.state.currentUser !== null && this.state.profileUsername === this.state.currentUser.username || this.props.isAdmin) && (
                                <Link to={"/add-review/" + this.state.profileUsername} className="btn btn-primary">
                                    Add some review
                                </Link>
                            )}
                            <h3 className="mt-5">Reviews by {this.state.profile.username}:</h3>
                        </div>

                        <div>
                            <ReviewListComponent reviews={this.state.reviews} key={this.state.reviews.length}/>
                        </div>
                    </div>) : (<div className="h1">Not found =(</div>)}
            </div>
        );
    }
}
