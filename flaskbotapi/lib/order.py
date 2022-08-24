import requests

def buy(symbol):
    response = requests.post("http://order:3002/buy-position", json={"symbol": symbol}).json()
    return response

def sell(symbol):
    response = requests.post("http://order:3002/sell-position", json={"symbol": symbol}).json()
    return response