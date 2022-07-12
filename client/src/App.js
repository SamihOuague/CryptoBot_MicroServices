import React, { Component } from "react";
import Manager from "./app/manager/components/Manager";
import Auth from "./app/auth/components/Auth";
import UpdateKey from "./app/auth/components/UpdateKey";
import "./App.css";
import { connect } from "react-redux";
import { pingThunk } from "./app/auth/api/authThunks";

class App extends Component {
    componentDidMount() {
        if (localStorage.getItem("token"))
            this.props.pingThunk(localStorage.getItem("token"));
    }

    render() {
        return(    
            <Router {...this.props}/>
        );
    }
}

const Router = (props) => {
    if (props.token && !props.apiSet) {
        return(
            <UpdateKey/>
        );
    } else if (props.token && props.apiSet) {
        return(
            <Manager/>
        );
    } else {
        return(
            <Auth/>
        );
    }
}

const mapStateToProps = (state) => {
    return state.auth;
}

const mapDispatchToProps = {
    pingThunk
}

export default connect(mapStateToProps, mapDispatchToProps)(App);