import { configureStore } from "@reduxjs/toolkit";
import ManagerReducer from "./manager/managerSlice";
import AuthReducer from "./auth/authSlice";

export const store = configureStore({
    reducer: {
        manager: ManagerReducer,
        auth: AuthReducer
    }
});