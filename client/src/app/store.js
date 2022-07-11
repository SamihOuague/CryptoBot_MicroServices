import { configureStore } from "@reduxjs/toolkit";
import ManagerReducer from "./manager/managerSlice";

export const store = configureStore({
    reducer: {
        manager: ManagerReducer,
    }
});