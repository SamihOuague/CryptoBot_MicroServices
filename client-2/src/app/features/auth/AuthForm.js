import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAsyncThunk } from "./authSlice";
import { Navigate } from "react-router-dom";

export function AuthForm() {
    const dispatch = useDispatch();
    const handleSubmit = (e) => {
        const data = {
            username: e.target.username.value,
            password: e.target.password.value
        };
        dispatch(loginAsyncThunk(data));
        e.preventDefault();
    }
    const isPending = useSelector((state) => state.auth.pending);
    const token = useSelector((state) => state.auth.token);
    if (isPending) return (
        <div className="container">
            <div className="spinner">
                <i className="fa-solid fa-spinner"></i>
            </div>
        </div>
    );
    else if (token) return (<Navigate to="/"/>)
    return (
        <div className="container">
            <form onSubmit={(e) => handleSubmit(e)}>
                <input type="text" name="username" placeholder="Username"/>
                <input type="password" name="password" placeholder="Password"/>
                <button type="submit">login</button>
            </form>
        </div>
    );
}