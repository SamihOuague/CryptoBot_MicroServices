import React, { Component } from "react";
import { connect } from "react-redux";
import { loginThunk, pingThunk } from "../api/authThunks";
import { Navigate } from "react-router-dom";

class Auth extends Component {
    handleLogIn = (e) => {
        let data = { 
            username: e.target.username.value,
            password: e.target.password.value
        }
        this.props.loginThunk(data).then(() => {
            this.props.pingThunk(localStorage.getItem("token"));
        });
        e.preventDefault();
    }

    render() {
        if (this.props.token) return (<Navigate to="/"/>);
        return(
            <div className="auth">
                <div className="auth__container">
                    <h2 className="auth__container--title">Login</h2>
                    <form className="auth__container__form" onSubmit={this.handleLogIn}>
                        <input className="auth__container__form--input" type="text" name="username" placeholder="Your username"/><br/>
                        <input className="auth__container__form--input" type="password" name="password" placeholder="Your password"/><br/>
                        <input className="auth__container__form--btn" type="submit" value="Log In"/>
                    </form>
                </div>
            </div>
        );  
    }
}

const mapStateToProps = (state) => {
    return state.auth;
}

const mapDispatchToProps = {
    loginThunk,
    pingThunk
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);