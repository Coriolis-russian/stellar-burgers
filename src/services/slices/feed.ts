import { RequestStatus, TOrder } from '@utils-types';
import { createSlice } from '@reduxjs/toolkit';
import { FEED_SLICE_NAME } from '@slices/sliceNames';
import { fetchFeeds } from '../thunks/feed';

type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  status: RequestStatus;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  status: RequestStatus.Idle
};

const feed = createSlice({
  name: FEED_SLICE_NAME,
  initialState,
  selectors: {
    selectOrders: (state) => state.orders,
    selectTotal: (state) => state.total,
    selectTotalToday: (state) => state.totalToday,
    selectIsLoading: (state) =>
      state.status === RequestStatus.Loading ||
      state.status === RequestStatus.Idle
  },
  reducers: {
    reset: (state) => {
      state.orders = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(fetchFeeds.rejected, (state) => {
        state.status = RequestStatus.Failed;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.status = RequestStatus.Success;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  }
});

export const feedActions = {
  ...feed.actions,
  fetch: fetchFeeds
};
export const feedSelectors = feed.selectors;
export default feed;
