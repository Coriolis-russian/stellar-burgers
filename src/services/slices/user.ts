import { RequestStatus, TUser } from '@utils-types';
import { createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { USER_SLICE_NAME } from '@slices/sliceNames';
import {
  fetchUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser
} from '../thunks/user';

type UserState = {
  user: TUser | null;
  requestStatus: RequestStatus;
  isUserActual: boolean;
  lastError: string | null;
};

const initialState: UserState = {
  user: null,
  requestStatus: RequestStatus.Idle,
  // актуально ли поле user (загружен или наоборот, по токену нет пользователя)
  isUserActual: false,
  lastError: null
};

const handleLoading = (state: UserState) => {
  state.requestStatus = RequestStatus.Loading;
  state.lastError = null;
};

const handleError = (
  state: UserState,
  action: PayloadAction<unknown, any, any, SerializedError>
) => {
  state.requestStatus = RequestStatus.Failed;
  state.lastError = action.error.message || '';
};

const user = createSlice({
  name: USER_SLICE_NAME,
  initialState,
  selectors: {
    selectUser: (state) => state.user,
    selectIsUserActual: (state) => state.isUserActual,
    selectUserName: (state) => state.user?.name || '',
    selectLastError: (state) => state.lastError,
    selectPendingState: (state) =>
      state.requestStatus === RequestStatus.Loading,
    selectIsUserAuth: (state) => !!state.user
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.requestStatus = RequestStatus.Success;
        state.user = action.payload.user;
        state.isUserActual = true;
      })
      .addCase(loginUser.pending, handleLoading)
      .addCase(loginUser.rejected, handleError);
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.requestStatus = RequestStatus.Success;
        state.user = action.payload;
        state.isUserActual = true;
      })
      .addCase(fetchUser.pending, handleLoading)
      .addCase(fetchUser.rejected, (state, action) => {
        state.requestStatus = RequestStatus.Failed;
        state.lastError = action.error.message || '';
        state.user = null;
        state.isUserActual = true;
      });
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.requestStatus = RequestStatus.Success;
        state.isUserActual = true;
      })
      .addCase(registerUser.pending, handleLoading)
      .addCase(registerUser.rejected, handleError);
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.requestStatus = RequestStatus.Success;
        // при успешном логауте удалить данные пользователя
        state.user = null;
        state.isUserActual = true;
      })
      .addCase(logoutUser.pending, handleLoading)
      .addCase(logoutUser.rejected, handleError);
    builder
      .addCase(updateUser.fulfilled, (state, action) => {
        state.requestStatus = RequestStatus.Success;
        state.user = action.payload.user;
      })
      .addCase(updateUser.pending, handleLoading)
      .addCase(updateUser.rejected, handleError);
  }
});

export const userActions = {
  ...user.actions,
  fetch: fetchUser,
  login: loginUser,
  logout: logoutUser,
  register: registerUser,
  update: updateUser
};
export const userSelectors = user.selectors;
export default user;
