import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const listAsyncThunk = createAsyncThunk("main/list", async () => {
    let response = await (await fetch("http://api.localhost/", {
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
    let response = await (await fetch("http://api.localhost/start", {
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

export const stopProcessAsyncThunk = createAsyncThunk("main/stop", async (data) => {
    let response = await (await fetch("http://api.localhost/stop", {
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

export const mainSlice = createSlice({
    name: "main",
    initialState: {
        processes: [],
        pending: false,
    },
    extraReducers: (builder) => {
        builder.addCase(listAsyncThunk.fulfilled, (state, action) => {
            if (action.payload.processes) state.processes = action.payload.processes;
        }).addCase(listAsyncThunk.pending, (state) => {
            state.pending = true;
        }).addCase(listAsyncThunk.rejected, (state) => {
            state.pending = false;
            state.processes = []
        });

        builder.addCase(startProcessAsyncThunk.fulfilled, (state, action) => {
            if (action.payload.processes) state.processes = action.payload.processes;
        }).addCase(startProcessAsyncThunk.pending, (state) => {
            state.pending = true;
        }).addCase(startProcessAsyncThunk.rejected, (state) => {
            state.pending = false;
        });

        builder.addCase(stopProcessAsyncThunk.fulfilled, (state, action) => {
            if (action.payload.processes) state.processes = action.payload.processes;
        }).addCase(stopProcessAsyncThunk.pending, (state) => {
            state.pending = true;
        }).addCase(stopProcessAsyncThunk.rejected, (state) => {
            state.pending = false;
        });
    }
});

export default mainSlice.reducer