import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { toast, ToastContainer } from 'react-toastify';
import {
  selectCart, removeFromCart, updateDeliveryOption, selectCartLength,
} from '../data/cart';
import products from '../data/products';
import formatCurrency from '../utils/money';
import deliveryOptions from '../data/deliveryOptions';
import '../styles/shared/general.css';
import '../styles/pages/checkout/checkout-header.css';
import '../styles/pages/checkout/checkout.css';
import 'react-toastify/dist/ReactToastify.css';
import checkoutLockIcon from '../images/icons/checkout-lock-icon.png';
import kwuvamobilelogo from '../images/kwuva-mobile-logo.png';
import kwuvalogo from '../images/kwuva-logo.png';

const PaymentProcessorABI = [
  {
    inputs: [],
    name: 'InvalidInitialization',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotInitializing',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'version',
        type: 'uint64',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'payer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'paymentId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'date',
        type: 'uint256',
      },
    ],
    name: 'PaymentDone',
    type: 'event',
  },
  {
    inputs: [],
    name: 'admin',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'paymentId',
        type: 'uint256',
      },
    ],
    name: 'placeOrder',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newAdmin',
        type: 'address',
      },
    ],
    name: 'setNewAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdrawProfits',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  }];
const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [orderTotal, setOrderTotal] = useState(0);
  const cartQuantity = useSelector(selectCartLength);
  const cart = useSelector(selectCart);

  const calculateOrderTotal = () => {
    let total = 0;
    cart.forEach((cartItem) => {
      const { productId } = cartItem;
      const matchingProduct = products.find((product) => product.id === productId);

      const { deliveryOptionId } = cartItem;
      const deliveryOption = deliveryOptions.find((option) => option.id === deliveryOptionId);

      const productPrice = matchingProduct.priceCents;
      const deliveryPrice = deliveryOption.priceCents;

      total += productPrice * cartItem.quantity + deliveryPrice;
    });

    return total;
  };

  const handleQuantityUpdate = () => {
    const newTotal = calculateOrderTotal();
    setOrderTotal(newTotal);
  };

  const generateCartItems = (cartItems) => cartItems.map((cartItem) => {
    const { productId } = cartItem;
    const matchingProduct = products.find((product) => product.id === productId);

    const { deliveryOptionId } = cartItem;
    const deliveryOption = deliveryOptions.find((option) => option.id === deliveryOptionId);

    const today = new Date();
    const deliveryDate = new Date(today.getTime()
   + (deliveryOption.deliveryDays * 24 * 60 * 60 * 1000));
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayOfWeek = days[deliveryDate.getDay()];
    const month = months[deliveryDate.getMonth()];
    const dayOfMonth = deliveryDate.getDate();

    const dateString = `${dayOfWeek}, ${month} ${dayOfMonth}`;

    return {
      productId: cartItem.productId,
      matchingProductId: matchingProduct.id,
      deliveryDate: dateString,
      productImage: matchingProduct.image,
      productName: matchingProduct.name,
      productPrice: `$TLOS ${formatCurrency(matchingProduct.priceCents)}`,
      quantity: cartItem.quantity,
      deliveryOptionId: deliveryOption.id,
    };
  });

  const handleDeleteLinkClick = (productId) => {
    dispatch(removeFromCart({ productId }));
    const updatedCart = cart.filter((item) => item.productId !== productId);
    generateCartItems(updatedCart);
    return updatedCart;
  };

  const handleDeliveryOptionChange = (productId, deliveryOptionId) => {
    dispatch(updateDeliveryOption({ productId, deliveryOptionId }));
    const newTotal = calculateOrderTotal();
    setOrderTotal(newTotal);
  };

  const deliveryOptionsHTML = (matchingProduct, cartItem) => {
    const matchingProductId = matchingProduct;

    return deliveryOptions.map((deliveryOption) => {
      const today = new Date();
      const deliveryDate = new Date(today.getTime()
      + deliveryOption.deliveryDays * 24 * 60 * 60 * 1000);

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const dayOfWeek = days[deliveryDate.getDay()];
      const month = months[deliveryDate.getMonth()];
      const dayOfMonth = deliveryDate.getDate();

      const dateString = `${dayOfWeek}, ${month} ${dayOfMonth}`;

      const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$TLOS ${formatCurrency(deliveryOption.priceCents)} -`;
      const ischecked = deliveryOption.id === cartItem;

      return (
        <div
          key={deliveryOption.id}
          className="delivery-option js-delivery-option"
          data-product-id={matchingProductId}
          data-delivery-option-id={deliveryOption.id}
          onClick={() => handleDeliveryOptionChange(matchingProductId, deliveryOption.id)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              handleDeliveryOptionChange(matchingProductId, deliveryOption.id);
            }
          }}
          role="button"
          tabIndex={0}
        >
          <input
            type="radio"
            checked={ischecked}
            onChange={() => {
              handleDeliveryOptionChange(matchingProductId, deliveryOption.id);
            }}
            className="delivery-option-input"
            name={`delivery-option-${matchingProductId}`}
          />
          <div>
            <div className="delivery-option-date">{dateString}</div>
            <div className="delivery-option-price">
              {priceString}
              {' '}
              Shipping
            </div>
          </div>
        </div>
      );
    });
  };

  const renderCartItems = () => {
    const processedItems = generateCartItems(cart);
    return processedItems.map((item) => (
      <div key={item.productId} className={`cart-item-container js-cart-item-container-${item.matchingProductId}`}>
        <div className="delivery-date">
          Delivery date:
          {' '}
          {item.deliveryDate}
        </div>

        <div className="cart-item-details-grid">
          <img className="product-image" src={item.productImage} alt="Product" />

          <div className="cart-item-details">
            <div className="product-name">{item.productName}</div>
            <div className="product-price">{item.productPrice}</div>
            <div className="product-quantity">
              <span>
                Quantity:
                {' '}
                <span className="quantity-label">{item.quantity}</span>
              </span>
              <button type="submit" className="update-quantity-link link-primary" onClick={handleQuantityUpdate}>
                Update
              </button>
              <button
                type="submit"
                className="delete-quantity-link link-primary js-delete-link"
                data-product-id={item.matchingProductId}
                onClick={() => handleDeleteLinkClick(item.matchingProductId)}
              >
                Delete
              </button>
            </div>
          </div>

          <div className="delivery-options">
            <div className="delivery-options-title">Choose a delivery option:</div>
            {deliveryOptionsHTML(item.matchingProductId, item.deliveryOptionId)}
          </div>
        </div>
      </div>
    ));
  };

  useEffect(() => {
    generateCartItems(cart);
  }, [cart]);

  useEffect(() => {
    const newTotal = calculateOrderTotal();
    setOrderTotal(newTotal);
  }, [cart]);

  const handleCheckout = async (total, paymentId) => {
    try {
      if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const paymentProcessorAddress = '0x473d98DeD2F941532aD112e03739C2A8f6Cd5F24';
        const paymentProcessorContract = new ethers.Contract(
          paymentProcessorAddress,
          PaymentProcessorABI,
          provider.getSigner(),
        );

        const transaction = await paymentProcessorContract.placeOrder(
          paymentId,
          { value: total, gasLimit: 3000000 },
        );

        try {
          await transaction.wait();
          toast.success('Payment successful', { autoClose: 10000 });
        } catch (error) {
          console.error('Error fetching transaction receipt:', error);
        }
      } else {
        toast.success('lease install MetaMask', { autoClose: 10000 });
      }
    } catch (error) {
      console.error('Error during payment:', error);
    }
  };

  const handlePlaceOrder = () => {
    const totalAmount = calculateOrderTotal();
    const convTotal = formatCurrency(totalAmount);
    const totalAmountWei = ethers.utils.parseUnits(convTotal, 'ether');
    const paymentIdentifier = Math.floor(Math.random() * 1000);
    handleCheckout(totalAmountWei, paymentIdentifier);
  };
  const handlenavigation = () => {
    navigate('/');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handlenavigation();
    }
  };

  return (
    <div>
      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <div
              role="button"
              tabIndex={0}
              onClick={handlenavigation}
              onKeyDown={handleKeyDown}
            >
              <img className="kwuva-logo" src={kwuvalogo} alt="Kwuva Logo" />
              <img className="kwuva-mobile-logo" src={kwuvamobilelogo} alt="Mobile Kwuva Logo" />
            </div>
          </div>

          <div className="checkout-header-middle-section">
            Checkout (
            <a className="return-to-home-link" href="./index.html">{cartQuantity}</a>
            )
          </div>

          <div className="checkout-header-right-section">
            <img src={checkoutLockIcon} alt="Checkout Lock Icon" />
          </div>
        </div>
      </div>

      <div className="main">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <div className="order-summary js-order-summary">{renderCartItems()}</div>

          <div className="payment-summary">
            <div className="payment-summary-title">Order Summary</div>

            <div className="payment-summary-row">
              <div>
                Items (
                {cartQuantity}
                ):
              </div>
              <div className="payment-summary-money">TLOS 42.75</div>
            </div>

            <div className="payment-summary-row">
              <div>Shipping &amp; handling:</div>
              <div className="payment-summary-money">TLOS 4.99</div>
            </div>

            <div className="payment-summary-row subtotal-row">
              <div>Total before tax:</div>
              <div className="payment-summary-money">TLOS 47.74</div>
            </div>

            <div className="payment-summary-row">
              <div>Estimated tax (10%):</div>
              <div className="payment-summary-money">TLOS 4.77</div>
            </div>

            <div className="payment-summary-row total-row">
              <div>Order total:</div>
              <div className="payment-summary-money">
                TLOS
                {formatCurrency(orderTotal)}
              </div>
            </div>

            <button type="submit" className="place-order-button button-primary" onClick={handlePlaceOrder}>
              Place your order
            </button>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
