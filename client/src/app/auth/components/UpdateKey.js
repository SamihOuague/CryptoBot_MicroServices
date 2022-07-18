import React, { Component } from "react";
import { connect } from "react-redux";
import { updateApiThunk, pingThunk } from "../api/authThunks";

class UpdateKey extends Component {
    handleUpdateKey = (e) => {
        let data = { 
            apiKey: e.target.apikey.value,
            secretKey: e.target.secretkey.value,
            token: this.props.token,
        }
        this.props.updateApiThunk(data);
        e.preventDefault();
    }

    componentDidMount() {
        if (localStorage.getItem("token"))
            this.props.pingThunk(localStorage.getItem("token"));
    }

    render() {
        return(
            <div className="auth">
                <div className="auth__container">
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
    pingThunk
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateKey);