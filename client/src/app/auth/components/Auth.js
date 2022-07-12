import React, { Component } from "react";
import { connect } from "react-redux";
import { loginThunk } from "../api/authThunks";

class Auth extends Component {
    handleLogIn = (e) => {
        let data = { 
            username: e.target.username.value,
            password: e.target.password.value
        }
        this.props.loginThunk(data);
        e.preventDefault();
    }

    render() {
        return(
            <div>
                <h2>Login</h2>
                <form onSubmit={this.handleLogIn}>
                    <input type="text" name="username" placeholder="Your username"/><br/>
                    <input type="password" name="password" placeholder="Your password"/><br/>
                    <input type="submit" value="Log In"/>
                </form>
            </div>
        );  
    }
}

const mapStateToProps = (state) => {
    return state.auth;
}

const mapDispatchToProps = {
    loginThunk
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);