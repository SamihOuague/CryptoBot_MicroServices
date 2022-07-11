import React, { Component } from "react";
import { connect } from "react-redux";
import { getAssetThunk, getSymbolThunk } from "../api/managerThunks";

class Manager extends Component {
    componentDidMount() {
        this.props.getAssetThunk();
        this.props.getSymbolThunk();
    }

    render() {
        const { assets, symbol } = this.props;
        return(
            <div className="container">
                <Funds assets={assets} symbol={symbol}/>
            </div>
        );
    }
}

const Funds = (props) => {
    if (props.assets && props.symbol) {
        let borrowed = (Number(props.assets.indexPrice) * Number(props.assets.baseAsset.borrowed));
        let netFunds = Number(props.assets.quoteAsset.free);
        netFunds = String(netFunds - borrowed).split(".");
        netFunds[1] = netFunds[1].substring(0, 2);
        netFunds = netFunds.join(".");
        let logs = props.symbol.logs;
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
        console.log(logs);
        logs = nLogs.reverse();
        return (
            <div className="container__manager">
                <h2 className="container__manager--title">{props.symbol.symbol}</h2>
                <p className="container__manager--funds">{netFunds}$</p>
                <div className="container__manager__onoff">
                    <button className="btn--onoff">Off</button>
                </div>
                {<div className="container__manager__logs">
                    {logs.map((value, key) => (
                        <div className="container__manager__logs__log" key={key}>
                            <p className="container__manager__logs__log--date">{value.date.toLocaleString()}</p>
                            <p className="container__manager__logs__log--gain">{value.gain}%</p>
                        </div>
                    ))}
                </div>}
            </div>
        );
    } else {
        return (
            <p>Loading...</p>
        )
    }
}

const mapStateToProps = (state) => {
    return state.manager;
}

const mapDispatchToProps = {
    getAssetThunk,
    getSymbolThunk,
}

export default connect(mapStateToProps, mapDispatchToProps)(Manager);