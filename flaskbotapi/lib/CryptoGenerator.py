from lib.binance import getCandles
from lib.order import buyWithQt, sellWithQt, borrowAndBuy, borrowAndSell
from lib.manager import get_asset
import time

class CryptoGenerator:
    def __init__(self, symbol, side="SHORT", leverage=5, slr=0.01, tpr=0.01):
        if side == "LONG":
            self.side = side
        else:
            self.side = "SHORT"
        self.candles_1m = getCandles(symbol, "1m")
        self.candles_5m = getCandles(symbol, "5m")
        self.symbol = symbol
        self.position_on = False
        self.stop_loss = 0
        self.take_profit = 0
        self.leverage = leverage
        self.initial_quote = float(get_asset("BNBUSDT")["assets"][0]["quoteAsset"]["free"]) * self.leverage
        self.posQt = 0
        self.slr = slr
        self.tpr = tpr


    def updateCandles(self):
        if (time.time() * 1000) >= int(self.candles_1m[-1][0] + 60000):
            candles_1m = getCandles(self.symbol, "1m", int(self.candles_1m[-1][0] + 60000))
            candles_5m = getCandles(self.symbol, "5m", int(self.candles_5m[-1][0] + (60000*5)))
            if len(candles_1m) > 0:
                if len(candles_1m) == 500:
                    self.candles_1m = candles_1m
                else:
                    self.candles_1m = self.candles_1m[len(candles_1m):] + candles_1m

            if len(self.candles_5m) > 0:
                if len(candles_5m) == 500:
                    self.candles_5m = candles_5m
                else:
                    self.candles_5m = self.candles_5m[len(candles_5m):] + candles_5m
            return True
        else:
            return False
    
    def longPosition(self):
        response = borrowAndBuy(self.symbol, self.leverage)
        if "executedQty" in response:
            self.posQt = response["executedQty"]
            self.stop_loss = self.candles_1m[-1][4] - (self.candles_1m[-1][4] * 0.01)
            self.take_profit = self.candles_1m[-1][4] + (self.candles_1m[-1][4] * 0.01)
            self.position_on = self.candles_1m[-1][4]
        return response
    
    def shortPosition(self):
        response = borrowAndSell(self.symbol, self.leverage)
        if "executedQty" in response:
            self.posQt = response["executedQty"]
            self.stop_loss = self.candles_1m[-1][4] + (self.candles_1m[-1][4] * 0.01)
            self.take_profit = self.candles_1m[-1][4] - (self.candles_1m[-1][4] * 0.01)
            self.position_on = self.candles_1m[-1][4]
        return response
    
    def stopLoss(self):
        if self.side == "LONG":
            response = sellWithQt(self.symbol, self.posQt)
            if "orderId" in response:
                self.position_on = False
            return response
        else:
            response = buyWithQt(self.symbol, (float(self.posQt) * self.candles_1m[-1][4]))
            if "orderId" in response:
                self.position_on = False
            return response

    def takeProfit(self):
        if self.side == "LONG":
            if (float(self.posQt) * self.candles_1m[-1][4]) > self.initial_quote:
                response = sellWithQt(self.symbol, (self.initial_quote / self.candles_1m[-1][4]))
                if "orderId" in response:
                    self.position_on = False    
                return response
            else:
                response = sellWithQt(self.symbol, self.posQt)
                if "orderId" in response:
                    self.position_on = False    
                return response
        else:
            if (float(self.posQt) * self.candles_1m[-1][4]) > self.initial_quote:
                response = buyWithQt(self.symbol, (float(self.posQt) * self.position_on))
                if "orderId" in response:
                    self.position_on = False    
                return response
            else:
                response = buyWithQt(self.symbol, (float(self.posQt) * self.candles_1m[-1][4]))
                if "orderId" in response:
                    self.position_on = False    
                return response
    def run(self, action_func):
        while True:
            if self.updateCandles():
                if action_func(self.candles_1m, self.candles_5m) and not self.position_on:
                    if self.side == "LONG":
                        self.longPosition()
                    else:
                        self.shortPosition()
                elif self.position_on and self.side == "LONG":
                    if self.candles_1m[-1][4] >= self.take_profit:
                        self.takeProfit()
                    elif self.candles_1m[-1][4] <= self.stop_loss:
                        self.stopLoss()
                elif self.position_on and self.side == "SHORT":
                    if self.candles_1m[-1][4] <= self.take_profit:
                        self.takeProfit()
                    elif self.candles_1m[-1][4] >= self.stop_loss:
                        self.stopLoss()
            time.sleep(5)

##### SELL RESPONSE #####
#{
#    'symbol': 'BNBUSDT', 
#    'orderId': 4302657985, 
#    'clientOrderId': 'default_425adfe35c784685ab0f3605ad6a', 
#    'transactTime': 1661965359352, 
#    'price': '0', 
#    'origQty': '0.044', 
#    'executedQty': '0.044', 
#    'cummulativeQuoteQty': '12.3728', 
#    'status': 'FILLED', 
#    'timeInForce': 'GTC', 
#    'type': 'MARKET', 
#    'side': 'SELL',
#    'fills': [{'price': '281.2', 'qty': '0.044', 'commission': '0.0123728', 'commissionAsset': 'USDT'}], 
#    'isIsolated': True
#}

##### BUY RESPONSE #####
#{
#    'symbol': 'BNBUSDT', 
#    'orderId': 4302660806, 
#    'clientOrderId': 'default_900a8fc98c8e4da8901e7e5bd60a', 
#    'transactTime': 1661965480980, 
#    'price': '0', 
#    'origQty': '0.044', 
#    'executedQty': '0.044', 
#    'cummulativeQuoteQty': '12.364', 
#    'status': 'FILLED', 
#    'timeInForce': 'GTC', 
#    'type': 'MARKET', 
#    'side': 'BUY', 
#    'fills': [{'price': '281', 'qty': '0.044', 'commission': '0.000033', 'commissionAsset': 'BNB'}], 
#    'isIsolated': True
#}
