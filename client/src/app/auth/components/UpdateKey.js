import React, { Component } from "react";
import { connect } from "react-redux";
import { updateApiThunk } from "../api/authThunks";

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

    render() {
        return(
            <div>
                <h2>Update API Keys</h2>
                <form onSubmit={this.handleUpdateKey}>
                    <input type="text" name="apikey" placeholder="Your API Key"/><br/>
                    <input type="text" name="secretkey" placeholder="Your SECRET Key"/><br/>
                    <input type="submit" value="Update"/>
                </form>
            </div>
        );  
    }
}

const mapStateToProps = (state) => {
    return state.auth;
}

const mapDispatchToProps = {
    updateApiThunk
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateKey);