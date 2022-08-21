import { configureStore } from "@reduxjs/toolkit";
import auth from "./features/auth/authSlice";
import param from "./features/param/paramSlice";
import main from "./features/main/mainSlice";

export const store = configureStore({
    reducer: {
        auth,
        param,
        main,
    }
});