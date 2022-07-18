import React, { Component } from "react";
import { connect } from "react-redux";
import { updateApiThunk, pingThunk, updateUserThunk } from "../api/authThunks";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";

class UpdateLogs extends Component {
    handleUpdateKey = (e) => {
        let data = { 
            apiKey: e.target.apikey.value,
            secretKey: e.target.secretkey.value,
            token: this.props.token,
        }
        this.props.updateApiThunk(data);
        e.preventDefault();
    }

    handleUpdateUser = (e) => {
        let data = { 
            username: e.target.username.value,
            password: e.target.password.value,
            newPassword: e.target.newpassword.value,
            token: this.props.token,
        }
        this.props.updateUserThunk(data);
        e.preventDefault();
    }

    componentDidMount() {
        this.props.pingThunk(localStorage.getItem("token"));
    }

    render() {
        if (this.props.loading) return (<p style={{textAlign: "center"}}>Loading...</p>);
        else if (!this.props.token) return (<Navigate to="/login"/>);
        return(
            <div className="auth">
                <div className="auth__container">
                    <Link to="/">Back</Link>
                    <h2 className="auth__container--title">Update Log In Access</h2>
                    <form className="auth__container__form" onSubmit={this.handleUpdateUser}>
                        <input className="auth__container__form--input" type="text" name="username" placeholder="Change Username"/><br/>
                        <input className="auth__container__form--input" type="password" name="password" placeholder="Current Password"/><br/>
                        <input className="auth__container__form--input" type="password" name="newpassword" placeholder="New Password"/><br/>
                        <input className="auth__container__form--btn" type="submit" value="Update"/>
                    </form>
                    <h2 className="auth__container--title">Update API Keys</h2>
                    <form className="auth__container__form" onSubmit={this.handleUpdateKey}>
                        <input className="auth__container__form--input" type="text" name="apikey" placeholder="Your API Key"/><br/>
                        <input className="auth__container__form--input" type="text" name="secretkey" placeholder="Your SECRET Key"/><br/>
                        <input className="auth__container__form--btn" type="submit" value="Update"/>
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
    updateApiThunk,
    pingThunk,
    updateUserThunk,
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateLogs);