from src.BinanceBot import BinanceBot
from time import sleep
import pandas as pd
import ta
import requests
from datetime import datetime

def priceActionBuy(candles):
    dates = [datetime.fromtimestamp(d[0]/1000) for d in candles]
    df = pd.DataFrame([c[1:] for c in candles], index=dates, columns=["open", "high", "low", "close", "volume"])
    im_indicator = ta.trend.IchimokuIndicator(high=df["high"], low=df["low"], window1=9, window2=26, window3=52)
    df["rsi"] = ta.momentum.RSIIndicator(df["close"], window=15).rsi()
    df["spanA"] = im_indicator.ichimoku_a()
    df["spanB"] = im_indicator.ichimoku_b()
    df["kijun"] = im_indicator.ichimoku_base_line()
    df["tenkan"] = im_indicator.ichimoku_conversion_line()
    df["EMA100"] = ta.trend.EMAIndicator(close=df["close"], window=100).ema_indicator()
    df["EMA150"] = ta.trend.EMAIndicator(close=df["close"], window=150).ema_indicator()
    if df["rsi"][-1] < 30 and df["kijun"][-1] > df["spanA"][-1] and df["EMA100"][-1] > df["EMA150"][-1]:
        return True
    return False

def priceActionSell(candles):
    dates = [datetime.fromtimestamp(d[0]/1000) for d in candles]
    df = pd.DataFrame([c[1:] for c in candles], index=dates, columns=["open", "high", "low", "close", "volume"])
    im_indicator = ta.trend.IchimokuIndicator(high=df["high"], low=df["low"], window1=9, window2=26, window3=52)
    df["rsi"] = ta.momentum.RSIIndicator(df["close"], window=15).rsi()
    df["spanA"] = im_indicator.ichimoku_a()
    df["spanB"] = im_indicator.ichimoku_b()
    df["kijun"] = im_indicator.ichimoku_base_line()
    df["tenkan"] = im_indicator.ichimoku_conversion_line()
    df["EMA100"] = ta.trend.EMAIndicator(close=df["close"], window=100).ema_indicator()
    df["EMA150"] = ta.trend.EMAIndicator(close=df["close"], window=150).ema_indicator()
    if df["rsi"][-1] > 70 and df["kijun"][-1] < df["spanA"][-1] and df["EMA150"][-1] > df["EMA100"][-1]:
        return True
    return False

sleep(5)

bot = BinanceBot(priceActionBuy, priceActionSell)

token = requests.post("http://manager:3002/bot-connect", json={"pwd": "helloworld123"}).json()["token"]

while True:
    try:
        r = bot.makeDecision(token)
        if "disabled" in r:
            sleep(300)
        else:
            sleep(15)
    except:
        print("ERROR")
        sleep(5)