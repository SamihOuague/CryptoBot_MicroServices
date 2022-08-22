import requests

def buy():
    response = requests.post("http://manager:3002/buy-position").json()
    return response

def sell():
    response = requests.post("http://manager:3002/sell-position").json()
    return response

def all_assets():
    response = requests.get("http://manager:3002/all-assets").json()
    return [x["symbol"] for x in response]