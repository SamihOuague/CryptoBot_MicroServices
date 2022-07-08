import requests

def borrowAndSell():
    response = requests.post("http://manager:3002/sell-position").json()
    if "orderId" in response:
        return response
    else:
        return False

def closeAndRepay():
    response = requests.post("http://manager:3002/repay-position").json()
    if "orderId" in response:
        return response
    else:
        return False