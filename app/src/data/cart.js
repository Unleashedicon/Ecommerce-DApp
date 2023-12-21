import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: JSON.parse(localStorage.getItem('cart')) || [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productId, quantity } = action.payload;
      const matchingItem = state.cart.find((cartItem) => cartItem.productId === productId);

      if (matchingItem) {
        matchingItem.quantity += quantity;
        localStorage.setItem('cart', JSON.stringify(state.cart));
        return state;
      }

      const updatedCart = {
        ...state,
        cart: [
          ...state.cart,
          {
            productId,
            quantity: quantity || 1,
            deliveryOptionId: '1',
          },
        ],
      };
      localStorage.setItem('cart', JSON.stringify(updatedCart.cart));
      return updatedCart;
    },
    removeFromCart: (state, action) => {
      const { productId } = action.payload;
      const updatedCart = {
        ...state,
        cart: state.cart.filter((cartItem) => cartItem.productId !== productId),
      };
      localStorage.setItem('cart', JSON.stringify(updatedCart.cart));
      return updatedCart;
    },
    updateDeliveryOption: (state, action) => {
      const { productId, deliveryOptionId } = action.payload;
      const updatedCart = {
        ...state,
        cart: state.cart.map((cartItem) => (cartItem.productId === productId
          ? { ...cartItem, deliveryOptionId }
          : cartItem)),
      };
      localStorage.setItem('cart', JSON.stringify(updatedCart.cart));
      return updatedCart;
    },
  },
});

export const { addToCart, removeFromCart, updateDeliveryOption } = cartSlice.actions;

export const selectCart = (state) => state.cart.cart;
export const selectCartLength = (state) => state.cart.cart.reduce((total, cartItem) => total
+ cartItem.quantity, 0);

export default cartSlice.reducer;
