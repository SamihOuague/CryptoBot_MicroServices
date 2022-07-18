import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, pingThunk, updateApiThunk, updateUserThunk } from "./api/authThunks";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null,
        apiSet: false,
        loading: true
    },
    extraReducers: (builder) => {
        builder.addCase(loginThunk.fulfilled, (state, action) => {
            localStorage.setItem("token", action.payload.token);
            state.token = action.payload.token;
        });

        builder.addCase(updateApiThunk.fulfilled, (state, action) => {
            if (action.payload.apiKey)
                state.apiSet = true
        });

        builder.addCase(updateUserThunk.fulfilled, (state) => {
            state.loading = false;
        });

        builder.addCase(updateUserThunk.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(updateUserThunk.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(pingThunk.fulfilled, (state, action) => {
            if (action.payload.connected) {
                state.token = localStorage.getItem("token");
                state.apiSet = action.payload.apikey;
                state.loading = false;
            } else {
                localStorage.removeItem("token");
                state.token = null;
                state.apiSet = false;
                state.loading = false;
            }
        });

        builder.addCase(pingThunk.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(pingThunk.rejected, (state) => {
            localStorage.removeItem("token");
            state.token = null;
            state.apiSet = false;
            state.loading = false;
        });
    }
});

export default authSlice.reducer;