import React, { Component } from "react";
import { connect } from "react-redux";
import { pingThunk } from "./app/auth/api/authThunks";
import { Navigate } from "react-router-dom";
import Manager from "./app/manager/components/Manager";

class Main extends Component {
    componentDidMount() {
        this.props.pingThunk(localStorage.getItem("token")).then((res) => {
            if (res.payload.connected && res.payload.apikey) {
                console.log(this.props.auth);
            }
        });
    }

    render() {
        if (this.props.auth.loading) return (<p style={{textAlign: "center"}}>Loading...</p>)
        else if (!this.props.auth.token) return (<Navigate to="/login"/>);
        else if (!this.props.auth.apiSet) return (<Navigate to="/update-api"/>);
        else return (<Manager/>);
    }
}

const mapStateToProps = (state) => {
    return state;
}

const mapDispatchToProps = {
    pingThunk
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);