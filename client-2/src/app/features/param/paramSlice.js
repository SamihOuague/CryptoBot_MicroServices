import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const updateApiThunk = createAsyncThunk("param/updateApi", async (data) => {
    const response = await (await fetch(`${process.env.REACT_APP_API_URL}/update-api`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Barear ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data)
    })).json();
    return response;
});

export const paramSlice = createSlice(
    {
        name: "param",
        initialState: {
            loading: false,
            msg: "",
        },
        extraReducers: (builder) => {
            builder.addCase(updateApiThunk.fulfilled, (state) => {
                state.loading = false;
                state.msg = "API Key update succeed.";
            }).addCase(updateApiThunk.pending, (state) => {
                state.loading = true;
            }).addCase(updateApiThunk.rejected, (state) => {
                state.loading = false;
                state.msg = "Invalid API Key !"
            });
        }
    }
);

export default paramSlice.reducer;