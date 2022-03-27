import React, {Component} from "react";

import {Link} from "react-router-dom";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";

export default class BoardAdmin extends Component {
    constructor(props) {
        super(props);

        this.handleBlockClick = this.handleBlockClick.bind(this);
        this.handleUnblockClick = this.handleUnblockClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleMakeAdminClick = this.handleMakeAdminClick.bind(this);
        this.getSelectedUserIds = this.getSelectedUserIds.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);

        this.state = {
            users: [],
            isAdmin: false,
            message: ""
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();
        if (user && user.roles.includes("ROLE_ADMIN")) {
            this.getAllUsers();
            this.setState({
                isAdmin: true
            })
        }
    }

    getAllUsers() {
        UserService.getAllUsers().then(
            response => {
                this.setState({
                    users: response.data.map(user => {
                        user.selected = false;
                        return user;
                    })
                })
            }
        )
    }

    handleAllChecked = event => {
        let users = this.state.users;
        users.forEach(user => (user.selected = event.target.checked));
        this.setState({users: users});
    };

    handleCheckChieldElement = event => {
        let users = this.state.users;
        users.forEach(user => {
            if (user.username === event.target.value)
                user.selected = event.target.checked;
        });
        this.setState({users: users});
    };

    getSelectedUserIds() {
        return this.state.users.filter(function (user) {
            return user.selected
        }).map(user => (user.id))
    }

    handleBlockClick() {
        UserService.blockUsers(this.getSelectedUserIds()).then(
            response => {
                this.setState({
                    message: response.data
                });
                this.getAllUsers();
            })
    }

    handleUnblockClick() {
        UserService.unblockUsers(this.getSelectedUserIds()).then(
            response => {
                this.setState({
                    message: response.data
                });
                this.getAllUsers();
            })
    }

    handleDeleteClick() {
        UserService.deleteUsers(this.getSelectedUserIds()).then(
            response => {
                this.setState({
                    message: response.data
                });
                this.getAllUsers();
            })
    }

    handleMakeAdminClick() {
        UserService.makeAdminUsers(this.getSelectedUserIds()).then(
            response => {
                this.setState({
                    message: response.data
                });
                this.getAllUsers();
            })
    }


    render() {
        return (
            <div className="container">
                {this.state.isAdmin && (<div>
                    <div className='row g-0 mt-1 mb-1'>
                        <div className="col-md-5 w-auto ms-auto" role="group" aria-label="Basic outlined example">
                            <button className="btn btn-outline" name="delete" data-bs-toggle="tooltip"
                                    title="Make admin"
                                    onClick={this.handleMakeAdminClick}>
                                <i className="material-icons">admin_panel_settings</i>
                            </button>
                            <button className="btn btn-outline" name="block" data-bs-toggle="tooltip" title="Ban user"
                                    onClick={this.handleBlockClick}>
                                <i className="material-icons text-primary">lock_outline</i>
                            </button>
                            <button className="btn btn-outline" name="unblock" data-bs-toggle="tooltip"
                                    title="Unban user"
                                    onClick={this.handleUnblockClick}>
                                <i className="material-icons text-primary">lock_open</i>
                            </button>
                            <button className="btn btn-outline" name="delete" data-bs-toggle="tooltip"
                                    title="Delete user"
                                    onClick={this.handleDeleteClick}>
                                <i className="material-icons text-danger">remove_circle_outline</i>
                            </button>
                        </div>
                    </div>
                    <table className="table table-responsive table-borderless" data-response-handler="responseHandler">
                        <thead>
                        <tr>
                            <th scope="col">
                                <input className="form-check-input"
                                       type="checkbox"
                                       onChange={this.handleAllChecked}
                                />
                            </th>
                            <th>username</th>
                            <th>email</th>
                            <th>unblocked</th>
                            <th>is Admin</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.users.map(user => {
                                return (
                                    <tr key={user.id}>
                                        <th scope="row">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={user.selected}
                                                onChange={this.handleCheckChieldElement}
                                                value={user.username}
                                                key={user.id}
                                            />
                                        </th>
                                        <td>
                                            <Link
                                                to={`/profile/${user.username}`}
                                                style={{textDecoration: 'none'}}
                                                className="link-dark"
                                            >
                                                {user.username}
                                            </Link>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>{`${user.unblocked}`}</td>
                                        <td>{`${user.isAdmin}`}</td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>)}
            </div>
        );
    }
}
