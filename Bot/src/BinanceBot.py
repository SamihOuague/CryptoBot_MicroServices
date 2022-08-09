from src.api.BinanceAPI import getCandles, ticker
import requests

class BinanceBot:
    def __init__(self, buySignal = False, sellSignal = False, symbol = "BNBUSDT"):
        self.symbol = symbol
        self.candles = getCandles(self.symbol, "1m")
        self.sellSignal = sellSignal
        self.buySignal = buySignal
        self.sellPosition = False
        self.buyPosition = False
        self.stopLoss = 0
        self.takeProfit = 0
    
    def updateCandles(self):
        c = getCandles(self.symbol, "1m", str(round(self.candles[-1][0] + 60000)))
        self.candles = self.candles[len(c):] + c
        return self.candles

    def makeDecision(self, token):
        price = float(ticker("BNBUSDT")["price"])
        self.updateCandles()
        if not self.sellPosition and not self.buyPosition:
            if self.sellSignal(self.candles):
                response = requests.post("http://manager:3002/sell-position", headers={"Authorization": "Barear {}".format(token)}).json()
                if "orderId" in  response:
                    self.sellPosition = price
                    self.stopLoss = price + (price * 0.01)
                    self.takeProfit = price - (price * 0.02)
                return response
            elif self.buySignal(self.candles):
                response = requests.post("http://manager:3002/buy-position", headers={"Authorization": "Barear {}".format(token)}).json()
                if "orderId" in  response:
                    self.sellPosition = price
                    self.stopLoss = price - (price * 0.01)
                    self.takeProfit = price + (price * 0.02)
                return response
        elif self.buyPosition and (price >= self.takeProfit or price <= self.stopLoss):
            response = requests.post("http://manager:3002/close-position", headers={"Authorization": "Barear {}".format(token)}).json()
            if "orderId" in  response:
                self.buyPosition = False
            return response
        elif self.sellPosition and (price >= self.stopLoss or price <= self.takeProfit):
            response = requests.post("http://manager:3002/repay-position", headers={"Authorization": "Barear {}".format(token)}).json()
            if "orderId" in  response:
                self.sellPosition = False
            return response
        return self.candles[-1]