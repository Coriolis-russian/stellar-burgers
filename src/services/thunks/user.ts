import { createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { USER_SLICE_NAME } from '@slices/sliceNames';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TAuthResponse,
  TLoginData,
  TRegisterData,
  TUserResponse,
  updateUserApi
} from '@api';

export const fetchUser = createAsyncThunk<TUser, void>(
  `${USER_SLICE_NAME}/get`,
  () => getUserApi().then((resp) => resp.user)
);

export const registerUser = createAsyncThunk<TAuthResponse, TRegisterData>(
  `${USER_SLICE_NAME}/register`,
  (data) => registerUserApi(data).then((resp) => resp)
);

export const loginUser = createAsyncThunk<TAuthResponse, TLoginData>(
  `${USER_SLICE_NAME}/login`,
  (data) => loginUserApi(data).then((resp) => resp)
);

export const logoutUser = createAsyncThunk(
  `${USER_SLICE_NAME}/logout`,
  logoutApi
);

export const updateUser = createAsyncThunk<
  TUserResponse,
  Partial<TRegisterData>
>(`${USER_SLICE_NAME}/update`, updateUserApi);
