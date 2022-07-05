import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MasterState {
  isLoaderOpen: boolean;
  isWalletConnected: boolean;
  address: string;
  signer: any;
  userID: string;
  alertOpen: boolean;
  alertMessage: string | null;
  alertColor: string;
}

const initialState: MasterState = {
  isLoaderOpen: false,
  isWalletConnected: false,
  address: '',
  signer: {},
  userID: '',
  alertMessage: '',
  alertOpen: false,
  alertColor: 'success'
};

export const masterSlice = createSlice({
  name: 'masterDataReducer',
  initialState,
  reducers: {
    setWalletAddress: (state: MasterState, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    setWalletConnected: (state: MasterState, action: PayloadAction<boolean>) => {
      state.isWalletConnected = action.payload;
    },
    setSigner: (state: MasterState, action: PayloadAction<any>) => {
      state.signer = action.payload;
    },
    setUserId: (state: MasterState, action: PayloadAction<string>) => {
      state.userID = action.payload;
    },
    setLoaderOpen: (state: MasterState, action: PayloadAction<boolean>) => {
      state.isLoaderOpen = action.payload;
    },
    setAlert: (state: MasterState, action: PayloadAction<{ color: string; message: string }>) => {
      state.alertOpen = true;
      state.alertMessage = action.payload.message;
      state.alertColor = action.payload.color;
    },
    closeAlert: (state: MasterState) => {
      state.alertMessage = null;
      state.alertOpen = false;
    }
  }
});

export const { setWalletAddress, setSigner, setWalletConnected, setUserId, setAlert, closeAlert, setLoaderOpen } =
  masterSlice.actions;

export default masterSlice.reducer;
