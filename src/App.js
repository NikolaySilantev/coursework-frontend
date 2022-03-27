import React, {Component} from "react";
import {Switch, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"
import "./App.css";
import AuthService from "./services/auth.service";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardAdmin from "./components/board-admin.component";
import ReviewComponent from "./components/review-component";
import ReviewsByTagComponent from "./components/reviews-by-tag.component";
import ReviewFormComponent from "./components/review-form.component";
import SearchComponent from "./components/search-component";
import AuthVerify from "./common/auth-verify";

class App extends Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);
        this.onChangeSearchText = this.onChangeSearchText.bind(this);
        this.state = {
            showAdminBoard: false,
            currentUser: undefined,
            searchText: ""
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();
        if (user) {
            this.setState({
                currentUser: user,
                showAdminBoard: user.roles.includes("ROLE_ADMIN"),
            });
        }
    }

    logOut() {
        AuthService.logout();
    }

    onChangeSearchText(e) {
        this.setState({
            searchText: e.target.value
        });
    }

    render() {
        const {currentUser, showAdminBoard} = this.state;
        return (
            <div>
                <AuthVerify/>
                <nav className="navbar navbar-expand navbar-dark bg-dark">
                    <Link to={"/"} className="navbar-brand ms-2">
                        Silantev
                    </Link>
                    <div className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to={"/home"} className="nav-link">
                                Home
                            </Link>
                        </li>
                        {showAdminBoard && (
                            <li className="nav-item">
                                <Link to={"/admin"} className="nav-link">
                                    Admin Board
                                </Link>
                            </li>
                        )}
                    </div>
                    {currentUser ? (
                        <div className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to={`/profile/${currentUser.username}`} className="nav-link">
                                    {currentUser.username}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={`/add-review/${currentUser.username}`} className="nav-link">
                                    Add review
                                </Link>
                            </li>
                            <li className="nav-item">
                                <a href="/login" className="nav-link" onClick={this.logOut}>
                                    LogOut
                                </a>
                            </li>
                        </div>
                    ) : (
                        <div className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to={"/login"} className="nav-link">
                                    Login
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={"/register"} className="nav-link">
                                    Sign Up
                                </Link>
                            </li>
                        </div>
                    )}
                    <div className="d-flex ms-auto me-2">
                        <input
                            className="form-control me-2" type="search" placeholder="Search" aria-label="Search"
                            value={this.state.searchText}
                            onChange={this.onChangeSearchText}/>
                        <Link to={"/review/search/" + this.state.searchText} className="btn btn-outline-success">
                            Search
                        </Link>
                    </div>
                </nav>
                <div className="container mt-3">
                    <Switch>
                        <Route exact path={["/", "/home"]} component={Home}/>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/register" component={Register}/>
                        <Route path="/admin" render={props => <BoardAdmin key={props.location.key} {...props}/>}/>
                        <Route path={"/add-review/:author"}
                               render={props => <ReviewFormComponent key={props.location.key} {...props}/>}/>
                        <Route path={"/review/edit/:id"}
                               render={props => <ReviewFormComponent key={props.location.key} {...props}/>}/>
                        <Route path="/review/details/:id" render={props => <ReviewComponent key={props.location.key}
                                                                                            isAdmin={this.state.showAdminBoard} {...props}/>}/>
                        <Route path="/profile/:name" render={props => <Profile key={props.location.key}
                                                                               isAdmin={this.state.showAdminBoard} {...props}/>}/>
                        <Route path="/review/tag/:tag"
                               render={props => <ReviewsByTagComponent key={props.location.key} {...props}/>}/>
                        <Route path="/review/search/:text"
                               render={props => <SearchComponent key={props.location.key} {...props}/>}/>
                    </Switch>
                </div>
            </div>
        );
    }
}

export default App;
