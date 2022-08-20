from lib.binance import getCandles
from lib.manager import buy, sell
import time

class BNBot:
    def __init__(self, symbol, side="SHORT"):
        if side == "LONG":
            self.side = side
        else:
            self.side = "SHORT"
        self.candles = getCandles(symbol, "1m")
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

    def longPosition(self):
        response = buy()
        if "orderId" in response:
            self.positionOn = True
            self.stopLoss = self.candles[-1][4] - (self.candles[-1][4] * response["stopLoss"])
            self.takeProfit = self.candles[-1][4] + (self.candles[-1][4] * response["takeProfit"])
        return response

    def closePosition(self):
        response = sell()
        if "orderId" in response:
            self.positionOn = False
        return response

    def run(self, action_func):
        while True:
            if (self.updateCandle()):
                if not self.positionOn and action_func(self.candles):
                    self.longPosition()
                elif self.positionOn:
                    if self.candles[-1][4] <= self.stopLoss or self.candles[-1][4] >= self.takeProfit:
                        self.closePosition()
            time.sleep(5)