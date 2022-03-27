import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import authService from "../services/auth.service";

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

class AuthVerify extends Component {
    constructor(props) {
        super(props);

        props.history.listen(() => {
            const user = JSON.parse(localStorage.getItem("user"));

            if (user) {
                const decodedJwt = parseJwt(user.accessToken);
                if (decodedJwt.exp * 1000 < Date.now()) {
                    window.location.reload();
                    authService.logout()
                }
            }
        });
    }

    render() {
        return <div></div>;
    }
}

export default withRouter(AuthVerify);
