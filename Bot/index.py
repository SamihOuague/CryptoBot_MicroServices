from src.BinanceBot import BinanceBot
from time import sleep
import numpy as np
import requests

def priceAction(candles):
    ma500 = np.average([x[4] for x in candles])
    ma25 = np.average([x[4] for x in candles[-25:]])
    ma7 = np.average([x[4] for x in candles[-7:]])
    print(candles[-1][4], ma7, ma25, ma500)
    if ma500 > ma25 > candles[-1][4] > ma7:
        return True
    return False

bot = BinanceBot(priceAction)

while True:
    try:
        print(requests.get("http://manager:3002/get-assets").json())
        print(bot.makeDecision())
        sleep(15)
    except:
        print("ERROR")
        sleep(5)