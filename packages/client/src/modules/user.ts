import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type * as poseDetection from '@tensorflow-models/pose-detection';

export interface UserState {
  socketId: string;
  nickName: string;
  host: boolean; //todo
  stream: MediaStream;
  isReady: boolean;
  imgSrc?: null | string;
  pose?: null | poseDetection.Pose;
}

interface IAttackerInfo {
  socketId: string;
  imgSrc: string;
  pose: poseDetection.Pose;
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
      const index = state.findIndex((user) => user.socketId === action.payload);
      state.forEach((user) => console.log(user.socketId));
      state[index].isReady = true;
    },
    unready: (state, action: PayloadAction<string>) => {
      state[state.findIndex((user) => user.socketId === action.payload)].isReady = false;
    },
    getAttackerInfo: (state, action: PayloadAction<IAttackerInfo>) => {
      const { socketId, imgSrc, pose } = action.payload;
      const index = state.findIndex((user) => user.socketId === socketId);
      state[index].imgSrc = imgSrc;
      state[index].pose = pose;
    },
    resetAttackerInfo: (state, action) => {
      const index = state.findIndex((user) => user.socketId === action.payload);
      state[index].imgSrc = null;
      state[index].pose = null;
    },
  },
});

export const {
  addUser,
  deleteUser,
  initializeUser,
  ready,
  unready,
  getAttackerInfo,
  resetAttackerInfo,
} = usersSlice.actions;

export default usersSlice.reducer;
