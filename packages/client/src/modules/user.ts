import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface UserState {
  socketId: string;
  nickName: string;
  host: boolean; //todo
  stream: MediaStream;
  isReady: boolean;
}

export const usersSlice = createSlice({
  name: 'users',
  initialState: [] as UserState[],
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addUser: (state, action: PayloadAction<UserState>) => {
      state.push(action.payload);
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.splice(
        state.findIndex((user) => user.socketId === action.payload),
        1,
      );
    },
    initializeUser: (state) => {
      state.length = 0;
    },
    ready: (state, action: PayloadAction<string>) => {
      let index = state.findIndex((user) => user.socketId === action.payload);
      state.forEach((user) => console.log(user.socketId));
      state[index].isReady = true;
    },
    unready: (state, action: PayloadAction<string>) => {
      state[state.findIndex((user) => user.socketId === action.payload)].isReady = false;
    },
  },
});

export const { addUser, deleteUser, initializeUser, ready, unready } = usersSlice.actions;

export default usersSlice.reducer;
