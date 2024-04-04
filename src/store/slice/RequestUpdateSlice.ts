import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../Store";

const initialState: {value: boolean} = {value: true};

export const RequestUpdateSlice = createSlice({
    name: "requestUpdate",
    initialState,
    reducers: {
        update: (state) => {
            state.value = !state.value;
        }
    }
});

export const { update } = RequestUpdateSlice.actions;
export const selectFollowing = (state: RootState) => state.requestUpdate;
export default RequestUpdateSlice.reducer;