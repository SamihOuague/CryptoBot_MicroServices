import { configureStore } from "@reduxjs/toolkit";
import auth from "./features/auth/authSlice";
import asset from "./features/main/assetSlice";
import param from "./features/param/paramSlice";

export const store = configureStore({
    reducer: {
        auth,
        asset,
        param,
    }
});