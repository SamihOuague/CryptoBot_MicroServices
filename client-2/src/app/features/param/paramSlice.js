import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const updateApiThunk = createAsyncThunk("param/updateApi", async (data) => {
    const response = await (await fetch("http://localhost:3001/update-api", {
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
            builder.addCase(updateApiThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.msg = "API Key update succeed.";
            }).addCase(updateApiThunk.pending, (state) => {
                state.loading = true;
            }
            ).addCase(updateApiThunk.rejected, (state, action) => {
                state.loading = false;
                state.msg = "Invalid API Key !"
            });
        }
    }
);

export default paramSlice.reducer;