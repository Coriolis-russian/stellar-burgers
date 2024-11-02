import { getFeedsApi, TFeedsResponse } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { FEED_SLICE_NAME } from '@slices/sliceNames';

export const fetchFeeds = createAsyncThunk<TFeedsResponse, void>(
  `${FEED_SLICE_NAME}/getFeeds`,
  () => getFeedsApi().then((resp) => resp)
);
