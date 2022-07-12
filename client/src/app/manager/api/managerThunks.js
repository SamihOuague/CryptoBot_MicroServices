import { createAsyncThunk } from "@reduxjs/toolkit";

const getAsset = async (token) => {
    return (await fetch("http://51.83.43.54:3002/get-assets", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Barear " + token
        }
    })).json();
}

const getSymbol = async (token) => {
    return (await fetch("http://51.83.43.54:3002/bnbusdt",  {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Barear " + token
        }
    })).json();
}

const switchSymbol = async (token) => {
    return (await fetch("http://51.83.43.54:3002/switch/bnbusdt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Barear " + token
        }
    })).json();
}

export const getAssetThunk = createAsyncThunk("manager/getAssets", async (token) => {
    let response = await getAsset(token);
    return response;
});

export const getSymbolThunk = createAsyncThunk("manager/getSymbol", async (token) => {
    let response = await getSymbol(token);
    return response;
});

export const switchSymbolThunk = createAsyncThunk("manager/switchSymbol", async (token) => {
    let response = await switchSymbol(token);
    return response;
});