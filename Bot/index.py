from src.BinanceBot import BinanceBot
from time import sleep
import numpy as np
import requests

def priceAction(candles):
    ma500 = np.average([x[4] for x in candles])
    ma25 = np.average([x[4] for x in candles[-25:]])
    ma7 = np.average([x[4] for x in candles[-7:]])
    if ma500 > ma25 > candles[-1][4] > ma7:
        return True
    return False

bot = BinanceBot(priceAction)

sleep(15)
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