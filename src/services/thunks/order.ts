import { createAsyncThunk } from '@reduxjs/toolkit';
import { ORDER_SLICE_NAME, USER_SLICE_NAME } from '@slices/sliceNames';
import {
  getOrderByNumberApi,
  orderBurgerApi,
  TNewOrderResponse,
  TOrderResponse
} from '@api';

export const orderBurger = createAsyncThunk<TNewOrderResponse, string[]>(
  `${ORDER_SLICE_NAME}/order`,
  (data) => orderBurgerApi(data).then((resp) => resp)
);

export const getOrderByNumber = createAsyncThunk<TOrderResponse, number>(
  `${ORDER_SLICE_NAME}/get`,
  (number) => getOrderByNumberApi(number).then((resp) => resp)
);
