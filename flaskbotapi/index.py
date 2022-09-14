from functools import wraps
from flask import Flask
from flask import request
import multiprocessing as mp
from lib.auth import login, jwt_ping, update
from lib.CryptoGenerator import CryptoGenerator
from lib.Strategies.eth_strategy import *

processes = {}

bots = {
    "ETHUSDT-LONG": CryptoGenerator("ETHUSDT", long_strategy_eth, side="LONG", leverage=3),
    "ETHUSDT-SHORT": CryptoGenerator("ETHBUSD", short_strategy_eth, side="SHORT", leverage=3),
}

def run_bot(name):
    if name in bots:
        bots[name].run()
    else:
        print("Bot not found !")

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
        name = request.json["name"].upper()
        if not name in processes and name != "":
            processes[name] = mp.Process(target=run_bot, args=(name,))
            processes[name].start()
            return {"name": name, "running": processes[name].is_alive(), "exitcode": processes[name].exitcode}
        return {"msg": "Process already exists."}
    except:
        return {"msg": "Bad request"}, 400

@app.route("/restart", methods=["POST"])
@login_required
def restart_process():
    name = request.json["name"].upper()
    if name in processes:
        processes[name] = mp.Process(target=run_bot, args=(name,))
        processes[name].start()
        return {"name": name, "running": processes[name].is_alive(), "exitcode": processes[name].exitcode}
    return {"msg": "Process not founds."}

@app.route("/get/<name>")
@login_required
def get_process(name):
    name = name.upper()
    if name in processes:
        return {"name": name, "running": processes[name].is_alive(), "exitcode": processes[name].exitcode}
    else:
        return {"msg": "Processe not found."}

@app.route("/stop", methods=["POST"])
@login_required
def stop_process():
    req = request.json
    if "name" in req and req["name"].upper() in processes:
        p = processes[req["name"].upper()]
        p.kill()
        p.join()
        return {"name": req["name"].upper(), "running": p.is_alive(), "exitcode": p.exitcode}
    return {"msg": "Process not found."}

@app.route("/delete", methods=["POST"])
@login_required
def delete_process():
    try:
        name = request.json["name"].upper()
        if name in processes:
            p = processes[name]
            if p.is_alive():
                p.kill()
                p.join()
            del processes[name]
            return {"deleted": True}
        return {"msg": "Process not found."}
    except:
        return {"msg": "Bad request"}

@app.route("/list-assets", methods=["GET"])
@login_required
def list_assets():
    return [n for n in bots]