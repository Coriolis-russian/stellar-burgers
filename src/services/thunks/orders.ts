import { createAsyncThunk } from '@reduxjs/toolkit';
import { ORDERS_SLICE_NAME } from '@slices/sliceNames';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

export const getOrders = createAsyncThunk<TOrder[], void>(
  `${ORDERS_SLICE_NAME}/get`,
  () => getOrdersApi().then((resp) => resp)
);
