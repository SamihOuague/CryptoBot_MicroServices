import requests

def login(body):
    response = requests.post("http://auth:3001/login", json=body).json()
    return response

def update(body, token):
    response = requests.post("http://auth:3001/update-api", headers={"Authorization": token}, json=body).json()
    return response

def jwt_ping(token):
    response = requests.get("http://auth:3001/ping", headers={"Authorization": token}).json()
    return response