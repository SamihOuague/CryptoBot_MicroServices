import React, { Component } from "react";
import Auth from "./app/auth/components/Auth";
import UpdateLogs from "./app/auth/components/UpdateLogs";
import UpdateKey from "./app/auth/components/UpdateKey";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { connect } from "react-redux";
import Main from "./Main";

class App extends Component {
    render() {
        return(
            <div>
                <Routes>
                    <Route path="/" element={<Main/>}/>
                    <Route path="/login" element={<Auth/>}/>
                    <Route path="/update-api" element={<UpdateKey/>}/>
                    <Route path="/update-user" element={<UpdateLogs/>}/>
                </Routes>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return state.auth;
}

export default connect(mapStateToProps)(App);