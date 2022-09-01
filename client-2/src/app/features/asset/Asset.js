import React, { useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProcessThunk, stopProcessThunk, restartProcessThunk, deleteProcessThunk, updateProcessThunk } from "./assetSlice";

export function Asset() {
    const { symbol } = useParams();
    const { asset, pending } = useSelector((state) => state.asset);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProcessThunk(symbol));
        // eslint-disable-next-line
    }, []);

    if (!asset && !pending) {
        return (<Navigate to="/"/>);
    } else if (pending) { 
        return (
            <div className="container">
                <div className="spinner">
                    <i className="fa-solid fa-spinner"></i>
                </div>
            </div>
        );
    } else {
        return (
            <div className="container">
                <div className="container__nav">
                    <Link to="/"><i className="fa-solid fa-angle-left"></i>Back</Link>
                    <div onClick={() => dispatch(deleteProcessThunk({symbol}))} className="container__nav--delete"><i className="fa-solid fa-trash"></i>Delete</div>
                </div>
                <div className="container__asset">
                    <h3>{symbol.toUpperCase()}</h3>
                    {(asset.running) ?
                        <div className="btn--onoff btn--green" 
                            onClick={() => dispatch(stopProcessThunk({symbol: symbol.toUpperCase()}))}>ON</div>
                        : <div className="btn--onoff btn--red"
                            onClick={() => dispatch(restartProcessThunk({symbol: symbol.toUpperCase()}))}>OFF</div>
                    }
                    <hr/>
                    <div className="container__asset__logs">
                        {[].map((value, key) => (
                            (value.split(" ")[0] === "WIN") ? 
                                <div className="container__asset__logs--log win">
                                    <p>WIN</p>
                                    <p>{value.split(" ")[1]}</p>
                                </div> :
                                <div className="container__asset__logs--log loss">
                                    <p>LOSS</p>
                                    <p>{value.split(" ")[1]}</p>
                                </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}