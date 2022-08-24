import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const listAsyncThunk = createAsyncThunk("main/list", async () => {
    let response = await (await fetch(`${process.env.REACT_APP_API_URL}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Barear ${localStorage.getItem("token")}`,
        }
    })).json();
    return response;
});

export const startProcessAsyncThunk = createAsyncThunk("main/start", async (data) => {
    let response = await (await fetch(`${process.env.REACT_APP_API_URL}/start`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Barear ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    })).json();
    return response;
});

export const getAssetsAsyncThunk = createAsyncThunk("main/getAssets", async () => {
    let response = await (await fetch(`${process.env.REACT_APP_API_URL}/list-assets`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Barear ${localStorage.getItem("token")}`,
        }
    })).json();
    return response;
});

export const mainSlice = createSlice({
    name: "main",
    initialState: {
        processes: [],
        pending: false,
        assets: [],
        apiNotSet: false,
    },
    extraReducers: (builder) => {
        builder.addCase(listAsyncThunk.fulfilled, (state, action) => {
            if (action.payload.processes) {
                state.processes = action.payload.processes;
                state.apiNotSet = false;
            }
            state.pending = false;
        }).addCase(listAsyncThunk.pending, (state) => {
            state.pending = true;
        }).addCase(listAsyncThunk.rejected, (state) => {
            state.pending = false;
            state.processes = []
        });

        builder.addCase(startProcessAsyncThunk.fulfilled, (state, action) => {
            if (action.payload.name) state.processes.push(action.payload);
            state.pending = false;
        }).addCase(startProcessAsyncThunk.pending, (state) => {
            state.pending = true;
        }).addCase(startProcessAsyncThunk.rejected, (state) => {
            state.pending = false;
        });

        builder.addCase(getAssetsAsyncThunk.fulfilled, (state, action) => {
            if (!action.payload.msg) { 
                state.assets = action.payload; 
                state.apiNotSet = false;
            } else state.apiNotSet = true;
        }).addCase(getAssetsAsyncThunk.pending, (state) => {
            state.pending = true;
        }).addCase(getAssetsAsyncThunk.rejected, (state) => {
            state.pending = false;
        });

    }
});

export default mainSlice.reducer