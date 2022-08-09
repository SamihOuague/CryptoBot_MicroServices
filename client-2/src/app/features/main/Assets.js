import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAssetsThunk, switchSymbolThunk } from "./assetSlice";
import { logOut } from "../auth/authSlice";
import { Link } from "react-router-dom";

export function Assets() {
    const dispatch = useDispatch();
    const { wallets, status, symbol, loadingSwitch } = useSelector((state) => state.asset);
    const netFunds = (assets) => {
        try {
            let borrowed = (Number(assets.indexPrice) * Number(assets.baseAsset.borrowed));
            let netFunds = Number(assets.quoteAsset.free);
            netFunds = String(netFunds - borrowed).split(".");
            netFunds[1] = netFunds[1].substring(0, 2);
            netFunds = netFunds.join(".");
            return netFunds;
        } catch(e) {
            return 0;
        }
    };

    const createLogs = (symbol) => {
        let logs = symbol.logs;
        let nLogs = [];
        for (let i = 1; i < logs.length; i++) {
            let log = logs[i].split(" ");
            let lastFunds = Number(logs[i-1].split(" ")[1]);
            let gain = ((Number(log[1]) - lastFunds) / log[1]) * 100;
            try {
                gain = String(gain).split(".");
                gain[1] = gain[1].substring(0, 2);
                gain = gain.join(".");
            } catch {
                gain = "0.00";
            }
            nLogs.push({gain: gain, date: new Date(Number(log[0]))});
        }
        return nLogs.reverse();
    };

    let logs = [];

    if (!status) dispatch(getAssetsThunk("BNBUSDT"));
    else if (status === "Succeed" && wallets && symbol) {
        if (wallets.code && wallets.code === -2014) {
            return (
                <div className="container">
                    <h1>API KEY Not Set</h1>
                    <div className="container__nav">
                        <Link to="/parameters">
                            <i className="fa-solid fa-gear"></i>
                            Parameters
                        </Link>
                    </div>
                </div>
            );
        } else {
            logs = createLogs(symbol);
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
                    <div className="container__asset">
                        <h3>{symbol.symbol}</h3>
                        <p>{netFunds(wallets.assets[0])}$</p>
                        {(loadingSwitch) ? 
                            <div className="spinner">
                                <i className="fa-solid fa-spinner"></i>
                            </div>
                        :
                            <div className="container__asset__btn">
                                <div className={(symbol.actived) ? "btn--onoff btn--green" : "btn--onoff btn--red"} onClick={() => dispatch(switchSymbolThunk(symbol.symbol))}>{(symbol.actived) ? "ON": "OFF"}</div>
                            </div>
                        }
                        <hr/>
                        
                        {(logs.length > 0) ? 
                            <div className="container__asset__logs">
                                {logs.map((value, key) => (
                                        <div className="container__asset__logs__log" key={key}>
                                            <div className="container__asset__logs__log--date">{value.date.toLocaleString()}</div>
                                            <div className="container__asset__logs__log--percent">{value.gain}%</div>
                                        </div>

                                ))}
                            </div>
                            : 
                            <div className="container__asset__nothing">
                                <p>Nothing to show yet</p>
                            </div>
                        }
                    </div>
                </div>
            );
        }
    } else {
        return(
            <div className="container">
                <div className="spinner">
                    <i className="fa-solid fa-spinner"></i>
                </div>
            </div>
        );
    }
}