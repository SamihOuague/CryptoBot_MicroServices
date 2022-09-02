from functools import wraps
from flask import Flask
from flask import request
import multiprocessing as mp
from lib.auth import login, jwt_ping, update
from lib.CryptoGenerator import CryptoGenerator
from lib.manager import all_assets, add_asset, delete_asset, update_asset, get_asset
import pandas as pd
import pandas_ta as ta
from datetime import datetime

processes = {}

def short_strategy(candles_1m, candles_5m):
    df_1m = pd.DataFrame([c[1:] for c in candles_1m], index=range(len(candles_1m)), columns=["open", "high", "low", "close", "volume"])
    df_5m = pd.DataFrame([c[1:] for c in candles_5m], columns=["open", "high", "low", "close", "volume"])
    df_1m["TREND"] = df_1m.ta.ttm_trend()
    df_5m["TREND"] = df_5m.ta.ttm_trend()
    if df_1m["TREND"][df_1m.index[-1]] == df_5m["TREND"][df_5m.index[-1]] == -1:
        return True
    return False

def long_strategy(candles_1m, candles_5m):
    df_1m = pd.DataFrame([c[1:] for c in candles_1m[:-1]], columns=["open", "high", "low", "close", "volume"])
    df_5m = pd.DataFrame([c[1:] for c in candles_5m[:-1]], columns=["open", "high", "low", "close", "volume"])
    df_1m["TREND"] = df_1m.ta.ttm_trend()
    df_5m["TREND"] = df_5m.ta.ttm_trend()
    df_1m["MACD"] = df_1m.ta.macd()["MACD_12_26_9"]
    df_1m["MACD_s"] = df_1m.ta.macd()["MACDs_12_26_9"]
    df_1m["MACD_h"] = df_1m.ta.macd()["MACDh_12_26_9"]
    if df_1m["TREND"][df_1m.index[-1]] == df_5m["TREND"][df_1m.index[-1]] == -1 and df_1m["MACD"][-1] > df_1m["MACD_s"][-1] and df_1m["MACD_h"][-1] < 0.04:
        return True
    return False

def run_bot(symbol, side, leverage, stoploss, takeprofit):
    bot = CryptoGenerator(symbol, side=side, leverage=leverage, slr=stoploss, tpr=takeprofit)
    if side == "LONG":
        bot.run(long_strategy)
    else:
        bot.run(short_strategy)

app = Flask(__name__)

def login_required(func):
    @wraps(func)
    def auth_middleware(*args, **kwargs):
        try:
            if "Authorization" in request.headers:
                response = jwt_ping(request.headers["Authorization"])
                if "connected" in response and response["connected"]:
                    return func(*args, **kwargs)
                return {"msg": "You are not logged in."}
            else:
                return {"msg": "Authorization missing."}
        except:
            return {"msg": "Something wrong with token"}
    return auth_middleware


@app.route("/login", methods=["POST"])
def sign_in():
    return login(request.json)

@app.route("/update-api", methods=["POST"])
@login_required
def update_api():
    return update(request.json, request.headers["Authorization"])

@app.route("/")
@login_required
def list_processes():
    return {"processes": [{"name": p, "running": processes[p].is_alive(), "exitcode": processes[p].exitcode} for p in processes]}

@app.route("/start", methods=["POST"])
@login_required
def run_process():
    try:
        symbol = request.json["symbol"].upper()
        side = request.json["side"].upper()
        leverage = request.json["leverage"]
        stoploss = request.json["stoploss"]
        takeprofit = request.json["takeprofit"]
        if not symbol in processes and symbol != "":
            a = add_asset({"symbol": symbol})
            if "_id" in a:
                processes[symbol] = mp.Process(target=run_bot, args=(symbol,side,leverage,stoploss,takeprofit,))
                processes[symbol].start()
                return {"name": symbol, "running": processes[symbol].is_alive(), "exitcode": processes[symbol].exitcode}
            else:
                return {"msg": "Bad request"}
        return {"msg": "Process already exists."}
    except:
        return {"msg": "Bad request"}, 400

@app.route("/restart", methods=["POST"])
@login_required
def restart_process():
    symbol = request.json["symbol"].upper()
    if symbol in processes:
        processes[symbol] = mp.Process(target=run_bot, args=(symbol,))
        processes[symbol].start()
        asset = get_asset(symbol)
        return {"name": symbol, "running": processes[symbol].is_alive(), "exitcode": processes[symbol].exitcode}
    return {"msg": "Process not founds."}

@app.route("/get/<name>")
@login_required
def get_process(name):
    name = name.upper()
    asset = get_asset(name)
    if name in processes:
        return {"name": name, "running": processes[name].is_alive(), "exitcode": processes[name].exitcode}
    else:
        return {"msg": "Processe not found."}

@app.route("/stop", methods=["POST"])
@login_required
def stop_process():
    req = request.json
    if "symbol" in req and req["symbol"].upper() in processes:
        p = processes[req["symbol"].upper()]
        p.kill()
        p.join()
        asset = get_asset(req["symbol"].upper())
        return {"name": req["symbol"].upper(), "running": p.is_alive(), "exitcode": p.exitcode}
    return {"msg": "Process not found."}

@app.route("/delete", methods=["POST"])
@login_required
def delete_process():
    try:
        symbol = request.json["symbol"].upper()
        if symbol in processes:
            p = processes[symbol]
            if p.is_alive():
                p.kill()
                p.join()
            del processes[symbol]
            delete_asset({"symbol": symbol})
            return {"deleted": True}
        return {"msg": "Process not found."}
    except:
        return {"msg": "Bad request"}

@app.route("/list-assets", methods=["GET"])
@login_required
def list_assets():
    assets = all_assets()
    return assets

@app.route("/update-asset", methods=["PUT"])
@login_required
def stoplimit_assets():
    try:
        assets = update_asset(request.json)
        return assets
    except:
        return {"msg": "Bad request"}