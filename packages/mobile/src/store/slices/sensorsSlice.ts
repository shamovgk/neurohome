import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SensorData } from '@/types/sensor';

interface SensorsState {
  currentData: SensorData | null;
  history: SensorData[];
  isLoading: boolean;
}

const initialState: SensorsState = {
  currentData: null,
  history: [],
  isLoading: false,
};

const sensorsSlice = createSlice({
  name: 'sensors',
  initialState,
  reducers: {
    setCurrentData: (state, action: PayloadAction<SensorData>) => {
      state.currentData = action.payload;
      state.history.unshift(action.payload);
      // Храним последние 100 записей
      if (state.history.length > 100) {
        state.history = state.history.slice(0, 100);
      }
    },
    setHistory: (state, action: PayloadAction<SensorData[]>) => {
      state.history = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCurrentData, setHistory, setLoading } = sensorsSlice.actions;
export default sensorsSlice.reducer;
