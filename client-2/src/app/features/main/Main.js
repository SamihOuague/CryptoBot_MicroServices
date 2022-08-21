import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../auth/authSlice";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { listAsyncThunk, startProcessAsyncThunk, stopProcessAsyncThunk } from "./mainSlice";

export function Main() {
    const dispatch = useDispatch();
    const { processes } = useSelector((state) => state.main);
    let symbol = "";
    useEffect(() => {
        dispatch(listAsyncThunk());
        //eslint-disable-next-line
    }, []);
    const ProcessElt = (props) => (
        <div className="container__assets__list__elt">
            <div>{props.name}</div>
            {(props.running) ?
            <div onClick={() => dispatch(stopProcessAsyncThunk({symbol: props.name}))} 
                className="container__assets__list__elt--status  green-status"></div> 
            : <div onClick={() => dispatch(startProcessAsyncThunk({symbol: props.name}))}
                className="container__assets__list__elt--status red-status"></div>
            }
        </div>
    );
    if (!localStorage.getItem("token"))
        return (<Navigate to="/login"/>)
    return (
        <div className="container">
            <div className="container__nav">
                <Link to="/parameters">
                    <i className="fa-solid fa-gear"></i>
                    Parameters
                </Link>
                <Link to="/" onClick={() => dispatch(logOut())}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    Log Out
                </Link>
            </div>
            <div className="container__assets">
                <div className="container__assets__add">
                    <input onChange={(e) => symbol = e.target.value} type="text" placeholder="Enter an asset"/>
                    <button onClick={() => dispatch(startProcessAsyncThunk({symbol}))}>Add</button>
                </div>
                <div className="container__assets__list">
                    {processes.map((value, key) => (
                        <ProcessElt key={key} name={value.name} running={value.running}/>
                    ))}
                </div>
            </div>
        </div>
    );
}