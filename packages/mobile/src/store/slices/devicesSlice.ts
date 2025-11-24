import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Device } from '@/types/device';

interface DevicesState {
  devices: Device[];
  selectedDevice: Device | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DevicesState = {
  devices: [],
  selectedDevice: null,
  isLoading: false,
  error: null,
};

const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    setDevices: (state, action: PayloadAction<Device[]>) => {
      state.devices = action.payload;
    },
    setSelectedDevice: (state, action: PayloadAction<Device | null>) => {
      state.selectedDevice = action.payload;
    },
    updateDeviceStatus: (
      state,
      action: PayloadAction<{ id: string; status: 'online' | 'offline' }>
    ) => {
      const device = state.devices.find((d) => d.id === action.payload.id);
      if (device) {
        device.status = action.payload.status;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setDevices,
  setSelectedDevice,
  updateDeviceStatus,
  setLoading,
  setError,
} = devicesSlice.actions;
export default devicesSlice.reducer;
