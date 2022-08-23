import requests

def buy():
    response = requests.post("http://order:3002/buy-position").json()
    return response

def sell():
    response = requests.post("http://order:3002/sell-position").json()
    return response