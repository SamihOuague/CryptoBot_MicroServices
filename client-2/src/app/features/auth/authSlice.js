import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loginAsyncThunk = createAsyncThunk("auth/login", async (data) => {
    try {
        const response = await (await fetch("http://localhost:3001/login", {
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

export const updateLogAsyncThunk = createAsyncThunk("auth/updateLog", async (data) => {
    try {
        const response = await (await fetch("http://localhost:3001/update-user", {
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