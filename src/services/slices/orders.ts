import { RequestStatus, TOrder } from '@utils-types';
import { createSlice } from '@reduxjs/toolkit';
import { ORDERS_SLICE_NAME } from '@slices/sliceNames';
import { getOrders } from '../thunks/orders';

type OrdersState = {
  orders: TOrder[];
  status: RequestStatus;
  error: string | null;
};

const initialState: OrdersState = {
  orders: [],
  status: RequestStatus.Idle,
  error: null
};

const orders = createSlice({
  name: ORDERS_SLICE_NAME,
  initialState,
  selectors: {
    selectOrders: (state) => state.orders,
    selectIsLoading: (state) => state.status === RequestStatus.Loading
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.fulfilled, (state, action) => {
        state.status = RequestStatus.Success;
        state.orders = action.payload;
        state.error = '';
      })
      .addCase(getOrders.pending, (state) => {
        state.status = RequestStatus.Loading;
        state.error = '';
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.status = RequestStatus.Failed;
        state.error = action.error.message || '';
      });
  }
});

export const ordersActions = {
  ...orders.actions,
  get: getOrders
};
export const ordersSelectors = orders.selectors;
export default orders;
