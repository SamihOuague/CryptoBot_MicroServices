from functools import wraps
from textwrap import wrap
from flask import Flask
from flask import request
import multiprocessing as mp
from lib.auth import login, jwt_ping, update
from lib.BNBot import BNBot
import pandas as pd
import pandas_ta as ta
from datetime import datetime

processes = {}

def long_strategy(candles):
    dates = [datetime.fromtimestamp(c[0]/1000) for c in candles]
    df = pd.DataFrame([c[1:] for c in candles[:-1]], index=dates[:-1], columns=["open", "high", "low", "close", "volume"])
    df["CHOP"] = df.ta.chop(14)
    df["EMA50"] = df.ta.ema(50)
    df["EMA100"] = df.ta.ema(100)
    df["EMA150"] = df.ta.ema(150)
    df["RSI"] = df.ta.rsi(14)
    df["TREND"] = df.ta.ttm_trend()
    if df["EMA150"][-1] < df["EMA100"][-1] < df["EMA50"][-1] and df["CHOP"][-1] < 30 and df["RSI"][-1] < 70 and df["TREND"][-1] == 1:
        #print("BUY IT : {}".format(candles[-1][4]))
        return True
    return False

def run_bot(symbol):
    bot = BNBot(symbol)
    bot.run(long_strategy)

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
    return [{"name": p, "running": processes[p].is_alive(), "exitcode": processes[p].exitcode} for p in processes]

@app.route("/start", methods=["POST"])
@login_required
def run_process():
    symbol = request.json["symbol"].upper()
    if not symbol in processes or processes[symbol].exitcode != None:
        processes[symbol] = mp.Process(target=run_bot, args=(symbol,))
        processes[symbol].start()
    return [{"name": p, "exitcode": processes[p].exitcode} for p in processes]

@app.route("/get/<name>")
@login_required
def get_process(name):
    name = name.upper()
    if name in processes:
        return {"name": name, "exitcode": processes[name].exitcode}
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
        return {"name": req["symbol"], "exitcode": p.exitcode}
    return {"msg": "Process not found."}