import requests

def getCandles(symbol, period = "1m", start = ""):
    url = "https://api.binance.com/api/v3/klines?symbol={}&interval={}".format(symbol, period)
    if start != "":
        url = url + "&startTime={}".format(start)
    try:
        return [[float(y) for y in x[:6]] for x in requests.get(url).json()]
    except:
        return []

def ticker(symbol = "BNBUSDT"):
    return requests.get("https://api.binance.com/api/v3/ticker/price?symbol="+symbol).json()