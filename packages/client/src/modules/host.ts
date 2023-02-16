import { createSlice } from '@reduxjs/toolkit';

export const hostSlice = createSlice({
  name: 'host',
  initialState: false,

  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    behost: (state) => (state = true),
    outRoom: (state) => (state = false),
  },
});

export const { behost, outRoom } = hostSlice.actions;

export default hostSlice.reducer;
