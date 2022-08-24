from functools import wraps
from flask import Flask
from flask import request
import multiprocessing as mp
from lib.auth import login, jwt_ping, update
from lib.BNBot import BNBot
from lib.manager import all_assets, add_asset, delete_asset, update_asset, get_asset
import pandas as pd
import pandas_ta as ta
from datetime import datetime

processes = {}

def short_strategy(candles):
    dates = [datetime.fromtimestamp(c[0]/1000) for c in candles]
    df = pd.DataFrame([c[1:] for c in candles[:-1]], index=dates[:-1], columns=["open", "high", "low", "close", "volume"])
    df["EMA25"] = df.ta.ema(25)
    df["EMA50"] = df.ta.ema(50)
    df["EMA100"] = df.ta.ema(100)
    df["EMA150"] = df.ta.ema(150)
    df["RSI"] = df.ta.rsi(14)
    df["TREND"] = df.ta.ttm_trend()
    if df["close"][-1] > df["EMA50"][-1] > df["EMA100"][-1] > df["EMA150"][-1] and df["TREND"][-1] == -1 and df["RSI"][-1] > 30 and df["close"][-1] > df["EMA25"][-1] > df["open"][-1]:
        return True
    return False

def run_bot(symbol):
    bot = BNBot(symbol)
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
        if not symbol in processes and symbol != "":
            a = add_asset({"symbol": symbol})
            if "_id" in a:
                processes[symbol] = mp.Process(target=run_bot, args=(symbol,))
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
        return {"name": symbol, "running": processes[symbol].is_alive(), "exitcode": processes[symbol].exitcode, "logs": asset["logs"], "stoploss": asset["stoploss"], "takeprofit": asset["takeprofit"]}
    return {"msg": "Process not founds."}

@app.route("/get/<name>")
@login_required
def get_process(name):
    name = name.upper()
    asset = get_asset(name)
    if name in processes:
        return {"name": name, "running": processes[name].is_alive(), "exitcode": processes[name].exitcode, "logs": asset["logs"], "stoploss": asset["stoploss"], "takeprofit": asset["takeprofit"]}
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
        return {"name": req["symbol"].upper(), "running": p.is_alive(), "exitcode": p.exitcode, "logs": asset["logs"], "stoploss": asset["stoploss"], "takeprofit": asset["takeprofit"]}
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