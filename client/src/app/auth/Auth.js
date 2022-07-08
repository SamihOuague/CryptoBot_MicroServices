import React, { Component } from "react";
import { login, register } from "./api";


class Auth extends Component {
    handleLogIn = (e) => {
        let data = { 
            username: e.target.username.value,
            password: e.target.password.value
        }
        login(data);
        e.preventDefault();
    }

    handleRegister = (e) => {
        let data = {
            username: e.target.username.value,
            password: e.target.password.value,
        }
        register(data);
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
                <h2>Register</h2>
                <form onSubmit={this.handleRegister}>
                    <input type="text" name="username" placeholder="Your username"/><br/>
                    <input type="password" name="password" placeholder="Your password"/><br/>
                    <input type="password" name="c_password" placeholder="Confirm your password"/><br/>
                    <input type="submit" value="Register"/>
                </form>
            </div>
        );  
    }
}

export default Auth;