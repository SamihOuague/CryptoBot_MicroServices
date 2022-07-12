import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, pingThunk, updateApiThunk } from "./api/authThunks";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null,
        apiSet: false
    },
    extraReducers: (builder) => {
        builder.addCase(loginThunk.fulfilled, (state, action) => {
            state.token = action.payload.token;
            localStorage.setItem("token", action.payload.token);
        });

        builder.addCase(updateApiThunk.fulfilled, (state, action) => {
            if (action.payload.apiKey)
                state.apiSet = true
        });

        builder.addCase(pingThunk.fulfilled, (state, action) => {
            state.token = localStorage.getItem("token");
            if (action.payload.connected)
                state.apiSet = action.payload.apikey;
            else {
                localStorage.removeItem("token");
                state.token = null;
            }
        });

        builder.addCase(pingThunk.rejected, (state) => {
            localStorage.removeItem("token");
            state.token = null;
            state.apiSet = false;
        });
    }
});

export default authSlice.reducer;