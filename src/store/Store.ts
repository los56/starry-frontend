import { configureStore } from "@reduxjs/toolkit";
import UserInfoReducer from "./slice/UserInfoSlice";
import RequestUpdateReducer from './slice/RequestUpdateSlice';

export const store = configureStore({
    reducer: {
        userinfo: UserInfoReducer,
        requestUpdate: RequestUpdateReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;