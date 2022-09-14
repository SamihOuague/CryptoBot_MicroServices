import pandas as pd
import pandas_ta as ta
from datetime import datetime

def short_strategy_eth(candles):
    df_15m = pd.DataFrame([c[1:] for c in candles], columns=["open", "high", "low", "close", "volume"])
    df_15m["EMA100"] = df_15m.ta.ema(100)
    df_15m["EMA300"] = df_15m.ta.ema(300)
    df_15m = df_15m.dropna()
    i = df_15m.index[-1]
    if df_15m["close"][i] < df_15m["EMA300"][i] < df_15m["EMA100"][i]:
        return True
    return False

def long_strategy_eth(candles):
    df_15m = pd.DataFrame([c[1:] for c in candles], columns=["open", "high", "low", "close", "volume"])
    df_15m["EMA100"] = df_15m.ta.ema(100)
    df_15m["EMA300"] = df_15m.ta.ema(300)
    df_15m = df_15m.dropna()
    i = df_15m.index[-1]
    if df_15m["close"][i] > df_15m["EMA300"][i] > df_15m["EMA100"][i]:
        return True
    return False