import React from "react";
import { updateApiThunk } from "./paramSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export function Param() {
    const dispatch = useDispatch();
    const { msg, loading } = useSelector((state) => state.param);
    const handleSubmit = (e) => {
        const data = {
            apiKey: e.target.apikey.value,
            secretKey: e.target.secretkey.value,
        };
        dispatch(updateApiThunk(data));
        e.preventDefault();
    }
    return (
        <div className="container">
            <div className="container__nav">
                <Link to="/"><i className="fa-solid fa-angle-left"></i>Back</Link>
            </div>
            <h2>Update API Key</h2>
            <form onSubmit={handleSubmit}>
                <input name="apikey" placeholder="API Key" type="text" />
                <input name="secretkey" placeholder="Secret Key" type="text" />
                {(!loading) ?
                    <>
                        <button type="submit">Update Keys</button>
                        <p>{msg}</p>
                    </> : <p>Loading...</p>
                }
            </form>
        </div>
    );
}