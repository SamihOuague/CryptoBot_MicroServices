import { createAsyncThunk } from "@reduxjs/toolkit";

const getAsset = async () => {
    return (await fetch("http://localhost:3002/get-assets")).json();
}

const getSymbol = async () => {
    return (await fetch("http://localhost:3002/bnbusdt")).json();
}

export const getAssetThunk = createAsyncThunk("manager/getAssets", async () => {
    let response = await getAsset();
    return response;
});

export const getSymbolThunk = createAsyncThunk("manager/getSymbol", async () => {
    let response = await getSymbol();
    return response;
});