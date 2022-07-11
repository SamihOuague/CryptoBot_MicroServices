from src.api.BinanceAPI import getCandles, ticker
import requests

class BinanceBot:
    def __init__(self, sellAction = False, symbol = "BNBUSDT"):
        self.symbol = symbol
        self.candles = getCandles(self.symbol, "1m")
        self.sellAction = sellAction
        self.sellPosition = False
        self.stopLoss = 0
        self.takeProfit = 0
    
    def updateCandles(self):
        c = getCandles(self.symbol, "1m", str(round(self.candles[-1][0] + 60000)))
        self.candles = self.candles[len(c):] + c
        return self.candles

    def makeDecision(self):
        price = float(ticker("BNBUSDT")["price"])
        self.updateCandles()
        if not self.sellPosition and self.sellAction(self.candles):
            response = requests.post("http://manager:3002/sell-position").json()
            if "orderId" in  response:
                self.sellPosition = price
                self.stopLoss = price + (price * 0.01)
                self.takeProfit = price - (price * 0.02)
            return response
        elif self.sellPosition and price >= self.stopLoss:
            response = requests.post("http://manager:3002/repay-position").json()
            if "orderId" in  response:
                self.sellPosition = False
            return response
        elif self.sellPosition and price <= self.takeProfit:
            response = requests.post("http://manager:3002/repay-position").json()
            if "orderId" in  response:
                self.sellPosition = False
            return response
        return self.candles[-1]