import React, { Component } from "react";
import { connect } from "react-redux";
import { getAssetThunk, getSymbolThunk, switchSymbolThunk } from "../api/managerThunks";
import { loadingDone } from "../managerSlice";
import { Link } from "react-router-dom";

class Manager extends Component {
    createLogs = (symbol) => {
        let logs = symbol.logs;
        let nLogs = [];
        for (let i = 1; i < logs.length; i++) {
            let log = logs[i].split(" ");
            let lastFunds = Number(logs[i-1].split(" ")[1]);
            let gain = ((Number(log[1]) - lastFunds) / log[1]) * 100;
            gain = String(gain).split(".");
            gain[1] = gain[1].substring(0, 2);
            gain = gain.join(".");
            nLogs.push({gain: gain, date: new Date(Number(log[0]))});
        }
        return nLogs.reverse();
    }

    netFunds = (assets) => {
        let borrowed = (Number(assets.indexPrice) * Number(assets.baseAsset.borrowed));
        let netFunds = Number(assets.quoteAsset.free);
        netFunds = String(netFunds - borrowed).split(".");
        netFunds[1] = netFunds[1].substring(0, 2);
        netFunds = netFunds.join(".");
        return netFunds;
    }

    switchSymbol = () => {
        this.props.switchSymbolThunk(this.props.auth.token);
    }

    componentDidMount() {
        this.props.getAssetThunk(this.props.auth.token).then(() => {
            this.props.getSymbolThunk(this.props.auth.token).then(() => {
                this.props.loadingDone();
            });
        });
    }

    render() {
        if (this.props.manager.loading) return (<p style={{textAlign: "center"}}>Loading...</p>);
        const { assets, symbol } = this.props.manager;
        let logs = this.createLogs(symbol);
        let netFunds = this.netFunds(assets);
        return(
            <div className="container">
                <Link to="/update-user" className="container--link">Parametres</Link>
                <div className="container__manager">
                    <h2 className="container__manager--title">{symbol.symbol}</h2>
                    <p className="container__manager--funds">{netFunds}$</p>
                    <div className="container__manager__onoff">
                        <div className={(symbol.actived) ? "btn--onoff btn--green" : "btn--onoff btn--red"} onClick={() => this.switchSymbol()}>{(symbol.actived) ? "On" : "Off"}</div>
                    </div>
                    <div className="container__manager__logs">
                        {(logs.length > 0) ?
                            logs.map((value, key) => (
                                <div className="container__manager__logs__log" key={key}>
                                    <p className="container__manager__logs__log--date">{value.date.toLocaleString()}</p>
                                    <p className="container__manager__logs__log--gain">{value.gain}%</p>
                                </div>
                            )) : 
                            <div className="container__manager__logs__nothing">
                                <p>Nothing to show yet.</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = {
    getAssetThunk,
    getSymbolThunk,
    switchSymbolThunk,
    loadingDone,
}

export default connect(mapStateToProps, mapDispatchToProps)(Manager);