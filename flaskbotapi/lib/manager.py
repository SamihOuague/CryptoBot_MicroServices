import requests

def all_assets():
    response = requests.get("http://manager:3003/all-pairs").json()
    try:
        return [x["symbol"] for x in response]
    except:
        return response

def add_asset(data):
    response = requests.post("http://manager:3003/add-asset", json=data).json()
    return response

def delete_asset(data):
    response = requests.delete("http://manager:3003/delete-asset", json=data).json()
    return response

def update_log(data):
    response = requests.post("http://manager:3003/update-log", json=data).json()
    return response

def update_asset(data):
    response = requests.put("http://manager:3003/update-asset", json=data).json()
    return response

def get_asset(symbol):
    response = requests.get("http://manager:3003/asset/{}".format(symbol)).json();
    return response