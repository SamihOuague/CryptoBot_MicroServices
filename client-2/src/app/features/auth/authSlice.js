import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loginAsyncThunk = createAsyncThunk("auth/login", async (data) => {
    try {
        console.log(process.env.REACT_APP_API_URL);
        const response = await (await fetch(`${process.env.REACT_APP_API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(data),
        })).json();
        return response;
    } catch(err) {
        return err;
    }
});

export const pingAsyncThunk = createAsyncThunk("auth/ping", async () => {
    try {
        const response = await (await fetch(`${process.env.REACT_APP_API_URL}/ping`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Barear ${localStorage.getItem("token")}`,
            }
        })).json();
        return response;
    } catch(err) {
        return err;
    }
});

export const updateLogAsyncThunk = createAsyncThunk("auth/updateLog", async (data) => {
    try {
        const response = await (await fetch(`${process.env.REACT_APP_API_URL}/update-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Barear ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(data),
        })).json();
        return response;
    } catch(err) {
        return err;
    }
});


const initialState = {
    token: localStorage.getItem("token"),
    pending: false,
    apiKey: false,
    connected: false
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logOut: (state) => {
            state.token = null;
            localStorage.removeItem("token");
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginAsyncThunk.fulfilled, (state, action) => {
            if (action.payload.token) {
                state.token = action.payload.token;
                state.apiKey = action.payload.apiKey;
                localStorage.setItem("token", action.payload.token);
            }
            state.pending = false;
        }).addCase(loginAsyncThunk.pending, (state) => {
            state.token = null;
            state.pending = true;
        }).addCase(loginAsyncThunk.rejected, (state) => {
            state.token = null;
            state.pending = false;
        });

        builder.addCase(pingAsyncThunk.fulfilled, (state, action) => {
            if (!action.payload.connected) {
                state.token = null;
                state.pending = false;
                localStorage.removeItem("token");
            } else {
                state.apiKey = action.payload.apiKey;
                state.connected = true;
            }
        }).addCase(pingAsyncThunk.pending, (state) => {
            state.pending = true;
        }).addCase(pingAsyncThunk.rejected, (state) => {
            state.token = null;
            state.pending = false;
            state.connected = false;
            localStorage.removeItem("token");
        });

        builder.addCase(updateLogAsyncThunk.fulfilled, (state) => {
            state.pending = false;
        }).addCase(updateLogAsyncThunk.pending, (state) => {
            state.pending = true;
        }).addCase(updateLogAsyncThunk.rejected, (state) => {
            state.pending = false;
        });
    }
});

export const { logOut } = authSlice.actions;

export default authSlice.reducer;