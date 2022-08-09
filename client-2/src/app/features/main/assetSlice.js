import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getAssetsThunk = createAsyncThunk("asset/getAsset", async (asset) => {
    let response = await (await fetch(`http://51.83.43.54:3002/${asset}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Barear ${localStorage.getItem("token")}`,
        }
    })).json();
    return response;
});

export const switchSymbolThunk = createAsyncThunk("asset/switchAsset", async (symbol) => {
    let response = await (await fetch(`http://51.83.43.54:3002/switch/${symbol}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Barear ${localStorage.getItem("token")}`
        }
    })).json();
    return response;
});

export const assetSlice = createSlice({
    name: "asset",
    initialState: {
        wallets: null,
        symbol: null,
        loading: false,
        loadingSwitch: false,
        status: null,
    },
    extraReducers: (builder) => {
        builder.addCase(getAssetsThunk.fulfilled, (state, action) => {
            if (action.payload.asset) {
                state.wallets = action.payload.asset;
                state.symbol = action.payload.symbol
            }
            state.loading = false;
            state.status = "Succeed"
        }).addCase(getAssetsThunk.pending, (state) => {
            state.loading = true;
            state.status = "Pending"
        }).addCase(getAssetsThunk.rejected, (state) => {
            state.loading = false;
            state.status = "Rejected"
        });
        
        builder.addCase(switchSymbolThunk.fulfilled, (state, action) => {
            if (action.payload.symbol)
                state.symbol = action.payload;
            state.loadingSwitch = false;
        }).addCase(switchSymbolThunk.pending, (state) => {
            state.loadingSwitch = true;
        });
    }
});

export default assetSlice.reducer;