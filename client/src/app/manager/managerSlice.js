import { createSlice } from "@reduxjs/toolkit";
import { getAssetThunk, getSymbolThunk, switchSymbolThunk,  } from "./api/managerThunks";

export const managerSlice = createSlice({
    name: "manager",
    initialState: {
        symbol: null,
        assets: null,
        loading: true,
    },
    reducers: {
        loadingDone: (state) => {
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAssetThunk.fulfilled, (state, action) => {
            state.assets = action.payload;
        });

        builder.addCase(getSymbolThunk.fulfilled, (state, action) => {
            state.symbol = action.payload;
        });

        builder.addCase(switchSymbolThunk.fulfilled, (state, action) => {
            state.symbol = action.payload;
        });
    }
});

export const { loadingDone } = managerSlice.actions;

export default managerSlice.reducer;