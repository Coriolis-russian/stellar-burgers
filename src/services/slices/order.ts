import { createSlice } from '@reduxjs/toolkit';
import { ORDER_SLICE_NAME } from '@slices/sliceNames';
import { RequestStatus, TOrder } from '@utils-types';
import { getOrderByNumber, orderBurger } from '../thunks/order';

type OrderState = {
  orderPlaced: TOrder | null;
  statusOrderPlace: RequestStatus;
  orderRequestedByNumber: TOrder | null;
  statusOrderByNumber: RequestStatus;
  error: string | null;
};

const initialState: OrderState = {
  orderPlaced: null,
  statusOrderPlace: RequestStatus.Idle,
  orderRequestedByNumber: null,
  statusOrderByNumber: RequestStatus.Idle,
  error: null
};

const order = createSlice({
  name: ORDER_SLICE_NAME,
  initialState,
  selectors: {
    selectIsOrderByNumberPending: (state) =>
      state.statusOrderByNumber === RequestStatus.Loading,
    selectIsOrderPlacePending: (state) =>
      state.statusOrderPlace === RequestStatus.Loading,
    selectOrderPlaced: (state) => state.orderPlaced
  },
  reducers: {
    reset: (state) => {
      state.orderRequestedByNumber = initialState.orderRequestedByNumber;
      state.orderPlaced = initialState.orderPlaced;
      state.error = null;
      state.statusOrderByNumber = initialState.statusOrderByNumber;
      state.statusOrderPlace = initialState.statusOrderPlace;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.statusOrderPlace = RequestStatus.Success;
        state.orderPlaced = action.payload.order;
        state.error = '';
      })
      .addCase(orderBurger.pending, (state) => {
        state.statusOrderPlace = RequestStatus.Loading;
        state.error = '';
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.statusOrderPlace = RequestStatus.Failed;
        state.error = action.error.message || null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.statusOrderByNumber = RequestStatus.Success;
        state.orderRequestedByNumber = action.payload.orders[0];
        state.error = '';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.statusOrderByNumber = RequestStatus.Loading;
        state.error = '';
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.statusOrderByNumber = RequestStatus.Failed;
        state.error = action.error.message || null;
      });
  }
});

export const orderSelectors = order.selectors;
export const orderActions = {
  ...order.actions,
  order: orderBurger,
  get: getOrderByNumber
};
export default order;
