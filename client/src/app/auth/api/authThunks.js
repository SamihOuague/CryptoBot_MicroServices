import { createAsyncThunk } from "@reduxjs/toolkit";

const login = async (data) => {
    return (await fetch("http://51.83.43.54:3001/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(data)
    })).json();
};

const updateApi = async (data) => {
    return (await fetch("http://51.83.43.54:3001/update-api", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "authorization": "Barear " + data.token
        },
        body: JSON.stringify(data)
    })).json();
};

const updateUser = async (data) => {
    return (await fetch("http://51.83.43.54:3001/update-user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "authorization": "Barear " + data.token
        },
        body: JSON.stringify(data)
    })).json();
};

const ping = async (token) => {
    return (await fetch("http://51.83.43.54:3001/ping", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Barear " + token,
        }
    })).json();
};

export const loginThunk = createAsyncThunk("auth/login", async (data) => {
    let response = await login(data);
    return response;
});

export const updateApiThunk = createAsyncThunk("auth/updateApi", async (data) => {
    let response = await updateApi(data);
    return response;
});

export const updateUserThunk = createAsyncThunk("auth/updateUser", async (data) => {
    let response = await updateUser(data);
    return response;
});

export const pingThunk = createAsyncThunk("auth/ping", async (token) => {
    let response = await ping(token);
    return response;
});