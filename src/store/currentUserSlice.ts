import {createSlice} from '@reduxjs/toolkit';

interface currentUserState {
    currentUser: any
}

const initialState: currentUserState = {
    currentUser: null
}

const currentUserSlice = createSlice({
    name: 'current user slice',
    initialState,
    reducers: {
        setCurrentUser: (user, action) => {
            user.currentUser = action.payload;
        }
    }
});

export const {setCurrentUser} = currentUserSlice.actions;

export const selectCurrentUser = state => state.user;

export default currentUserSlice.reducer;