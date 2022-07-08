import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: "",
    },
    reducer: {

    }
});

export default authSlice.reducer;