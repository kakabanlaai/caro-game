import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';

export interface GameState {
  roomId: string;
  isInRoom: boolean;
  playerSymbol: 'x' | 'o';
  isPlayerTurn: boolean;
  isGameStarted: boolean;
  hasReval: boolean;
}

const initialState: GameState = {
  roomId: '',
  isInRoom: false,
  playerSymbol: 'x',
  isPlayerTurn: false,
  isGameStarted: false,
  hasReval: false,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setInRoom: (state, action: PayloadAction<boolean>) => {
      state.isInRoom = action.payload;
    },
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },
    setPlayerSymbol: (state, action: PayloadAction<'x' | 'o'>) => {
      state.playerSymbol = action.payload;
    },
    setPlayerTurn: (state, action: PayloadAction<boolean>) => {
      state.isPlayerTurn = action.payload;
    },
    setGameStarted: (state, action: PayloadAction<boolean>) => {
      state.isGameStarted = action.payload;
    },
    setHasReval: (state, action: PayloadAction<boolean>) => {
      state.hasReval = action.payload;
    },
    resetDefaultValue: (state) => {
      state = initialState;
    },
  },
});

export const {
  setInRoom,
  setRoomId,
  setPlayerSymbol,
  setPlayerTurn,
  setGameStarted,
  setHasReval,
  resetDefaultValue,
} = gameSlice.actions;

const gameReducer = gameSlice.reducer;

export default gameReducer;
