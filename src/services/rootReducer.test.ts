import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import constructor from '@slices/constructor';
import feed from '@slices/feed';
import { RequestStatus } from '@utils-types';
import ingredients from '@slices/ingredients';
import order from '@slices/order';
import orders from '@slices/orders';
import user from '@slices/user';
import {
  constructorInitialState,
  feedInitialState,
  ingredientsInitialState,
  orderInitialState,
  ordersInitialState,
  userInitialState
} from './test-data';

test('Инициализация rootReducer', () => {

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      burgerConstructor: constructorInitialState,
      feed: feedInitialState,
      ingredients: ingredientsInitialState,
      order: orderInitialState,
      orders: ordersInitialState,
      user: userInitialState
    }
  });

  expect(store.getState().burgerConstructor).toEqual(
    constructor.reducer(constructorInitialState, {
      type: 'UNKNOWN_ACTION'
    })
  );

  expect(store.getState().feed).toEqual(
    feed.reducer(feedInitialState, {
      type: 'UNKNOWN_ACTION'
    })
  );

  expect(store.getState().ingredients).toEqual(
    ingredients.reducer(ingredientsInitialState, {
      type: 'UNKNOWN_ACTION'
    })
  );

  expect(store.getState().order).toEqual(
    order.reducer(orderInitialState, {
      type: 'UNKNOWN_ACTION'
    })
  );

  expect(store.getState().orders).toEqual(
    orders.reducer(ordersInitialState, {
      type: 'UNKNOWN_ACTION'
    })
  );

  expect(store.getState().user).toEqual(
    user.reducer(userInitialState, {
      type: 'UNKNOWN_ACTION'
    })
  );
});
