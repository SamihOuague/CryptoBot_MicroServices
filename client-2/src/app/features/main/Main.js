import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../auth/authSlice";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { listAsyncThunk, startProcessAsyncThunk, getAssetsAsyncThunk } from "./mainSlice";
import { resetState } from "../asset/assetSlice";

export function Main() {
    const dispatch = useDispatch();
    const { processes, pending, assets, apiNotSet } = useSelector((state) => state.main);
    let symbol = "";
    useEffect(() => {
        dispatch(listAsyncThunk());
        dispatch(getAssetsAsyncThunk());
        dispatch(resetState());
        //eslint-disable-next-line
    }, []);

    const ProcessElt = (props) => (
        <div className="container__assets__list__elt">
            <Link to={`/asset/${props.name}`} className="container__assets__list__elt--name">{props.name}</Link>
            {(props.running) ?
            <div className="container__assets__list__elt--status  green-status"></div> 
            : <div className="container__assets__list__elt--status red-status"></div>
            }
        </div>
    );

    const handleStart = () => {
        dispatch(startProcessAsyncThunk({
            name: symbol,
        }));
    };

    if (!localStorage.getItem("token"))
        return (<Navigate to="/login"/>);
    if (pending) { 
        return (
            <div className="container">
                <div className="spinner">
                    <i className="fa-solid fa-spinner"></i>
                </div>
            </div>
        );
    } else if (apiNotSet) { return (<Navigate to="/parameters"/>); }
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
                    <select onChange={(e) => symbol = e.target.value}>
                        <option>Choose a Bot</option>
                        {assets.map((value, key) => (
                            <option key={key}>{value}</option>
                        ))}
                    </select>
                    <button onClick={() => handleStart()}>Start</button>
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