import React, { Component } from "react";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: AuthService.getCurrentUser(),
            profileUser: this.props.match.params.name,
                profile: null,
            message: ""
        };
    }

    componentDidMount() {
        UserService.getProfile(this.state.profileUser).then(
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
    }

    render() {
        const { currentUser } = this.state;
        return (
            <div className="container">
                <header className="jumbotron">
                    <h3>
                        <strong>{this.state.profileUser}</strong> Profile
                    </h3>
                </header>
            </div>
        );
    }
}
