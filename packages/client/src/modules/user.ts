import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  socketId: string;
  nickName: string;
  //   host: boolean; //todo
  stream: MediaStream;
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
  },
});

export const { addUser, deleteUser, initializeUser } = usersSlice.actions;

export default usersSlice.reducer;
