from lib.binance import getCandles
from lib.order import buy, sell
from lib.manager import update_log
import time

class CryptoGenerator:
    def __init__(self, symbol, side="SHORT"):
        if side == "LONG":
            self.side = side
        else:
            self.side = "SHORT"
        self.candles = getCandles(symbol, "1m")
        self.candles_5m = getCandles(symbol, "5m")
        self.symbol = symbol
        self.positionOn = False
        self.stopLoss = 0
        self.takeProfit = 0

    def updateCandle(self):
        candle = getCandles(self.symbol, "1m", int(self.candles[-1][0] + 60000))
        if (len(candle) > 0):
            self.candles = self.candles[len(candle):] + candle
            return True
        elif (len(candle) == 500):
            self.candles = candle
            return True
        else:
            return False

    def updateCandle5m(self):
        candle = getCandles(self.symbol, "5m", int(self.candles[-1][0] + (60000*5)))
        if (len(candle) > 0):
            self.candles = self.candles[len(candle):] + candle
            return True
        elif (len(candle) == 500):
            self.candles = candle
            return True
        else:
            return False

    def shortPosition(self):
        response = sell(self.symbol)
        if "orderId" in response:
            self.positionOn = self.candles[-1][4]
            self.stopLoss = self.candles[-1][4] + (self.candles[-1][4] * float(response["stoploss"]))
            self.takeProfit = self.candles[-1][4] - (self.candles[-1][4] * float(response["takeprofit"]))
        return response
    
    def longPosition(self):
        response = buy(self.symbol)
        if "orderId" in response:
            self.positionOn = self.candles[-1][4]
            self.stopLoss = self.candles[-1][4] + (self.candles[-1][4] * float(response["stoploss"]))
            self.takeProfit = self.candles[-1][4] - (self.candles[-1][4] * float(response["takeprofit"]))
        return response

    def closePosition(self):
        if self.side == "LONG":
            response = sell(self.symbol)
            if "orderId" in response:
                self.positionOn = False
            return response
        else:
            response = buy(self.symbol)
            if "orderId" in response:
                self.positionOn = False
            return response

    def run(self, action_func):
        while True:
            self.updateCandle5m()
            if (self.updateCandle()):
                if not self.positionOn and action_func(self.candles):
                    self.shortPosition()
                elif self.positionOn:
                    if self.candles[-1][4] >= self.stopLoss:
                        self.closePosition()
                        percent = round(((float(self.positionOn) - float(self.candles[-1][4])) / float(self.positionOn))*100, 2)
                        update_log({"log": "LOSS {}%".format(percent)})
                    elif self.candles[-1][4] <= self.takeProfit:
                        self.closePosition()
                        percent = round(((float(self.positionOn) - float(self.candles[-1][4])) / float(self.positionOn))*100, 2)
                        update_log({"log": "WIN {}%".format(percent)})
            time.sleep(5)