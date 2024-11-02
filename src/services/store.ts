import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = () => useDispatch();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;

// селектор всевластия: поиск данных заказа из всех доступных локальных источников
export const selectOrder = (number: string) => (state: RootState) => {
  // поиск в загруженных заказах пользователя
  if (state.orders.orders.length) {
    const order = state.orders.orders.find((item) => item.number === +number);
    if (order) return order;
  }
  // поиск в ленте заказов
  if (state.feed.orders.length) {
    const order = state.feed.orders.find((item) => item.number === +number);
    if (order) return order;
  }
  // может это был запрошенный заказ?
  if (state.order.orderRequestedByNumber?.number === +number) {
    return state.order.orderRequestedByNumber;
  }
  return null;
};
