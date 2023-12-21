import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './data/cart';

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export default store;
