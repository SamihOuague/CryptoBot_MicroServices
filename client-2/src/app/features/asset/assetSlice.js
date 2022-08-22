import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getProcessThunk = createAsyncThunk("asset/getProcess", async (name) => {
    let response = await (await fetch(`${process.env.REACT_APP_API_URL}/get/${name}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Barear ${localStorage.getItem("token")}`,
        }
    })).json();
    return response;
});

export const stopProcessThunk = createAsyncThunk("asset/stopProcess", async (data) => {
    let response = await (await fetch(`${process.env.REACT_APP_API_URL}/stop`, {
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

export const deleteProcessThunk = createAsyncThunk("asset/deleteProcess", async (data) => {
    let response = await (await fetch(`${process.env.REACT_APP_API_URL}/delete`, {
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

export const restartProcessThunk = createAsyncThunk("asset/restart", async (data) => {
    let response = await (await fetch(`${process.env.REACT_APP_API_URL}/restart`, {
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

export const assetSlice = createSlice({
    name: "asset",
    initialState: {
        asset: null,
        pending: true,
    },
    reducers: {
        resetState: (state) => {
            state.pending = true;
            state.asset = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProcessThunk.fulfilled, (state, action) => {
            if (action.payload.name) state.asset = action.payload;
            state.pending = false;
        }).addCase(getProcessThunk.pending, (state) => {
            state.pending = true;
        }).addCase(getProcessThunk.rejected, (state) => {
            state.pending = false;
        });

        builder.addCase(stopProcessThunk.fulfilled, (state, action) => {
            if (action.payload.name) state.asset = action.payload;
            state.pending = false;
        }).addCase(stopProcessThunk.pending, (state) => {
            state.pending = true;
        }).addCase(stopProcessThunk.rejected, (state) => {
            state.pending = false;
        });

        builder.addCase(restartProcessThunk.fulfilled, (state, action) => {
            if (action.payload.name)
                state.asset = action.payload;
            state.pending = false;
        }).addCase(restartProcessThunk.pending, (state) => {
            state.pending = true;
        }).addCase(restartProcessThunk.rejected, (state) => {
            state.pending = false;
        });

        builder.addCase(deleteProcessThunk.fulfilled, (state, action) => {
            if (action.payload.deleted)
                state.asset = null;
            state.pending = false;
            state.redirect = true;
        }).addCase(deleteProcessThunk.pending, (state) => {
            state.pending = true;
        }).addCase(deleteProcessThunk.rejected, (state) => {
            state.asset = null;
            state.pending = false;
            state.redirect = true;
        });
    }
});

export const { resetState } = assetSlice.actions;

export default assetSlice.reducer;