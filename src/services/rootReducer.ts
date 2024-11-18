import ingredientsReducer from '@slices/ingredients';
import constructor from '@slices/constructor';
import userReducer from '@slices/user';
import feedReducer from '@slices/feed';
import orderReducer from '@slices/order';
import { combineReducers } from '@reduxjs/toolkit';
import ordersReducer from '@slices/orders';

const rootReducer = combineReducers({
  [ingredientsReducer.name]: ingredientsReducer.reducer,
  [constructor.name]: constructor.reducer,
  [userReducer.name]: userReducer.reducer,
  [feedReducer.name]: feedReducer.reducer,
  [orderReducer.name]: orderReducer.reducer,
  [ordersReducer.name]: ordersReducer.reducer
});

export default rootReducer;
