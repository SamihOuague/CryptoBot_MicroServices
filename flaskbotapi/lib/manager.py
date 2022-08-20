import requests

def buy():
    response = requests.post("http://manager:3002/buy-position").json()
    return response

def sell():
    response = requests.post("http://manager:3002/sell-position").json()
    return response