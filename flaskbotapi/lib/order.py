import requests

def buy(symbol):
    response = requests.post("http://order:3002/buy-position", json={"symbol": symbol}).json()
    return response

def sell(symbol):
    response = requests.post("http://order:3002/sell-position", json={"symbol": symbol}).json()
    return response

def borrowAndSell(symbol, leverage=1):
    response = requests.post("http://order:3002/borrow-n-sell", json={"symbol": symbol, "leverage": leverage}).json()
    return response

def borrowAndBuy(symbol, leverage=1):
    response = requests.post("http://order:3002/borrow-n-buy", json={"symbol": symbol, "leverage": leverage}).json()
    return response

def buyWithQt(symbol, qt):
    response = requests.post("http://order:3002/buy-n-repay", json={"symbol": symbol, "qt": qt}).json()
    return response

def sellWithQt(symbol, qt):
    response = requests.post("http://order:3002/sell-n-repay", json={"symbol": symbol, "qt": qt}).json()
    return response