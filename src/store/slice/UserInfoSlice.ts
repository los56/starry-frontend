import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../Store";

interface InnerInfo {
    id: string;
    username: string;
    nickname: string;
    passwordChangeDate: Date;
}

interface UserInfo {
    isLogined: boolean;
    info?: InnerInfo
    follows: string[];
}

const initialState: UserInfo = {
    isLogined: false,
    follows: []
}

export const UserInfoSlice = createSlice({
    name: "userinfo",
    initialState,
    reducers: {
        remove: state => {
            state.isLogined = false;
            state.info = undefined;
        },
        update: (state, action: PayloadAction<InnerInfo>) => {
            state.isLogined = true;
            state.info = action.payload;
        },
        updateFollows: (state, action: PayloadAction<string[]>) => {
            state.follows = action.payload;
        }
    }
});

export const { remove, update, updateFollows } = UserInfoSlice.actions;
export const selectUserInfo = (state: RootState) => state.userinfo;
export default UserInfoSlice.reducer;